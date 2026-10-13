# Site and pre-order setup

The site uses Firebase Authentication and Cloud Firestore. Pre-orders require the
student to be signed in with an approved student account. The Node.js server
validates that account, stores uploaded payment slips outside the public site
directory, writes the order to Firestore, and can send a confirmation email.

## Run locally

1. Install Node.js 22 or newer.
2. Run `npm install` in the project directory.
3. Copy `.env.example` to `.env` and configure the Firebase Admin service account
   and email settings below.
4. Run `npm start` and open `http://localhost:3000`. Do not open `index.html`
   directly as a `file://` URL.

## Firebase configuration

1. Enable **Authentication → Sign-in method → Email/Password** and create a
   Firestore database.
2. Set up the Firebase Web app values in `firebase-config.js`. These web
   configuration values are public; Firestore rules and Authentication enforce
   access.
3. Create a Firebase service account in **Project settings → Service accounts**.
   Put its JSON contents in the `FIREBASE_SERVICE_ACCOUNT_JSON` environment
   variable on the Node host. Keep the private key secret; never commit it or
   place it in browser code.
4. Publish `firestore.rules` in **Firestore Database → Rules**.
5. Add `localhost` and the production website host to Firebase Authentication's
   authorized domains.
6. Register and verify `ashenperera993@gmail.com`; that verified account is the
   only account allowed to approve registrations.

## Email and uploads

- Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and the verified
  sender address `EMAIL_FROM`. Without valid email settings, orders are still
  saved and the confirmation message explains that email is unavailable.
- Payment slips must be JPG, PNG, WEBP, or PDF files no larger than 5 MB. The
  server checks file signatures and keeps them outside the publicly served
  website directory.
- Set `PRIVATE_UPLOAD_DIR` to persistent private storage on the Node host.
  Uploaded payment slips are not included in Firestore backups.
- If the production host sits behind a trusted reverse proxy, set `TRUST_PROXY=1`
  so order rate limits use the visitor IP. Leave it off otherwise.
- The order dashboard shows the saved order and lets an approved admin download
  its payment slip. Older orders without a slip continue to display normally.

## Hosting

The pre-order API and private upload handling require a Node.js host with
persistent private storage; GitHub Pages alone cannot run them. Deploy this
project as a Node.js service, set the environment variables in the host's
private configuration, and use that same host for the website and `/api`
requests. Do not expose `.env`, Firebase service-account credentials, or the
private upload directory.

Website content, events, committee profiles, and uploaded event images continue
to use browser local storage and are not synchronized between visitors.
