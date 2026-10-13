const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");
const { rateLimit } = require("express-rate-limit");
const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
require("dotenv").config();

const app = express();
const publicDirectory = __dirname;
const paymentSlipDirectory = path.resolve(
  process.env.PRIVATE_UPLOAD_DIR || path.join(__dirname, "..", ".asoka-private", "payment-slips")
);
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const allowedExtensions = new Set(["jpg", "png", "webp", "pdf"]);
const publicFiles = new Set([
  "index.html",
  "styles.css",
  "app.js",
  "auth.js",
  "firebase-config.js",
  "download.jpg",
]);
const smtpUser = process.env.SMTP_USER?.trim();
const smtpPass = process.env.SMTP_PASS?.trim();
const emailFrom = process.env.EMAIL_FROM?.trim();
const smtpPort = Number(process.env.SMTP_PORT || 587);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: smtpPort,
  secure: smtpPort === 465,
  ...(smtpUser && smtpPass ? { auth: { user: smtpUser, pass: smtpPass } } : {}),
});

let firebaseAuth;
let firestore;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  const firebaseApp = getApps()[0] || initializeApp({ credential: cert(serviceAccount) });
  firebaseAuth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);
}

if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
  next();
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 8, parts: 9 },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error("Payment slip must be a JPG, PNG, WEBP, or PDF file."));
      return;
    }
    callback(null, true);
  },
});

const orderRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many order attempts. Please try again in 15 minutes." },
});

function parsePaymentSlip(req, res, next) {
  upload.single("paymentSlip")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }
    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === "LIMIT_FILE_SIZE";
      res.status(tooLarge ? 413 : 400).json({
        success: false,
        message: tooLarge ? "Payment slip must be 5 MB or smaller." : "Upload one payment slip file only.",
      });
      return;
    }
    if (error.message === "Payment slip must be a JPG, PNG, WEBP, or PDF file.") {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  });
}

async function requireFirebaseUser(req, res, next) {
  if (!firebaseAuth || !firestore) {
    res.status(503).json({ success: false, message: "Order submission is not configured on the server yet." });
    return;
  }
  const match = req.get("authorization")?.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    res.status(401).json({ success: false, message: "Sign in with your approved student account to submit an order." });
    return;
  }
  try {
    req.firebaseUser = await firebaseAuth.verifyIdToken(match[1]);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Your session expired. Sign in again and retry." });
  }
}

async function requireApprovedAdmin(req, res, next) {
  try {
    const profile = await firestore.collection("users").doc(req.firebaseUser.uid).get();
    const data = profile.data();
    if (!profile.exists ||
        !["admin", "main_admin"].includes(data?.role) ||
        data?.status !== "approved" ||
        data?.approved !== true) {
      res.status(403).json({ success: false, message: "Only an approved society admin can access payment slips." });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
}

function getFileDetails(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { extension: "jpg", contentType: "image/jpeg" };
  }
  if (buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { extension: "png", contentType: "image/png" };
  }
  if (buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP") {
    return { extension: "webp", contentType: "image/webp" };
  }
  if (buffer.length >= 5 && buffer.toString("ascii", 0, 5) === "%PDF-") {
    return { extension: "pdf", contentType: "application/pdf" };
  }
  return null;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function sendConfirmationEmail(order) {
  return transporter.sendMail({
    from: `"Asoka Vidyalaya Science Society" <${emailFrom}>`,
    to: order.email,
    subject: "T-shirt pre-order confirmation",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1d1a1a">
      <h2>Asoka Vidyalaya Science Society</h2>
      <p>Dear <strong>${escapeHtml(order.name)}</strong>, we received your T-shirt pre-order and payment slip.</p>
      <p>Size: ${escapeHtml(order.size)} · Quantity: ${order.quantity}</p>
      <p>Order reference: ${order.reference}</p>
      <p>The society committee will confirm the payment and collection details.</p>
    </div>`,
  });
}

app.post(
  "/api/preorder",
  orderRateLimit,
  requireFirebaseUser,
  parsePaymentSlip,
  async (req, res, next) => {
    const { uid, email } = req.firebaseUser;
    const normalized = {
      name: typeof req.body.name === "string" ? req.body.name.trim() : "",
      admission: typeof req.body.admission === "string" ? req.body.admission.trim() : "",
      grade: typeof req.body.grade === "string" ? req.body.grade.trim() : "",
      phone: typeof req.body.phone === "string" ? req.body.phone.trim() : "",
      size: typeof req.body.size === "string" ? req.body.size : "",
      quantity: Number(req.body.quantity),
    };
    const validSizes = new Set(["S", "M", "L", "XL", "XXL"]);
    if (!normalized.name || normalized.name.length > 80 ||
        !normalized.admission || normalized.admission.length > 20 ||
        !normalized.grade || normalized.grade.length > 30 ||
        !/^[0-9+ ]{7,16}$/.test(normalized.phone) ||
        !validSizes.has(normalized.size) ||
        !Number.isInteger(normalized.quantity) || normalized.quantity < 1 || normalized.quantity > 10) {
      res.status(400).json({ success: false, message: "Please check the order details and try again." });
      return;
    }
    if (!req.file) {
      res.status(400).json({ success: false, message: "Upload your payment slip to submit the order." });
      return;
    }
    const fileDetails = getFileDetails(req.file.buffer);
    if (!fileDetails || !allowedExtensions.has(fileDetails.extension)) {
      res.status(400).json({ success: false, message: "The uploaded file is not a valid JPG, PNG, WEBP, or PDF." });
      return;
    }

    try {
      const studentProfile = await firestore.collection("users").doc(uid).get();
      const profile = studentProfile.data();
      if (!studentProfile.exists ||
          profile?.role !== "student" ||
          profile?.status !== "approved" ||
          profile?.approved !== true ||
          profile?.email !== email) {
        res.status(403).json({ success: false, message: "Only approved student accounts can place a pre-order." });
        return;
      }

      const reference = randomUUID();
      const filename = `${reference}.${fileDetails.extension}`;
      const slipPath = path.join(paymentSlipDirectory, filename);
      let orderId;
      await fs.mkdir(paymentSlipDirectory, { recursive: true, mode: 0o700 });
      await fs.writeFile(slipPath, req.file.buffer, { flag: "wx", mode: 0o600 });
      try {
        const order = {
          uid,
          ...normalized,
          email,
          paymentSlip: filename,
          reference,
          createdAt: FieldValue.serverTimestamp(),
        };
        const orderRef = await firestore.collection("orders").add(order);
        orderId = orderRef.id;
      } catch (error) {
        await fs.unlink(slipPath);
        throw error;
      }

      if (!smtpUser || !smtpPass || !emailFrom || emailFrom.startsWith("your-")) {
        res.status(201).json({
          success: true,
          emailSent: false,
          message: `Order saved. Confirmation email is not configured yet. Reference: ${reference}.`,
        });
        return;
      }
      try {
        await sendConfirmationEmail({ ...normalized, email, reference });
        res.status(201).json({
          success: true,
          emailSent: true,
          message: `Pre-order submitted and confirmation email sent. Reference: ${reference}.`,
        });
      } catch (error) {
        console.error(`Order email failed (code=${error.code || "UNKNOWN"}) for order ${orderId}`);
        res.status(201).json({
          success: true,
          emailSent: false,
          message: `Order saved, but the confirmation email could not be sent. Reference: ${reference}.`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

app.get("/api/admin/orders/:orderId/payment-slip", requireFirebaseUser, requireApprovedAdmin, async (req, res, next) => {
  try {
    if (!/^[A-Za-z0-9_-]{1,150}$/.test(req.params.orderId)) {
      res.status(400).json({ success: false, message: "Invalid order reference." });
      return;
    }
    const orderSnapshot = await firestore.collection("orders").doc(req.params.orderId).get();
    const filename = orderSnapshot.data()?.paymentSlip;
    if (!orderSnapshot.exists || typeof filename !== "string") {
      res.status(404).json({ success: false, message: "No payment slip is attached to this order." });
      return;
    }
    const match = filename.match(/^([0-9a-f-]{36})\.(jpg|png|webp|pdf)$/i);
    if (!match) {
      res.status(404).json({ success: false, message: "The payment slip could not be found." });
      return;
    }
    const filePath = path.join(paymentSlipDirectory, path.basename(filename));
    const file = await fs.readFile(filePath);
    const details = getFileDetails(file);
    if (!details) {
      res.status(404).json({ success: false, message: "The payment slip file is invalid." });
      return;
    }
    res.setHeader("Content-Type", details.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="payment-slip-${match[1]}.${details.extension}"`);
    res.setHeader("Cache-Control", "private, no-store");
    res.send(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ success: false, message: "The payment slip file could not be found." });
      return;
    }
    next(error);
  }
});

app.get("/", (req, res) => res.sendFile(path.join(publicDirectory, "index.html")));
app.get("/:file", (req, res, next) => {
  if (!publicFiles.has(req.params.file)) {
    next();
    return;
  }
  res.sendFile(path.join(publicDirectory, req.params.file));
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "The requested page or endpoint was not found." });
});

app.use((error, req, res, next) => {
  console.error(`Request processing failed (${error.code || error.name || "UNKNOWN"})`);
  if (res.headersSent) {
    next(error);
    return;
  }
  res.status(500).json({ success: false, message: "The server could not process the request." });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Asoka Science Society site running on http://localhost:${port}`);
  if (!firebaseAuth) console.warn("Firebase service account is not configured; pre-orders are disabled.");
});
