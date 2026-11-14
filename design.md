# **SplitBill – Mobile-First UI Design**

**Product concept:** SplitBill is a simple, friendly expense-sharing web app designed for Indian college students and groups of friends.

**Design direction:** Clean, minimal, approachable and mobile-first. Think of a combination of Splitwise's expense-management simplicity and a modern student-friendly interface.

The main objective is to let users:

1. Add friends to a group.
2. Record shared expenses.
3. See who paid and who participated.
4. Understand who owes whom and settle balances easily.

## **1. Colour palette**

Use a soft purple as the primary brand colour, with green and red to communicate financial status.

## **SplitBill colour system**

**Primary**

Buttons, highlights, active navigation

**#6C63FF**

**Background**

Main application background

**#F7F8FC**

**Card**

Expense cards and sections

**#FFFFFF**

**Primary text**

Headings and important information

**#202438**

**Secondary text**

Descriptions and supporting text

**#7B8194**

**Owed – Green**

Money you should receive

**#16A36A**

**Owes – Red**

Money you need to pay

**#E05252**

**Design recommendation:** Use green and red only for financial status. Avoid using them for ordinary buttons or decorative elements. This makes balances immediately understandable.

## **2. Google Font**

# **Inter**

Google Font · Sans-serif · Recommended

# Split bills, not friendships!

The quick brown fox jumps over the lazy dog.

0123456789 · ₹1,250.00

Weights: 400, 500, 600, 700

[Get Inter from Google Fonts](https://fonts.google.com/specimen/Inter?utm_source=chatgpt.com)

Why Inter?

- Excellent readability on mobile screens.
- Clean appearance for numbers and financial information.
- Suitable for both headings and body content.
- Consistent across desktop and mobile.

## **3. Single-page layout – Four sections**

The app should have a single-page dashboard with four main sections, arranged vertically on mobile and in a more spacious dashboard layout on desktop.

### **Overall mobile layout**

# **SplitBill**

Friends make memories, not debts.

**YOUR GROUP**

**College Trip – Goa**

**N**

**A**

**R**

**S**

4 friends

You are owed

# **₹850**

You owe

# **₹350**

**1. Add Friends**

Friend's name

**+ Add**

Naren · Arun · Rahul · Sanjay

**2. Add Expense**

Expense description

Dinner at restaurant

Amount

## **₹1,200**

Paid by: Naren

Split equally

**+ Save Expense**

**3. Expense List**

**Dinner**

Naren paid · Today

### **₹1,200**

**Cab Ride**

Arun paid · Yesterday

### **₹600**

**Movie Tickets**

Rahul paid · Yesterday

### **₹800**

**4. Balances**

**Arun owes you ₹300**

For shared dinner expenses

**Settle Up**

**You owe Rahul ₹350**

For movie and travel expenses

**Mark as Settled**

Illustrative mobile dashboard preview

### **Section 1 – Add Friends**

**Purpose:** Allow users to create a group of friends.

Elements:

- Friend name input.
- Optional mobile number.
- Add Friend button.
- List of added friends with avatar initials.
- Remove friend option.

UX recommendation: Keep this section simple. Don't require registration or mobile verification just to add a friend.

### **Section 2 – Add Expense**

**Purpose:** Record a shared expense.

Fields:

- Expense description – e.g. Dinner, Cab, Movie.
- Total amount – ₹.
- Paid by – dropdown of friends.
- Split between – selectable friends.
- Split type – Equal split initially.

Example: Four friends share a ₹1,200 dinner bill.

Each person pays ₹300.

The app should automatically calculate individual shares.

### **Section 3 – Expense List**

**Purpose:** Show all group expenses in chronological order.

Each expense card should display:

- Expense title.
- Total amount.
- Who paid.
- Date.
- Number of participants.

Add an optional filter for All Expenses, Paid by Me and Paid by Friends.

### **Section 4 – Balances with Settle Up**

**Purpose:** Make it immediately clear who owes money and who should receive money.

Two categories:

- **You are owed:** Green. Money others should pay you.
- **You owe:** Red. Money you should pay others.

Each balance row should contain:

- Friend's name.
- Amount.
- Settle Up button.
- Settlement status.

Important: Clicking Settle Up should ask for confirmation and then update the balance. For a beginner MVP, this can simply record that the payment happened outside the app; it should not imply that the app processed a real payment.

## **4. Developer-ready CSS**

The following CSS uses:

- CSS custom properties (`:root`) for easy theme management.
- Flexbox and CSS Grid for layouts.
- Mobile-first responsive breakpoints.
- Reusable card, button, input and balance styles.
- No Tailwind, Bootstrap or external CSS libraries.

### **Suggested HTML structure**

Use these class names in the HTML so the CSS can be applied directly:

```
<div class="app-container">

  <header class="app-header">
    <!-- Logo and group information -->
  </header>

  <main class="dashboard">

    <section class="card friends-section">
      <!-- Add Friends -->
    </section>

    <section class="card expense-form-section">
      <!-- Add Expense -->
    </section>

    <section class="card expense-list-section">
      <!-- Expense List -->
    </section>

    <section class="card balances-section">
      <!-- Balances and Settle Up -->
    </section>

  </main>

</div>
```

### **Complete CSS stylesheet**

```

/* =================================
   1. SPLITBILL DESIGN SYSTEM
================================= */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* Brand colors */
  --primary: #6C63FF;
  --primary-hover: #574FE8;

  /* Background colors */
  --background: #F7F8FC;
  --card: #FFFFFF;

  /* Text colors */
  --text-primary: #202438;
  --text-secondary: #7B8194;

  /* Financial status */
  --owed: #16A36A;
  --owed-bg: #E5F6ED;

  --owes: #E05252;
  --owes-bg: #FCE9E9;

  /* Borders and shadows */
  --border: #E9EAF0;
  --shadow: 0 4px 16px rgba(32, 36, 56, 0.05);

  /* Layout */
  --radius: 14px;
  --spacing: 16px;
}


/* =================================
   2. GLOBAL STYLES
================================= */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--background);
  color: var(--text-primary);
  line-height: 1.6;
}

button,
input,
select {
  font-family: inherit;
  font-size: inherit;
}

button {
  cursor: pointer;
  border: none;
}

.app-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}


/* =================================
   3. HEADER
================================= */

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.logo {
  font-size: 26px;
  font-weight: 700;
  color: var(--primary);
}

.group-info {
  color: var(--text-secondary);
  font-size: 14px;
}


/* =================================
   4. DASHBOARD LAYOUT
================================= */

.dashboard {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}


/* =================================
   5. REUSABLE CARDS
================================= */

.card {
  background: var(--card);
  padding: 20px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}


/* =================================
   6. INPUT FIELDS
================================= */

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--background);
  color: var(--text-primary);
  outline: none;
}

input:focus,
select:focus {
  border-color: var(--primary);
}


/* =================================
   7. BUTTONS
================================= */

.btn {
  padding: 11px 16px;
  border-radius: 9px;
  font-weight: 600;
  transition: 0.2s ease;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-settle {
  background: var(--owed);
  color: white;
}

.btn-settle:hover {
  opacity: 0.9;
}


/* =================================
   8. FRIENDS LIST
================================= */

.friends-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--background);
  border-radius: 30px;
  font-size: 13px;
}

.friend-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #EAE8FF;
  color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
}


/* =================================
   9. EXPENSE LIST
================================= */

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}

.expense-item:last-child {
  border-bottom: none;
}

.expense-details h4 {
  font-size: 14px;
  font-weight: 600;
}

.expense-details p {
  font-size: 12px;
  color: var(--text-secondary);
}

.expense-amount {
  font-weight: 600;
  font-size: 15px;
}


/* =================================
   10. BALANCE CARDS
================================= */

.balance-item {
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.balance-owed {
  background: var(--owed-bg);
  color: var(--owed);
}

.balance-owes {
  background: var(--owes-bg);
  color: var(--owes);
}

.balance-item h4 {
  font-size: 14px;
  margin-bottom: 4px;
}

.balance-item p {
  font-size: 13px;
}

.balance-item .btn {
  margin-top: 10px;
}


/* =================================
   11. BOTTOM NAVIGATION
================================= */

.bottom-nav {
  display: none;
}


/* =================================
   12. TABLET AND DESKTOP
================================= */

@media (min-width: 768px) {

  .dashboard {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .card {
    padding: 24px;
  }

  .app-container {
    padding: 32px;
  }

}


/* =================================
   13. MOBILE RESPONSIVENESS
================================= */

@media (max-width: 480px) {

  .app-container {
    padding: 14px;
    padding-bottom: 85px;
  }

  .app-header {
    margin-bottom: 18px;
  }

  .logo {
    font-size: 23px;
  }

  .card {
    padding: 16px;
  }

  .section-title {
    font-size: 16px;
  }

  .btn {
    width: 100%;
  }

  .expense-item {
    gap: 10px;
  }

  /* Fixed bottom navigation */

  .bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: var(--card);
    justify-content: space-around;
    padding: 14px 8px;
    border-top: 1px solid var(--border);
    z-index: 100;
  }

}

```

## **5. Recommended implementation order**

For a beginner-friendly MVP, I recommend developing SplitBill in these stages:

| Phase | Feature                              | Priority |
| ----- | ------------------------------------ | -------- |
| 1     | Add Friends                          | High     |
| 2     | Add Expense with equal split         | High     |
| 3     | Display Expense List                 | High     |
| 4     | Calculate individual balances        | High     |
| 5     | Settle Up functionality              | High     |
| 6     | Expense filters and history          | Medium   |
| 7     | Local storage / database persistence | Medium   |

**Important development logic:**

The balance calculation should be based on each person's actual contribution minus their expense share.

For example, if four friends share ₹1,200 and Naren pays the full amount:

- Naren's share: ₹300
- Arun owes Naren: ₹300
- Rahul owes Naren: ₹300
- Sanjay owes Naren: ₹300

The application should calculate these balances automatically rather than asking users to enter them manually.

## **6. My recommendation for the MVP**

Keep the first version deliberately simple:

- No login or authentication.
- One group initially.
- Equal expense splitting.
- Add/remove friends.
- Automatic balance calculation.
- Mark expenses as settled.
- Save data using browser LocalStorage.

You can introduce Firebase or Supabase later when you need multiple users and shared groups.

**Next development step:** I can turn this design into a complete working SplitBill application using HTML, CSS and vanilla JavaScript, including automatic expense splitting and balance calculations.