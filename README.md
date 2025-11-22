# 🗳️ QuickVote

**Instant, Real-Time, Anonymous Polling Application.**

![QuickVote Banner](screenshots/dashboard.png)


## 📖 Project Overview

QuickVote is a full-stack web application designed to remove the friction from decision-making. Unlike traditional polling apps that require accounts or page refreshes, QuickVote allows users to create polls instantly and see results update live across all devices using WebSockets.

It features a modern **"Aurora Glassmorphism"** UI, built with Tailwind CSS, ensuring the app feels as good as it performs.

### 🚀 Live Demo
  coming soon

---

## ✨ Key Features

* **⚡ Real-Time Sync:** Vote counts update instantly on all connected clients via **Pusher (WebSockets)**. No "pull-to-refresh" needed.
* **🎨 Glassmorphism UI:** A custom-designed interface featuring translucent cards, dynamic gradients, and "ghost" inputs.
* **🔐 Secure Authentication:** Passwordless sign-in using **NextAuth.js (Magic Links)**.
* **🚫 Smart Restrictions:** Prevents double-voting using `localStorage` checks (optimized for UX over strict security).
* **📱 Responsive:** Fully optimized for mobile and desktop with a responsive grid layout.
* **⚙️ Admin Dashboard:** Manage, view, delete, and copy links for all your active polls.
* **⏳ Poll Expiry:** Polls automatically close and disable voting after a set date/time.

---

## 🛠️ Tech Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14 (App Router)** | Server Components for data fetching, Client Components for interactivity. |
| **Language** | **TypeScript** | End-to-end type safety. |
| **Styling** | **Tailwind CSS** | Custom theme and complex animations. |
| **Database** | **PostgreSQL** | Relational data model (Users, Polls, Options, Votes). |
| **ORM** | **Prisma** | Schema management and type-safe database queries. |
| **Real-Time** | **Pusher** | Pub/Sub messaging for live vote updates. |
| **Auth** | **NextAuth.js** | Secure email magic link authentication. |

---

## 🏗️ Architecture & Design Decisions

### Real-Time Data Flow
To achieve the "instant" feel, the app uses a Pub/Sub model:
1.  **Action:** User clicks an option.
2.  **API:** `POST /api/vote` saves the vote to PostgreSQL via Prisma.
3.  **Event:** The API triggers a `new-vote` event on the specific Poll Channel via Pusher.
4.  **Update:** All subscribed clients receive the payload and update their React state immediately.

### UX Trade-offs (Anonymous Voting)
* **Decision:** I chose to use `localStorage` to track voting status instead of forcing users to create accounts.
* **Why:** This reduces friction. A user can share a link, and their friends can vote in <2 seconds.
* **Trade-off:** While tech-savvy users can bypass this via Incognito mode, it provides the best balance of security vs. usability for casual polling.

---

## 🚀 Getting Started (Local)

Follow these steps to run QuickVote on your machine.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/quick-vote.git](https://github.com/your-username/quick-vote.git)
cd quick-vote
```

### 2. Install Dependencies
```bash

npm install
```

### 3. Configure Environment
Create a .env file in the root directory:

```

# Database (Docker or Neon)
DATABASE_URL="postgresql://postgres:password@localhost:5432/quickvote?schema=public"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"

# Email (Gmail App Password)
EMAIL_SERVER_USER="your@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your@gmail.com"

# Pusher (Real-time)
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="ap2"
```
Create a .env.local file for public keys:

```
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="ap2"
```
### 4. Set up Database
If you have Docker installed, you can spin up a Postgres container:

```
docker run -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```
Then push the schema:

```
npx prisma db push
```

### 5. Run the App
```
npm run dev
```
Open http://localhost:3000 to view it in the browser.

## 📸 Screen Previews
### Voting Interface
![Voting Interface](screenshots/voting_interface.png)

### Create a Poll
![Create Poll](screenshots/create_poll.png)

## 🔮 Future Improvements

- Social Sharing: Auto-generate graph images for Twitter/LinkedIn sharing.

- IP Fingerprinting: Improving vote security without requiring login.

- Data Visualization: Adding pie charts and historical trend lines.

### Built with ❤️ by Om Shimpi