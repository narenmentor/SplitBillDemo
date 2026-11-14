// useState lets this component remember what the user is typing
import { useState } from 'react'

// Section 1: add friends and show the list of friends
function Friends({ friends, onAddFriend }) {
  // The name currently typed in the input box
  const [name, setName] = useState('')
  // An error message to show (empty string means no error)
  const [error, setError] = useState('')

  // Runs when the form is submitted (Add button or Enter key)
  function handleSubmit(event) {
    // Stop the browser from reloading the page
    event.preventDefault()
    // Remove extra spaces from the start and end of the name
    const trimmedName = name.trim()
    // Do not allow an empty name
    if (trimmedName === '') {
      // Tell the user what is wrong
      setError('Please type a name.')
      // Stop here
      return
    } // End of empty-name check
    // Check if a friend with the same name already exists (ignoring capital letters)
    const alreadyAdded = friends.some((friend) => friend.name.toLowerCase() === trimmedName.toLowerCase())
    // Do not allow the same name twice
    if (alreadyAdded) {
      // Tell the user what is wrong
      setError(`${trimmedName} is already in the group.`)
      // Stop here
      return
    } // End of duplicate check
    // Send the new name up to App, which saves it
    onAddFriend(trimmedName)
    // Clear the input box
    setName('')
    // Clear any old error
    setError('')
  } // End of handleSubmit

  // The UI for this section
  return (
    // A white card for the section
    <section className="card friends-section">
      {/* Section heading */}
      <h2 className="section-title">1. Add Friends</h2>
      {/* The form with the name input and Add button */}
      <form className="inline-form" onSubmit={handleSubmit}>
        {/* Text box for the friend's name */}
        <input
          type="text" // A normal text box
          placeholder="Friend's name" // Hint text shown when empty
          aria-label="Friend's name" // Label for screen readers
          value={name} // Show what is stored in state
          onChange={(event) => setName(event.target.value)} // Save each key press into state
        />
        {/* Button that submits the form */}
        <button type="submit" className="btn btn-primary">+ Add</button>
      </form>
      {/* Show the error only if there is one */}
      {error && <p className="error">{error}</p>}
      {/* If there are no friends yet, show a hint; otherwise show the list */}
      {friends.length === 0 ? (
        // Hint for an empty group
        <p className="muted">No friends yet. Add at least 2 to start splitting.</p>
      ) : (
        // The list of friends, in the order they were added
        <ul className="friends-list">
          {/* Make one list item per friend */}
          {friends.map((friend) => (
            // Each item needs a unique key so React can track it
            <li key={friend.id} className="friend-item">
              {/* A circle with the first letter of the name */}
              <span className="friend-avatar">{friend.name[0].toUpperCase()}</span>
              {/* The friend's full name */}
              {friend.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  ) // End of the returned UI
} // End of Friends component

// Export so App.jsx can use it
export default Friends
