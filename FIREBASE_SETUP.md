# Site and pre-order setup

The GitHub Pages site uses Firebase Authentication, Cloud Firestore, and Cloud
Storage directly from the browser. Approved students submit order details to
Firestore and upload payment slips to a private Storage path. No Node.js
pre-order API or email service is used.

## Firebase configuration

1. Enable **Authentication → Sign-in method → Email/Password** and create a
   Firestore database.
2. Set up the Firebase Web app values in `firebase-config.js`. These web
   configuration values are public; Firestore and Storage rules enforce access.
3. Add `ashen-perera.github.io` to Firebase Authentication's authorized domains.
4. In **Storage**, create the default bucket. Firebase may require enabling the
   Blaze billing plan for Cloud Storage; review Firebase's current plan and
   storage pricing before enabling it.
5. Publish `firestore.rules` in **Firestore Database → Rules** and
   `storage.rules` in **Storage → Rules**.
6. Register and verify `ashenperera993@gmail.com`; that verified account is the
   only account allowed to approve registrations and view payment slips.

## Orders and payment slips

- Pre-orders require a signed-in, email-verified, approved student account.
- Order details are written to the `orders` Firestore collection. Payment slips
  must be JPG, PNG, WEBP, or PDF files no larger than 5 MB and are stored at
  `payment-slips/{studentUid}/{orderId}` in Cloud Storage.
- Storage rules allow only approved students to upload their own slips.
  Download access is limited to the main administrator and approved society
  admins.
- Confirmation emails are not sent by this direct Firebase integration. The
  website confirms submission on screen; the society committee can contact
  students using the saved account email.
- Website content, events, committee profiles, and uploaded event images
  continue to use browser local storage and are not synchronized between
  visitors.
