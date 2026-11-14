// useState lets this component remember what the user enters
import { useState } from 'react'
// Money helpers: rupees→paise, paise→display text, and the equal split
import { toPaise, formatRupees, splitEqual } from '../utils/split.js'

// Section 2: a form to add a new expense
function ExpenseForm({ friends, onAddExpense }) {
  // What the expense was for, e.g. "Dinner"
  const [description, setDescription] = useState('')
  // The total amount as typed, in rupees, e.g. "1200.50"
  const [amount, setAmount] = useState('')
  // The id of the friend who paid
  const [paidBy, setPaidBy] = useState('')
  // How to split: "equal" or "custom"
  const [splitType, setSplitType] = useState('equal')
  // Friends who are UNticked for the equal split: { friendId: true }
  const [unticked, setUnticked] = useState({})
  // Rupee amounts typed for the custom split: { friendId: "250" }
  const [customAmounts, setCustomAmounts] = useState({})
  // An error message to show (empty string means no error)
  const [error, setError] = useState('')

  // We need at least 2 friends before an expense makes sense
  if (friends.length < 2) {
    // Show only a hint instead of the form
    return (
      // A white card for the section
      <section className="card expense-form-section">
        {/* Section heading */}
        <h2 className="section-title">2. Add Expense</h2>
        {/* Explain what to do first */}
        <p className="muted">Add at least 2 friends to start adding expenses.</p>
      </section>
    ) // End of the hint UI
  } // End of friends check

  // Use the chosen payer if they still exist, otherwise the first friend
  const payerId = friends.some((friend) => friend.id === paidBy) ? paidBy : friends[0].id

  // Tick or untick a friend for the equal split
  function toggleFriend(friendId) {
    // Flip this friend's "unticked" value and keep everyone else the same
    setUnticked({ ...unticked, [friendId]: !unticked[friendId] })
  } // End of toggleFriend

  // Save the rupee amount typed for one friend in the custom split
  function changeCustomAmount(friendId, value) {
    // Update just this friend's amount and keep everyone else the same
    setCustomAmounts({ ...customAmounts, [friendId]: value })
  } // End of changeCustomAmount

  // Runs when the user clicks "Save Expense"
  function handleSubmit(event) {
    // Stop the browser from reloading the page
    event.preventDefault()
    // The description must not be empty
    if (description.trim() === '') {
      // Tell the user what is wrong
      setError('Please enter a description.')
      // Stop here
      return
    } // End of description check
    // Convert the typed rupees into paise (this is the only place we convert)
    const totalPaise = toPaise(amount)
    // The amount must be a valid number above zero
    if (Number.isNaN(totalPaise) || totalPaise <= 0) {
      // Tell the user what is wrong
      setError('Enter a valid amount, like 250 or 183.50.')
      // Stop here
      return
    } // End of amount check

    // This will hold each person's share in paise: { friendId: paise }
    let shares = {}
    // Equal split: share the total between the ticked friends
    if (splitType === 'equal') {
      // Make a list of ids for friends who are ticked
      const memberIds = friends.filter((friend) => !unticked[friend.id]).map((friend) => friend.id)
      // At least one person must be included
      if (memberIds.length === 0) {
        // Tell the user what is wrong
        setError('Tick at least one person to split with.')
        // Stop here
        return
      } // End of members check
      // Let splitEqual work out each person's share
      shares = splitEqual(totalPaise, memberIds)
    } else {
      // Custom split: go through every friend
      for (const friend of friends) {
        // Convert this friend's rupees to paise (an empty box counts as 0)
        const sharePaise = toPaise(customAmounts[friend.id] || '0')
        // Each amount must be a valid number
        if (Number.isNaN(sharePaise)) {
          // Tell the user which friend's amount is wrong
          setError(`Enter a valid amount for ${friend.name}.`)
          // Stop here
          return
        } // End of share check
        // Only keep people who actually have a share
        if (sharePaise > 0) {
          // Store this friend's share
          shares[friend.id] = sharePaise
        } // End of positive-share check
      } // End of friends loop
    } // End of split type check

    // Add up all the shares (in paise)
    const sharesTotal = Object.values(shares).reduce((sum, share) => sum + share, 0)
    // The shares must add up exactly to the total
    if (sharesTotal !== totalPaise) {
      // Tell the user both numbers so they can fix it
      setError(`The shares add up to ${formatRupees(sharesTotal)}, but the total is ${formatRupees(totalPaise)}.`)
      // Stop here
      return
    } // End of total check

    // Everything is valid: send the new expense up to App to save
    onAddExpense({
      description: description.trim(), // What it was for
      amountPaise: totalPaise, // Total in paise
      paidBy: payerId, // Who paid
      splitType: splitType, // "equal" or "custom"
      shares: shares, // Each person's share in paise
    }) // End of onAddExpense call
    // Clear the description box
    setDescription('')
    // Clear the amount box
    setAmount('')
    // Clear the custom amount boxes
    setCustomAmounts({})
    // Clear any old error
    setError('')
  } // End of handleSubmit

  // The UI for this section
  return (
    // A white card for the section
    <section className="card expense-form-section">
      {/* Section heading */}
      <h2 className="section-title">2. Add Expense</h2>
      {/* The expense form */}
      <form onSubmit={handleSubmit}>
        {/* Description field */}
        <div className="form-group">
          {/* Label for the description box */}
          <label htmlFor="description">Description</label>
          {/* Text box for the description */}
          <input
            id="description" // Links this box to its label
            type="text" // A normal text box
            placeholder="Dinner at restaurant" // Hint text shown when empty
            value={description} // Show what is stored in state
            onChange={(event) => setDescription(event.target.value)} // Save each key press
          />
        </div>
        {/* Amount field */}
        <div className="form-group">
          {/* Label for the amount box */}
          <label htmlFor="amount">Amount (₹)</label>
          {/* Text box for the amount in rupees */}
          <input
            id="amount" // Links this box to its label
            type="text" // Text, so we can convert it ourselves with toPaise
            inputMode="decimal" // Shows a number keypad on phones
            placeholder="1200" // Hint text shown when empty
            value={amount} // Show what is stored in state
            onChange={(event) => setAmount(event.target.value)} // Save each key press
          />
        </div>
        {/* Paid by field */}
        <div className="form-group">
          {/* Label for the dropdown */}
          <label htmlFor="paid-by">Paid by</label>
          {/* Dropdown of friends */}
          <select
            id="paid-by" // Links this dropdown to its label
            value={payerId} // The friend who is currently chosen
            onChange={(event) => setPaidBy(event.target.value)} // Save the new choice
          >
            {/* One option per friend */}
            {friends.map((friend) => (
              // The option's value is the friend's id; the text is their name
              <option key={friend.id} value={friend.id}>{friend.name}</option>
            ))}
          </select>
        </div>
        {/* Split type choice */}
        <div className="form-group">
          {/* Title for the two choices */}
          <span className="field-label">Split type</span>
          {/* The two radio buttons side by side */}
          <div className="split-options">
            {/* "Equally" option */}
            <label className="choice">
              {/* Radio button for equal split */}
              <input
                type="radio" // Only one radio in a group can be chosen
                name="split-type" // Both radios share this name
                checked={splitType === 'equal'} // Chosen if splitType is "equal"
                onChange={() => setSplitType('equal')} // Choose equal split
              />
              {/* Text next to the radio */}
              Equally
            </label>
            {/* "Custom amounts" option */}
            <label className="choice">
              {/* Radio button for custom split */}
              <input
                type="radio" // Only one radio in a group can be chosen
                name="split-type" // Both radios share this name
                checked={splitType === 'custom'} // Chosen if splitType is "custom"
                onChange={() => setSplitType('custom')} // Choose custom split
              />
              {/* Text next to the radio */}
              Custom amounts
            </label>
          </div>
        </div>
        {/* Equal split: show a checkbox for each friend */}
        {splitType === 'equal' && (
          // Group of checkboxes
          <div className="form-group">
            {/* Title for the checkboxes */}
            <span className="field-label">Split between</span>
            {/* One checkbox per friend */}
            {friends.map((friend) => (
              // Clicking the label also ticks the box
              <label key={friend.id} className="choice">
                {/* Checkbox: ticked unless the friend is in "unticked" */}
                <input
                  type="checkbox" // A tick box
                  checked={!unticked[friend.id]} // Ticked by default
                  onChange={() => toggleFriend(friend.id)} // Flip on click
                />
                {/* The friend's name */}
                {friend.name}
              </label>
            ))}
          </div>
        )}
        {/* Custom split: show a rupee box for each friend */}
        {splitType === 'custom' && (
          // Group of amount boxes
          <div className="form-group">
            {/* Title for the boxes */}
            <span className="field-label">Each person's share (₹)</span>
            {/* One row per friend */}
            {friends.map((friend) => (
              // A row with the name and an amount box
              <div key={friend.id} className="custom-row">
                {/* The friend's name, linked to their box */}
                <label htmlFor={`share-${friend.id}`}>{friend.name}</label>
                {/* Box for this friend's share in rupees */}
                <input
                  id={`share-${friend.id}`} // Unique id for the label
                  type="text" // Text, so we can convert it ourselves with toPaise
                  inputMode="decimal" // Shows a number keypad on phones
                  placeholder="0" // Hint text shown when empty
                  value={customAmounts[friend.id] || ''} // Show what is stored
                  onChange={(event) => changeCustomAmount(friend.id, event.target.value)} // Save each key press
                />
              </div>
            ))}
          </div>
        )}
        {/* Show the error only if there is one */}
        {error && <p className="error">{error}</p>}
        {/* Button that submits the form */}
        <button type="submit" className="btn btn-primary btn-block">+ Save Expense</button>
      </form>
    </section>
  ) // End of the returned UI
} // End of ExpenseForm component

// Export so App.jsx can use it
export default ExpenseForm
