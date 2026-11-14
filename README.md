# 💸 SplitBill

A simple bill-splitting app for friends, like Splitwise. Add friends, add expenses, and SplitBill works out who owes whom and the fewest payments needed to settle up.

Built as a beginner-friendly project for an **Entri Coding Tamil** tutorial. It shows how to build an app with AI (Claude Code + ChatGPT) **and** why you still need coding skills to check, fix, test and deploy what the AI writes.

🔗 **Live demo:** [your-vercel-link.vercel.app](https://your-vercel-link.vercel.app)

---

## ✨ Features

- **Add friends:** at least 2 are needed to start; duplicate names are blocked
- **Add expenses** with a description, amount in rupees and who paid
  - **Equal split:** pick who shares the expense; leftover paise are handled exactly
  - **Custom split:** type each person's share; it must add up exactly to the total
- **Expense list** with delete
- **Balances:** green if someone is owed money, red if they owe, grey if settled up
- **Settle up:** suggests a short list of payments (for example, "Priya pays Arun ₹183.33") with a **Settle** button to record each one
- **Saves automatically** in the browser (localStorage), so data survives a refresh
- **Reset all data** button (with a confirm)
- **Mobile-first design:** one column on phones, two columns on wider screens

---

## 🛠️ Tech stack

| Tool | Used for |
|---|---|
| [React](https://react.dev) (JavaScript) | The user interface |
| [Vite](https://vite.dev) | Dev server and production build |
| [Vitest](https://vitest.dev) | Unit tests for the money logic |
| localStorage | Saving data in the browser |
| [Vercel](https://vercel.com) | Hosting the live site |

No backend and no database: everything runs in the browser.

---

## 💰 How the money works

### 1. All money is stored as whole paise, never decimals

₹100 is stored as `10000`. Decimals (floats) cause rounding errors with money:

```
₹100 ÷ 3 = 33.33  →  33.33 × 3 = 99.99  ❌ (1 paisa disappeared!)
```

SplitBill converts rupees to paise as soon as you type them (`toPaise`) and only converts back to rupees for display (`formatRupees`).

### 2. Equal split: `splitEqual(totalPaise, memberIds)`

Uses integer division, then gives each leftover paisa to the first people in the list:

```
splitEqual(10000, ["naren", "arun", "priya"])
→ { naren: 3334, arun: 3333, priya: 3333 }   // adds up to exactly 10000 ✅
```

### 3. Balances: `computeNet(expenses, settlements)`

- The payer gets **+** the full amount
- Each person in the split gets **−** their share
- A settlement moves money from the payer to the receiver

Positive = should receive money, negative = should pay. All balances always add up to zero.

### 4. Settle up: `simplifyDebts(net)`

A greedy method: match the biggest debtor with the biggest creditor, pay the smaller of the two amounts, and repeat until everyone is at zero. This gives a short list of payments (usually the fewest, though not guaranteed).

All four functions live in [`src/utils/split.js`](src/utils/split.js).

---

## 🚀 Getting started

**You need:** [Node.js](https://nodejs.org) (version 18 or newer) and [Git](https://git-scm.com).

```bash
# 1. Clone the project
git clone https://github.com/YOUR-USERNAME/splitbill.git

# 2. Go into the folder
cd splitbill

# 3. Install the libraries
npm install

# 4. Start the app
npm run dev
```

Open the link it prints (usually http://localhost:5173).

---

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server with live reload |
| `npm test` | Runs all the Vitest tests once |
| `npm run lint` | Checks the code for common mistakes |
| `npm run build` | Creates the production build in `dist/` |
| `npm run preview` | Serves the production build locally |

---

## 📁 Folder structure

```
splitbill/
├── src/
│   ├── components/       # One component per section of the page
│   │   ├── Friends.jsx       # 1. Add Friends
│   │   ├── ExpenseForm.jsx   # 2. Add Expense
│   │   ├── ExpenseList.jsx   # 3. Expense List
│   │   ├── Balances.jsx      # 4. Balances
│   │   └── SettleUp.jsx      # 5. Settle Up
│   ├── utils/
│   │   ├── split.js          # Money logic (paise, splitting, balances, settle up)
│   │   ├── split.test.js     # Vitest tests for the money logic
│   │   └── storage.js        # Load/save helpers for localStorage
│   ├── App.jsx           # Holds all the data and connects the components
│   ├── App.css           # Styles (mobile-first)
│   └── main.jsx          # Entry point: mounts <App /> on the page
├── public/               # Static files (icons)
├── index.html            # The single HTML page React renders into
├── CLAUDE.md             # Project rules for Claude Code
├── design.md             # UI design: palette, font and layout
├── package.json          # Project info, scripts and dependencies
└── vite.config.js        # Vite settings
```

---

## 🧪 Testing

```bash
npm test
```

The tests cover:

- `splitEqual`: uneven splits (₹100 ÷ 3), even splits, one member, and errors for an empty list, non-whole paise and duplicate members
- `computeNet`: balances from expenses and settlements
- `simplifyDebts`: the full scenario below, plus already-settled balances

### Test scenario

Friends (in this order): **Naren, Arun, Priya**

| Expense | Amount | Paid by | Split |
|---|---|---|---|
| Coffee | ₹100 | Naren | Equal |
| Dinner | ₹450 | Arun | Equal |

**Expected balances:** Naren owes ₹83.34 · Arun is owed ₹266.67 · Priya owes ₹183.33

**Expected settle up:**
1. Priya pays Arun ₹183.33
2. Naren pays Arun ₹83.34

After both settlements, everyone is at ₹0.

---

## 🌐 Deployment

Deployed on **Vercel**:

1. Push the project to GitHub
2. On [vercel.com](https://vercel.com), click **Add New → Project** and import the repo
3. Vercel detects **Vite** automatically, so click **Deploy**

Every `git push` to `main` redeploys the site automatically.

---

## ⚠️ Limitations

- **Data lives only in your browser.** Open the app on another phone or browser and it's empty. Clearing browser data deletes everything.
- **No accounts or sharing.** Friends can't see the same group from their own phones.
- **Friends can't be removed** once added (use **Reset all data** to start over).

Real apps like Splitwise solve these with a **backend and a database**. That's coming in **Part 2** (MERN: Express + MongoDB).

---

## 🎓 Learn to build apps like this

This project was built for **Entri Coding Tamil**. AI can write code, but you need coding skills to check it, fix it, test it and deploy it.

Want to learn full stack development in Tamil? Check out Entri's **Full Stack MERN** course.

---

Made with ☕ and code by **Naren**, Entri Coding Tamil