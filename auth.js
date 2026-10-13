const MAIN_ADMIN_EMAIL = "ashenperera993@gmail.com";
const FIREBASE_VERSION = "13.0.0";
const ENABLE_FIREBASE = true;
let auth;
let database;
let modules;
let currentProfile = null;
let ordersUnsubscribe;
let approvalUnsubscribe;
let firebaseConfigured = false;

window.asokaFirebaseConfigured = false;
window.asokaLocalDemoMode = false;

function getLocalAccounts() {
  try {
    const saved = JSON.parse(localStorage.getItem("asoka-local-accounts") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveLocalAccounts(accounts) {
  localStorage.setItem("asoka-local-accounts", JSON.stringify(accounts));
}

function ensureLocalDemoAdmin() {
  return getLocalAccounts();
}

function createLocalProfileFromValues(values, uid) {
  const email = String(values.email || "").trim().toLowerCase();
  const isMainAdmin = email === MAIN_ADMIN_EMAIL;
  const role = isMainAdmin ? "main_admin" : (values.role || "student");
  return {
    uid,
    name: String(values.name || "").trim(),
    email,
    password: String(values.password || ""),
    role,
    status: isMainAdmin ? "approved" : "pending",
    approved: isMainAdmin,
    createdAt: new Date().toISOString(),
  };
}

function setLocalProfile(profile) {
  const safeProfile = { ...profile };
  delete safeProfile.password;
  const normalized = normalizeProfile({ ...safeProfile, approved: safeProfile.approved ?? safeProfile.status === "approved" }, safeProfile.uid || "local-user");
  currentProfile = normalized;
  sessionStorage.setItem("asoka-account-profile", JSON.stringify(normalized));
  if (["admin", "main_admin"].includes(normalized.role) && normalized.status === "approved") sessionStorage.setItem("asoka-admin-auth", "true");
  else sessionStorage.removeItem("asoka-admin-auth");
  window.asokaLocalDemoMode = true;
  if (["/admin/login", "/register"].includes(route())) {
    const target = normalized.role === "student" ? "/pre-order" : "/admin/dashboard";
    location.hash = target;
    window.render?.();
  }
}

function localAccountError(message) {
  setMessage(message, true);
}

const escapeText = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const route = () => (location.hash.replace(/^#/, "") || "/").replace(/\/$/, "") || "/";

function setMessage(message, isError = false) {
  const target = document.querySelector(isError ? "#login-error, #register-error" : "#auth-message");
  if (!target) return;
  target.textContent = message;
  target.hidden = false;
}

function setSession(profile) {
  currentProfile = normalizeProfile(profile);
  sessionStorage.setItem("asoka-account-profile", JSON.stringify(currentProfile));
  if (["admin", "main_admin"].includes(currentProfile.role) && currentProfile.status === "approved") sessionStorage.setItem("asoka-admin-auth", "true");
  else sessionStorage.removeItem("asoka-admin-auth");
}

function normalizeProfile(profile, uid) {
  const role = profile.role === "main-admin" ? "main_admin" : profile.role;
  const status = profile.status || (profile.approved === true ? "approved" : "pending");
  return { ...profile, ...(uid ? { uid } : {}), role, status, approved: profile.approved ?? status === "approved" };
}

function clearSession() {
  currentProfile = null;
  sessionStorage.removeItem("asoka-account-profile");
  sessionStorage.removeItem("asoka-admin-auth");
  ordersUnsubscribe?.();
  approvalUnsubscribe?.();
  ordersUnsubscribe = undefined;
  approvalUnsubscribe = undefined;
}

function bindRegistrationForm() {
  const form = document.querySelector("#register-form");
  if (!form || form.dataset.firebaseBound) return;
  form.dataset.firebaseBound = "true";
  const roleSelect = form.elements.namedItem("role");
  const emailInput = form.elements.namedItem("email");
  const studentFields = [...form.querySelectorAll(".student-fields")];
  const mainAdminOption = roleSelect.querySelector('option[value="main_admin"]');
  const updateStudentFields = () => {
    const isMainAdmin = emailInput.value.trim().toLowerCase() === MAIN_ADMIN_EMAIL;
    mainAdminOption.hidden = !isMainAdmin;
    roleSelect.disabled = isMainAdmin;
    if (isMainAdmin) roleSelect.value = "main_admin";
    else if (roleSelect.value === "main_admin") roleSelect.value = "student";
    const needsStudentInfo = roleSelect.value === "student";
    studentFields.forEach((field) => {
      field.hidden = !needsStudentInfo;
      const input = field.querySelector("input");
      input.required = needsStudentInfo;
    });
  };
  roleSelect.addEventListener("change", updateStudentFields);
  emailInput.addEventListener("input", updateStudentFields);
  updateStudentFields();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    const email = String(values.email || "").trim().toLowerCase();
    const isMainAdmin = email === MAIN_ADMIN_EMAIL;
    const role = isMainAdmin ? "main_admin" : (values.role || "student");

    if (!firebaseConfigured) {
      if (!window.asokaLocalDemoMode) {
        setMessage("Firebase is not ready. Check the connection and try again.", true);
        return;
      }
      const accounts = getLocalAccounts();
      if (accounts.some((account) => account.email === email)) {
        setMessage("An account already uses that email. Try signing in instead.", true);
        return;
      }
      if (values.password && values.password.length < 8) {
        setMessage("Use a password with at least 8 characters.", true);
        return;
      }
      const localProfile = createLocalProfileFromValues(values, `local-${Date.now()}`);
      accounts.push(localProfile);
      saveLocalAccounts(accounts);
      setMessage(isMainAdmin
        ? "The local admin account is ready. Use the same email and password to sign in, and this admin account will be treated as approved."
        : "Registration received. In local demo mode, your account is saved on this device and can be approved by the main administrator account.");
      window.asokaLocalDemoMode = true;
      form.reset();
      updateStudentFields();
      return;
    }

    try {
      const credential = await modules.auth.createUserWithEmailAndPassword(auth, email, values.password);
      await modules.auth.sendEmailVerification(credential.user);
      if (!isMainAdmin) {
        const profile = {
          name: values.name.trim(),
          email,
          role,
          status: "pending",
          approved: false,
          createdAt: modules.firestore.serverTimestamp(),
        };
        if (role === "student") Object.assign(profile, { admission: values.admission.trim(), grade: values.grade.trim(), phone: values.phone.trim() });
        await modules.firestore.setDoc(modules.firestore.doc(database, "users", credential.user.uid), profile);
      }
      await modules.auth.signOut(auth);
      setMessage(isMainAdmin
        ? "Check this inbox to verify the main-admin address, then sign in. Its verified Firebase account is the approval authority."
        : "Registration received. Verify your email, then wait for the main administrator to approve your account.");
      form.reset();
      updateStudentFields();
    } catch (error) {
      if (auth?.currentUser) await modules.auth.signOut(auth).catch(() => {});
      setMessage(friendlyError(error), true);
    }
  });
}

function friendlyError(error) {
  const known = {
    "auth/email-already-in-use": "An account already uses that email. Try signing in instead.",
    "auth/invalid-credential": "The email or password was not accepted.",
    "auth/weak-password": "Use a password with at least 8 characters.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/network-request-failed": "Could not reach Firebase. Check your connection and authorized domains, then try again.",
    "permission-denied": "Firebase denied this action. Check that the Firestore rules are deployed.",
  };
  return known[error.code] || error.message || "Something went wrong. Please try again.";
}

async function ensureMainAdminProfile(user) {
  const reference = modules.firestore.doc(database, "users", user.uid);
  const snapshot = await modules.firestore.getDoc(reference);
  if (!snapshot.exists()) {
    await modules.firestore.setDoc(reference, {
      name: user.displayName || "Main administrator",
      email: MAIN_ADMIN_EMAIL,
      role: "main_admin",
      status: "approved",
      approved: true,
      createdAt: modules.firestore.serverTimestamp(),
    });
    return { name: user.displayName || "Main administrator", email: MAIN_ADMIN_EMAIL, role: "main_admin", status: "approved", approved: true };
  }
  return normalizeProfile(snapshot.data(), user.uid);
}

async function completeLogin(user) {
  if (!user.emailVerified) {
    await modules.auth.signOut(auth);
    setMessage("Verify your email before signing in. Check the inbox for the address you registered.", true);
    return false;
  }
  let profile;
  if ((user.email || "").toLowerCase() === MAIN_ADMIN_EMAIL) {
    profile = await ensureMainAdminProfile(user);
  } else {
    const reference = modules.firestore.doc(database, "users", user.uid);
    const snapshot = await modules.firestore.getDoc(reference);
    if (!snapshot.exists()) {
      profile = {
        name: user.displayName || (user.email || "student").split("@")[0],
        email: (user.email || "").toLowerCase(),
        role: "student",
        status: "pending",
        approved: false,
        createdAt: modules.firestore.serverTimestamp(),
      };
      await modules.firestore.setDoc(reference, profile);
      profile.createdAt = new Date().toISOString();
      profile.uid = user.uid;
    } else {
      profile = normalizeProfile(snapshot.data(), user.uid);
    }
  }
  profile = normalizeProfile(profile, user.uid);
  if (profile.status !== "approved") {
    await modules.auth.signOut(auth);
    setMessage(profile.status === "rejected" ? "This account request was not approved. Contact the society." : "Your account is awaiting main-admin approval.", true);
    return false;
  }
  setSession(profile);
  if (route() === "/admin/login" || route() === "/register") {
    const target = profile.role === "student" ? "/pre-order" : "/admin/dashboard";
    location.hash = target;
    window.render?.();
    return true;
  }
  window.render?.();
  return true;
}

function bindLoginForm() {
  const form = document.querySelector("#login-form");
  if (!form || form.dataset.firebaseBound) return;
  form.dataset.firebaseBound = "true";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const email = String(values.get("email") || "").trim().toLowerCase();
    const password = String(values.get("password") || "");

    if (!firebaseConfigured) {
      if (!window.asokaLocalDemoMode) {
        setMessage("Firebase is not ready. Check the connection and try again.", true);
        return;
      }
      const accounts = ensureLocalDemoAdmin();
      const match = accounts.find((account) => account.email === email && account.password === password);
      if (!match) {
        setMessage("No society account was found for this email. Register first.", true);
        return;
      }
      if (match.status !== "approved") {
        setMessage(match.status === "rejected" ? "This account request was not approved. Contact the society." : "Your account is awaiting main-admin approval.", true);
        return;
      }
      setLocalProfile(match);
      if (route() === "/admin/login" || route() === "/register") {
        const target = match.role === "student" ? "/pre-order" : "/admin/dashboard";
        location.hash = target;
        window.render?.();
        return;
      }
      window.render?.();
      return;
    }

    try {
      const result = await modules.auth.signInWithEmailAndPassword(auth, email, password);
      await modules.auth.reload(result.user);
      await completeLogin(result.user);
    } catch (error) {
      setMessage(friendlyError(error), true);
    }
  });
}

window.asokaBindAuthForms = () => {
  bindLoginForm();
  bindRegistrationForm();
};

function renderApprovalQueue(profiles) {
  let panel = document.querySelector("#pending-approval-panel");
  if (!panel) {
    panel = document.createElement("section");
    panel.id = "pending-approval-panel";
    panel.className = "admin-panel approval-panel";
    panel.setAttribute("aria-labelledby", "pending-approvals-title");
    const dashboardGrid = document.querySelector(".admin-grid");
    if (!dashboardGrid) return;
    dashboardGrid.insertAdjacentElement("beforebegin", panel);
  }
  const markup = `<div class="admin-panel-head"><h2 id="pending-approvals-title">Pending user approvals</h2><span class="eyebrow" role="status" aria-live="polite">${profiles.length} pending</span></div><div class="table-wrap" role="region" aria-label="Pending user approvals" tabindex="0"><table class="data-table"><caption class="sr-only">Pending user approvals</caption><thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Type</th><th scope="col">Grade / class</th><th scope="col">Action</th></tr></thead><tbody>${profiles.length ? profiles.map((profile) => `<tr><th scope="row">${escapeText(profile.name)}</th><td>${escapeText(profile.email)}</td><td>${escapeText(profile.role === "main-admin" ? "Main admin" : profile.role)}</td><td>${escapeText(profile.grade || "—")}</td><td><div class="approval-actions"><button type="button" aria-label="Approve ${escapeText(profile.name)}" data-approve-account="${escapeText(profile.id)}">Approve</button><button type="button" aria-label="Reject ${escapeText(profile.name)}" data-reject-account="${escapeText(profile.id)}">Reject</button></div></td></tr>`).join("") : "<tr><td colspan=\"5\" class=\"empty-table\">No pending user approvals.</td></tr>"}</tbody></table></div>`;
  if (panel.innerHTML === markup) return;
  panel.innerHTML = markup;
  panel.querySelectorAll("[data-approve-account]").forEach((button) => button.addEventListener("click", () => reviewAccount(button.dataset.approveAccount, "approved")));
  panel.querySelectorAll("[data-reject-account]").forEach((button) => button.addEventListener("click", () => reviewAccount(button.dataset.rejectAccount, "rejected")));
}

async function reviewAccount(uid, status) {
  if (!firebaseConfigured) {
    const accounts = getLocalAccounts();
    const accountIndex = accounts.findIndex((account) => account.uid === uid);
    if (accountIndex < 0) return renderApprovalQueueError("That account request could not be found.");
    accounts[accountIndex] = {
      ...accounts[accountIndex],
      status,
      approved: status === "approved",
      reviewedAt: new Date().toISOString(),
      reviewedBy: currentProfile?.uid || "local-main-admin",
    };
    saveLocalAccounts(accounts);
    renderApprovalQueue(getLocalPendingProfiles());
    return;
  }
  try {
    await modules.firestore.updateDoc(modules.firestore.doc(database, "users", uid), {
      status,
      approved: status === "approved",
      reviewedAt: modules.firestore.serverTimestamp(),
      reviewedBy: auth.currentUser.uid,
    });
  } catch (error) {
    renderApprovalQueueError(friendlyError(error));
  }
}

function getLocalPendingProfiles() {
  return getLocalAccounts()
    .filter((account) => account.status === "pending")
    .map((account) => ({ ...account, id: account.uid }));
}

function renderApprovalQueueError(message) {
  const panel = document.querySelector("#pending-approval-panel");
  if (panel) panel.insertAdjacentHTML("beforeend", `<p class="auth-error" role="alert">${escapeText(message)}</p>`);
}

function subscribeToApprovals() {
  if (approvalUnsubscribe) return;
  const pendingQuery = modules.firestore.query(modules.firestore.collection(database, "users"), modules.firestore.where("approved", "==", false));
  approvalUnsubscribe = modules.firestore.onSnapshot(pendingQuery, (snapshot) => {
    const profiles = snapshot.docs.map((item) => ({ ...item.data(), id: item.id })).filter((profile) => profile.status !== "rejected");
    if (route() === "/admin/dashboard" && currentProfile?.role === "main_admin") renderApprovalQueue(profiles);
  }, (error) => renderApprovalQueueError(friendlyError(error)));
}

function subscribeToOrders() {
  if (ordersUnsubscribe || !["admin", "main_admin"].includes(currentProfile?.role)) return;
  ordersUnsubscribe = modules.firestore.onSnapshot(modules.firestore.collection(database, "orders"), (snapshot) => {
    const orders = snapshot.docs.map((item) => {
      const order = item.data();
      return { ...order, id: item.id, createdAt: order.createdAt?.toDate?.().toISOString() || "" };
    });
    const serialized = JSON.stringify(orders);
    if (localStorage.getItem("asoka-orders") !== serialized) {
      localStorage.setItem("asoka-orders", serialized);
      if (route() === "/admin/dashboard") window.render?.();
    }
  }, (error) => renderApprovalQueueError(friendlyError(error)));
}

function setupDashboard() {
  if (route() !== "/admin/dashboard" || !currentProfile) return;
  subscribeToOrders();
  if (currentProfile.role === "main_admin") subscribeToApprovals();
}

function setupRoute() {
  bindLoginForm();
  bindRegistrationForm();
  if (!firebaseConfigured) {
    if (ENABLE_FIREBASE) {
      window.asokaLocalDemoMode = false;
      if (route() === "/admin/login" || route() === "/register") {
        setMessage("Firebase is not connected yet. Check the project configuration and network connection.", true);
      }
      return;
    }
    ensureLocalDemoAdmin();
    window.asokaLocalDemoMode = true;
    try {
      const savedProfile = JSON.parse(sessionStorage.getItem("asoka-account-profile") || "null");
      currentProfile = savedProfile ? normalizeProfile(savedProfile) : null;
    } catch {
      currentProfile = null;
    }
    if (route() === "/admin/login" || route() === "/register") {
      setMessage("Local demo mode is active. The site works without Firebase, while the real Firebase project is still being configured.");
    } else if (route() === "/admin/dashboard" && currentProfile?.role === "main_admin" && currentProfile.status === "approved") {
      renderApprovalQueue(getLocalPendingProfiles());
    }
    return;
  }
  setupDashboard();
}

window.asokaSignOut = async () => {
  if (auth) await modules.auth.signOut(auth);
  clearSession();
  location.hash = "/admin/login";
};

function apiUrl(path) {
  const baseUrl = (window.ASOKA_API_BASE_URL || "").trim().replace(/\/+$/, "");
  return `${baseUrl}${path}`;
}

window.asokaCreateOrder = async (formData) => {
  if (!auth?.currentUser || currentProfile?.role !== "student" || currentProfile.status !== "approved") {
    location.hash = "/admin/login";
    return;
  }
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(apiUrl("/api/preorder"), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      throw new Error("The pre-order API is not available. Set the Node.js server URL in api-config.js and allow this website in the server's CORS_ORIGINS setting. GitHub Pages cannot process pre-orders by itself.");
    }
    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("The pre-order server returned an invalid response. Please try again later.");
    }
    if (!response.ok || !result.success) {
      const status = document.querySelector("#order-status");
      if (status) {
        status.setAttribute("role", "alert");
        status.setAttribute("aria-live", "assertive");
        status.textContent = result.message || "Could not submit the pre-order. Please try again.";
      }
      return;
    }
    sessionStorage.setItem("asoka-order-success", result.message);
    window.render?.();
  } catch (error) {
    const status = document.querySelector("#order-status");
    if (status) {
      status.setAttribute("role", "alert");
      status.setAttribute("aria-live", "assertive");
      status.textContent = error instanceof TypeError
        ? "Could not reach the order server. Check your connection and try again."
        : friendlyError(error);
    }
  }
};

window.asokaDownloadPaymentSlip = async (orderId) => {
  if (!auth?.currentUser) {
    location.hash = "/admin/login";
    return;
  }
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(apiUrl(`/api/admin/orders/${encodeURIComponent(orderId)}/payment-slip`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      let result;
      try { result = await response.json(); } catch { result = null; }
      throw new Error(result?.message || "Could not download this payment slip.");
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payment-slip";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    const status = document.querySelector("#orders-status");
    if (status) {
      status.setAttribute("role", "alert");
      status.setAttribute("aria-live", "assertive");
      status.textContent = error instanceof TypeError
        ? "Could not reach the order server. Check your connection and try again."
        : error.message;
    }
  }
};

window.asokaUpdateOrder = async (id, changes) => {
  try { await modules.firestore.updateDoc(modules.firestore.doc(database, "orders", id), changes); }
  catch (error) { renderApprovalQueueError(friendlyError(error)); }
};

window.asokaDeleteOrder = async (id) => {
  try { await modules.firestore.deleteDoc(modules.firestore.doc(database, "orders", id)); }
  catch (error) { renderApprovalQueueError(friendlyError(error)); }
};

async function initializeFirebase() {
  if (!ENABLE_FIREBASE) {
    firebaseConfigured = false;
    window.asokaFirebaseConfigured = false;
    window.asokaLocalDemoMode = true;
    setupRoute();
    window.render?.();
    return;
  }

  const { firebaseConfig } = await import("./firebase-config.js");
  const ready = ["apiKey", "authDomain", "projectId", "appId"].every((key) => firebaseConfig[key] && !firebaseConfig[key].startsWith("YOUR_"));
  if (!ready) {
    clearSession();
    window.render?.();
    setupRoute();
    return;
  }
  try {
    const [appSdk, authSdk, firestoreSdk] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`),
    ]);
    modules = { auth: authSdk, firestore: firestoreSdk };
    const firebaseApp = appSdk.initializeApp(firebaseConfig);
    auth = authSdk.getAuth(firebaseApp);
    database = firestoreSdk.getFirestore(firebaseApp);
    firebaseConfigured = true;
    window.asokaFirebaseConfigured = true;
    authSdk.onAuthStateChanged(auth, async (user) => {
      if (!user) {
        clearSession();
        if (route() === "/pre-order" || route() === "/admin/dashboard") window.render?.();
        return;
      }
      if (currentProfile?.uid === user.uid) return;
      if (user.emailVerified) {
        try { await completeLogin(user); } catch (error) { setMessage(friendlyError(error), true); }
      }
    });
    setupRoute();
    window.render?.();
  } catch (error) {
    console.error("Firebase initialization failed", error);
    window.asokaFirebaseConfigured = false;
    setupRoute();
    window.render?.();
    setMessage("Firebase could not start. Check the web config and authorized domain settings.", true);
  }
}

const appRoot = document.querySelector("#app");
let routeSyncQueued = false;
new MutationObserver(() => {
  if (routeSyncQueued) return;
  routeSyncQueued = true;
  requestAnimationFrame(() => {
    routeSyncQueued = false;
    setupRoute();
  });
}).observe(appRoot, { childList: true, subtree: true });

window.addEventListener("hashchange", setupRoute);
initializeFirebase();