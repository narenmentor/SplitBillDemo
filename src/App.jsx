// useState stores data; useEffect runs code after data changes
import { useState, useEffect } from 'react'
// The styles for the whole app
import './App.css'
// Helpers to save and load lists in localStorage
import { loadList, saveList, removeList } from './utils/storage.js'
// Works out each friend's net balance
import { computeNet } from './utils/split.js'
// Section 1: add friends
import Friends from './components/Friends.jsx'
// Section 2: add an expense
import ExpenseForm from './components/ExpenseForm.jsx'
// Section 3: list of expenses
import ExpenseList from './components/ExpenseList.jsx'
// Section 4: balances
import Balances from './components/Balances.jsx'
// Section 5: settle up
import SettleUp from './components/SettleUp.jsx'

// The localStorage key names for our three lists
const FRIENDS_KEY = 'splitbill-friends'
// Key for the expenses list
const EXPENSES_KEY = 'splitbill-expenses'
// Key for the settlements list
const SETTLEMENTS_KEY = 'splitbill-settlements'

// App is the main component: it holds all the data
function App() {
  // Friends list, loaded from localStorage when the app starts
  const [friends, setFriends] = useState(() => loadList(FRIENDS_KEY))
  // Expenses list, loaded from localStorage when the app starts
  const [expenses, setExpenses] = useState(() => loadList(EXPENSES_KEY))
  // Settlements list, loaded from localStorage when the app starts
  const [settlements, setSettlements] = useState(() => loadList(SETTLEMENTS_KEY))

  // Save friends to localStorage whenever they change
  useEffect(() => saveList(FRIENDS_KEY, friends), [friends])
  // Save expenses to localStorage whenever they change
  useEffect(() => saveList(EXPENSES_KEY, expenses), [expenses])
  // Save settlements to localStorage whenever they change
  useEffect(() => saveList(SETTLEMENTS_KEY, settlements), [settlements])

  // Work out everyone's balance from the expenses and settlements
  const net = computeNet(expenses, settlements)

  // Add a new friend to the end of the list (keeps the order they were added)
  function addFriend(name) {
    // Copy the old list and add the new friend with a unique id
    setFriends([...friends, { id: crypto.randomUUID(), name: name }])
  } // End of addFriend

  // Add a new expense to the end of the list
  function addExpense(expense) {
    // Copy the old list and add the new expense with a unique id
    setExpenses([...expenses, { id: crypto.randomUUID(), ...expense }])
  } // End of addExpense

  // Remove an expense by its id
  function deleteExpense(expenseId) {
    // Keep every expense except the one with this id
    setExpenses(expenses.filter((expense) => expense.id !== expenseId))
  } // End of deleteExpense

  // Record a payment made outside the app
  function addSettlement(payment) {
    // Copy the old list and add the settlement with a unique id
    setSettlements([...settlements, { id: crypto.randomUUID(), from: payment.from, to: payment.to, amountPaise: payment.amountPaise }])
  } // End of addSettlement

  // Delete all data after the user confirms
  function resetAll() {
    // Ask first, because this cannot be undone
    const ok = window.confirm('Delete all friends, expenses and settlements? This cannot be undone.')
    // If they clicked Cancel, do nothing
    if (!ok) return
    // Remove the saved friends from localStorage
    removeList(FRIENDS_KEY)
    // Remove the saved expenses from localStorage
    removeList(EXPENSES_KEY)
    // Remove the saved settlements from localStorage
    removeList(SETTLEMENTS_KEY)
    // Empty the friends list on screen
    setFriends([])
    // Empty the expenses list on screen
    setExpenses([])
    // Empty the settlements list on screen
    setSettlements([])
  } // End of resetAll

  // The UI for the whole page
  return (
    // Outer box that centres the page
    <div className="app-container">
      {/* Top bar with the logo and Reset button */}
      <header className="app-header">
        {/* Logo and tagline */}
        <div>
          {/* App name */}
          <h1 className="logo">SplitBill</h1>
          {/* Tagline and number of friends */}
          <p className="group-info">Split bills, not friendships! · {friends.length} friends</p>
        </div>
        {/* Button to delete everything */}
        <button type="button" className="btn btn-ghost btn-small" onClick={resetAll}>
          Reset all data
        </button>
      </header>
      {/* The main area with all the sections */}
      <main className="dashboard">
        {/* Section 1: add friends */}
        <Friends friends={friends} onAddFriend={addFriend} />
        {/* Section 2: add an expense */}
        <ExpenseForm friends={friends} onAddExpense={addExpense} />
        {/* Section 3: list of expenses */}
        <ExpenseList expenses={expenses} friends={friends} onDeleteExpense={deleteExpense} />
        {/* Section 4: balances */}
        <Balances friends={friends} net={net} />
        {/* Section 5: settle up */}
        <SettleUp friends={friends} net={net} onSettle={addSettlement} />
      </main>
    </div>
  ) // End of the returned UI
} // End of the App component

// Export App so main.jsx can use it
export default App
