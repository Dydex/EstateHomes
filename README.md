# EstateHomes

EstateHomes is a property management app for landlords and property managers. It tracks properties, units, tenants, leases and rent payments. It has two parts:

| Folder | What it is | Stack |
| --- | --- | --- |
| [`estate-homes/`](estate-homes/) | Mobile app (iOS, Android, web) | Expo SDK 57, React Native 0.86, Expo Router, TypeScript |
| [`backend/`](backend/) | REST API | Node.js, Express 5, PostgreSQL (`pg`), JWT auth, TypeScript |

## Demo

Try EstateHomes in your browser, with nothing to install: **[Live demo](https://appetize.io/app/b_gltipn2425evdbjdvxle5rqfpi)**

The demo runs the iOS app in a simulator through Appetize.io.

## Features

**Mobile app**
- Onboarding and welcome screens
- Sign-up flow: phone/email, one-time code, password setup and goals
- Sign-in screen
- Add-property form with photo upload UI
- A 5-step add-tenant wizard: personal details, stay details, contact and emergency info, and family details
- Tabs: **Home**, **Properties** and **Tenants**

**Backend API**
- Register and log in with bcrypt-hashed passwords and JWTs that expire after 1 day
- Password reset with emailed 6-digit codes
- Role-based access (`owner`, `manager`, `tenant`)
- Create, read, update and delete properties, units and tenants
- Leases with rent paid in 1–3 installments; creating a lease generates the payment schedule
- Recording payments and listing overdue payments

## Getting started

### Prerequisites
- Node.js 20+ (developed on Node 24)
- PostgreSQL
- On your phone: [Expo Go](https://expo.dev/go) from the App Store or Play Store

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=estate_db
DB_USER=estate_user
DB_PASSWORD=your_password
JWT_SECRET=a_long_random_string

# Optional: email for password reset codes.
# Without these, the code is printed in the server terminal instead.
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
MAIL_FROM="EstateHomes <no-reply@example.com>"
```

Set up the database. The migrations in [`backend/src/migrations/`](backend/src/migrations/) run on top of the `users` and `properties` tables:

```bash
psql -h localhost -U estate_user -d estate_db -f src/migrations/001_units_leases_payments.sql
psql -h localhost -U estate_user -d estate_db -f src/migrations/002_password_resets.sql
```

Run the API:

```bash
npm run dev      # watch mode with tsx
npm run build    # compile to dist/
npm start        # run the compiled build
```

### 2. Mobile app

```bash
cd estate-homes
npm install
npx expo start
```

**On an iPhone or Android phone:**
1. Connect the phone and your computer to the same Wi-Fi.
2. Scan the QR code: on iOS, use the Camera app; on Android, use Expo Go.
3. If the phone can't connect, run `npx expo start --tunnel`.

> To reach the API from a phone, use your computer's LAN IP (for example `http://192.168.x.x:5000/api`). `localhost` on the phone refers to the phone itself.

## API reference

All routes start with `/api`. Protected routes need an `Authorization: Bearer <token>` header.

| Method | Route | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create an account (`name`, `email`, `password`) |
| POST | `/auth/login` | Returns a JWT and the user |
| POST | `/auth/logout` | Log out |
| POST | `/auth/forgot-password` | Email a 6-digit reset code (`email`); the code expires after 15 minutes |
| POST | `/auth/reset-password` | Set a new password (`email`, `code`, `password`); a code is locked after 5 wrong tries |
| GET | `/properties`, `/properties/:id` | List or get properties *(auth)* |
| POST | `/properties` | Create a property *(owner, manager)* |
| PATCH | `/properties/:id` | Update a property *(owner, manager)* |
| DELETE | `/properties/:id` | Delete a property *(owner)* |
| POST | `/units/:propertyId` | Add a unit to a property |
| GET | `/units/:propertyId`, `/units/:propertyId/:unitId` | List or get units |
| PUT / DELETE | `/units/:propertyId/:unitId` | Update or delete a unit |
| POST | `/tenants/invite` | Create a tenant account |
| GET | `/tenants`, `/tenants/:id` | List or get tenants |
| PUT / DELETE | `/tenants/:id` | Update or delete a tenant |
| POST | `/leases` | Create a lease and its payment schedule |
| GET | `/leases`, `/leases/:id` | List leases (filter with `?tenant_id=` or `?unit_id=`) or get one lease |
| PATCH | `/leases/:id/terminate` | End a lease and mark its unit vacant |
| GET | `/payments/lease/:leaseId` | Payments for a lease |
| PATCH | `/payments/:id/pay` | Mark a payment as paid |
| GET | `/payments/overdue` | All overdue payments |

## Project structure

```
EstateHomes/
├── backend/
│   └── src/
│       ├── app.ts            # Express entry point and route mounting
│       ├── config/db.ts      # PostgreSQL connection pool
│       ├── controllers/      # Route handlers
│       ├── routes/           # Express routers
│       ├── middleware/       # authenticate (JWT) and authorize (roles)
│       ├── migrations/       # SQL migrations
│       ├── utils/mailer.ts   # Email sending (nodemailer)
│       └── types/            # Express and JWT types
└── estate-homes/
    ├── app/                  # Expo Router screens
    │   ├── onboarding/
    │   ├── (auth)/           # Sign-up, sign-in and add-property/tenant flows
    │   └── (tabs)/           # Home, Properties, Tenants
    ├── components/
    ├── context/auth.tsx      # Auth and onboarding state (AsyncStorage)
    ├── constants/
    └── hooks/
```
