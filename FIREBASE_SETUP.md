# Firebase and email setup

The site is a static, hash-routed frontend using Firebase Authentication,
Cloud Firestore, and Cloud Storage directly from the browser. The public event
registration form does not require an account. T-shirt orders continue to
require an approved student account and a private payment-slip upload.

## Firebase

1. Enable **Authentication → Sign-in method → Email/Password** and create a
   Firestore database.
2. Set the Firebase web app values in `firebase-config.js`. These web
   configuration values are public; Firestore and Storage rules enforce
   access.
3. Add both `ashen-perera.github.io` and
   `asokavidyalayascienceassociation.work.gd` to Firebase Authentication's
   **Authorized domains**.
4. In Storage, create the default bucket. Cloud Storage may require the Blaze
   plan; check Firebase's current billing and storage pricing first.
5. Publish `firestore.rules` in **Firestore Database → Rules** and
   `storage.rules` in **Storage → Rules**.
6. Register and verify `ashenperera993@gmail.com`. Its verified account is the
   only account allowed to approve users.

## Event registrations and T-shirt orders

- Guest event forms write validated records to `event_registrations`, including
  a Firestore-generated reference code and server timestamp. The public can
  create registrations; only approved admins can read, update, or delete them.
- T-shirt pre-orders write to `tshirt_orders` and retain the approved-student
  sign-in requirement. Payment slips are limited to JPG, PNG, WEBP, or PDF
  files up to 5 MB at `payment-slips/{studentUid}/{orderId}`. Only approved
  admins can download them. Existing records in the previous `orders`
  collection remain available in Admin; new submissions use `tshirt_orders`.
- Admin users can filter both collections and export the selected records to
  `.xlsx`. SheetJS is loaded from its CDN in `index.html`.
- Event listings, committee profiles, and editable website content remain in
  browser local storage; they are not synchronized between visitors.

## EmailJS confirmations

The browser sends confirmation emails after an event registration or a T-shirt
order is saved. In EmailJS, create one service and two templates. Add the
website domains to the EmailJS **Allowed origins** list:
`ashen-perera.github.io` and `asokavidyalayascienceassociation.work.gd`.

Fill in the public EmailJS values in `emailjsConfig` in `firebase-config.js`:
`publicKey`, `serviceId`, `registrationTemplateId`, and `orderTemplateId`.
These are browser-side public identifiers; never put a private email or SMTP
credential in this file. Configure the registration template with
`to_email`, `to_name`, `event_name`, `school`, `grade`, `phone`,
`team_members`, and `reference`. Configure the order template with
`to_email`, `to_name`, `admission`, `grade`, `phone`, `size`, `quantity`, and
`reference`.

If EmailJS is not configured or a send fails, the Firestore submission remains
saved and the page reports that the confirmation email was not sent. The
confirmation reference remains available on screen.
