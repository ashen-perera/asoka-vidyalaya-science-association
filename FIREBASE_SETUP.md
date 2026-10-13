# Firebase setup

The app uses Firebase Authentication and Cloud Firestore. Its web configuration is in `firebase-config.js`; Firebase web config is public, so protect data with Authentication and Firestore rules rather than hiding the API key.

## Console setup

1. In Firebase Console, enable **Authentication → Sign-in method → Email/Password**.
2. Create a **Cloud Firestore** database.
3. Publish the rules from `firestore.rules` in **Firestore Database → Rules**.
4. Add `localhost` and the deployed GitHub Pages hostname under **Authentication → Settings → Authorized domains**.
5. Register and verify the main-admin email `ashenperera993@gmail.com`. That verified address is the only identity allowed to create the main-admin profile and approve other accounts.

The app uses Firebase SDK 13.0.0 directly from Google's CDN and loads Auth and Firestore modules. Analytics is not initialized because the site currently does not use it.

## Data boundaries

User profiles and T-shirt orders are stored in Firestore. Website content, events, committee profiles, and uploaded images are still stored in the current browser's local storage; they do not sync across visitors or devices. Photo uploads use browser storage and should not be treated as shared production media storage.# Firebase setup

The public site remains available without Firebase, but registration, approval, sign-in, and pre-orders require a Firebase project.

1. Create a Firebase project and register a Web app.
2. In **Authentication → Sign-in method**, enable **Email/Password**.
3. Create a Firestore database.
4. Copy the Web app's `apiKey`, `authDomain`, `projectId`, and `appId` into `firebase-config.js`, replacing the `YOUR_...` placeholder values. These are public Web app settings; never put a Firebase service-account key in the website.
5. Publish `firestore.rules` in **Firestore Database → Rules**.
6. Push the site files to a GitHub repository. In **Settings → Pages**, choose **Deploy from a branch**, select your publishing branch (usually `main`) and the repository root (`/`). GitHub Pages can serve the existing relative asset paths from a project subpath.
7. In Firebase **Authentication → Settings → Authorized domains**, add the Pages host, usually `<your-github-username>.github.io`. If you use a custom domain, add that hostname too. GitHub Pages serves over HTTPS.
8. Open `https://<your-github-username>.github.io/<repository-name>/` and use **Register**. Register `ashenperera993@gmail.com`, choose a password there, verify the email, then sign in once. The verified Firebase identity is bootstrapped as the main administrator; the password is not pre-created or displayed by this project.
9. The main administrator can approve or reject pending student and society-admin registrations in the dashboard. Approved students can then sign in and submit T-shirt orders.

Run the site from an HTTP origin, not by opening `index.html` as a `file://` URL. For local testing, add both `localhost` and `127.0.0.1` to Firebase's authorized domains, depending on which preview URL you use. If the main-admin address ever changes, update it in both `auth.js` and `firestore.rules` before deploying the rules again.

Firestore rules make the main-admin email the only account approver. Approved society admins can review orders, but cannot approve accounts. Students can create and read only their own orders. The Web app config is public client configuration; Firestore rules and Firebase Auth enforce access.