// All money in SplitBill is stored as whole paise (₹1 = 100 paise), never as decimals

// Turn a rupee string like "183.33" into whole paise (18333) without using floats
export function toPaise(rupeesString) {
  // Make it a string, then remove spaces and commas (" 1,200 " becomes "1200")
  const cleaned = String(rupeesString).trim().replaceAll(',', '')
  // Allow only digits, optionally followed by a dot and at most 2 more digits
  const isValid = /^\d+(\.\d{0,2})?$/.test(cleaned)
  // If the text is not a valid amount, return NaN so the caller can show an error
  if (!isValid) return NaN
  // Split into rupees and paise parts ("183.3" becomes ["183", "3"])
  const [rupeePart, paisePart = ''] = cleaned.split('.')
  // Make the paise part exactly 2 digits ("3" becomes "30", "" becomes "00")
  const paiseDigits = paisePart.padEnd(2, '0')
  // rupees × 100 + paise, using whole numbers only
  return Number(rupeePart) * 100 + Number(paiseDigits)
} // End of toPaise

// Turn paise into a display string like "₹183.33" (only used for showing money)
export function formatRupees(paise) {
  // Remember the minus sign if the amount is negative
  const sign = paise < 0 ? '-' : ''
  // Work with the positive number from here on
  const absPaise = Math.abs(paise)
  // Whole rupees (18333 paise gives 183)
  const rupees = Math.floor(absPaise / 100)
  // Leftover paise (18333 paise gives 33)
  const leftover = absPaise % 100
  // Add Indian-style commas to the rupees (120000 becomes "1,20,000")
  const rupeeText = rupees.toLocaleString('en-IN')
  // Always show 2 paise digits (5 becomes "05")
  const paiseText = String(leftover).padStart(2, '0')
  // Join everything together, for example "₹183.33"
  return `${sign}₹${rupeeText}.${paiseText}`
} // End of formatRupees

// Split totalPaise equally between memberIds
// Example: splitEqual(10000, ["a", "b", "c"]) should give { a: 3334, b: 3333, c: 3333 }
// The shares must add up EXACTLY to totalPaise
// eslint-disable-next-line no-unused-vars
export function splitEqual(totalPaise, memberIds) {
  // Count how many people share this expense
  const count = memberIds.length
  // Everyone's base share, rounded down so there are no decimals (10000 / 3 = 3333)
  const base = Math.floor(totalPaise / count)
  // Paise left over after giving everyone the base share (10000 - 9999 = 1)
  let leftover = totalPaise - base * count
  // Empty object to store each person's share, like { naren: 3334 }
  const shares = {}
  // Go through each member in the order they were added
  for (const id of memberIds) {
    // Give the base share, plus 1 extra paise if any leftover remains
    shares[id] = base + (leftover > 0 ? 1 : 0)
    // We just gave away 1 leftover paise, so reduce the count
    if (leftover > 0) leftover--
  } // End of members loop
  // Return the shares; they always add up exactly to totalPaise
  return shares
} // End of splitEqual
// Work out each friend's net balance from all expenses and settlements
// Positive = this friend should receive money, negative = this friend should pay
export function computeNet(expenses, settlements) {
  // Start with an empty object: { friendId: netPaise }
  const net = {}
  // Go through every expense one by one
  for (const expense of expenses) {
    // The payer paid the whole bill, so they should get it back: +amountPaise
    net[expense.paidBy] = (net[expense.paidBy] || 0) + expense.amountPaise
    // Go through each person who shares this expense
    for (const friendId of Object.keys(expense.shares)) {
      // That person used their share, so they owe it: -share
      net[friendId] = (net[friendId] || 0) - expense.shares[friendId]
    } // End of shares loop
  } // End of expenses loop
  // Go through every settlement (a payment made outside the app)
  for (const settlement of settlements) {
    // The person who paid has cleared some of their debt: +amountPaise
    net[settlement.from] = (net[settlement.from] || 0) + settlement.amountPaise
    // The person who received the money is owed less now: -amountPaise
    net[settlement.to] = (net[settlement.to] || 0) - settlement.amountPaise
  } // End of settlements loop
  // Give back the finished balances
  return net
} // End of computeNet

// Turn net balances into a short list of payments that settles everyone
// Example: { a: 5000, b: -5000 } should give [{ from: "b", to: "a", amountPaise: 5000 }]
// eslint-disable-next-line no-unused-vars
// Turn net balances into the fewest simple payments (greedy method)
export function simplifyDebts(net) {
  // People who should RECEIVE money (positive balance)
  const creditors = [];
  // People who should PAY money (negative balance)
  const debtors = [];
  // Look at every friend's balance one by one
  for (const [id, amount] of Object.entries(net)) {
    // Positive balance means this person is owed money
    if (amount > 0) creditors.push({ id, amount });
    // Negative balance means this person owes; store it as a positive number
    else if (amount < 0) debtors.push({ id, amount: -amount });
  }
  // List of payments we will suggest
  const payments = [];
  // Keep going while someone still owes and someone is still owed
  while (creditors.length > 0 && debtors.length > 0) {
    // Put the biggest creditor first
    creditors.sort((a, b) => b.amount - a.amount);
    // Put the biggest debtor first
    debtors.sort((a, b) => b.amount - a.amount);
    // Take the person owed the most
    const creditor = creditors[0];
    // Take the person who owes the most
    const debtor = debtors[0];
    // Pay the smaller of the two amounts so nobody overpays
    const pay = Math.min(creditor.amount, debtor.amount);
    // Record the payment: debtor pays creditor
    payments.push({ from: debtor.id, to: creditor.id, amountPaise: pay });
    // The creditor is now owed less
    creditor.amount -= pay;
    // The debtor now owes less
    debtor.amount -= pay;
    // If the creditor is fully paid, remove them from the list
    if (creditor.amount === 0) creditors.shift();
    // If the debtor has fully paid, remove them from the list
    if (debtor.amount === 0) debtors.shift();
  }
  // Return all suggested payments
  return payments;
}