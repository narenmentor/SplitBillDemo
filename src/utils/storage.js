// Small helpers to save and load lists in the browser's localStorage

// Read a saved list by its key, or give an empty list if nothing is saved
export function loadList(key) {
  // try/catch protects us if the saved text is broken or storage is blocked
  try {
    // Get the saved text (it is null if nothing was saved yet)
    const saved = localStorage.getItem(key)
    // Turn the text back into an array, or use an empty array
    return saved ? JSON.parse(saved) : []
  } catch {
    // Something went wrong, so start with an empty list
    return []
  } // End of try/catch
} // End of loadList

// Save a list under a key as JSON text
export function saveList(key, list) {
  // try/catch protects us if storage is full or blocked
  try {
    // Turn the array into text and store it
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // Saving failed; the app still works, it just won't remember this change
  } // End of try/catch
} // End of saveList

// Delete a saved list completely
export function removeList(key) {
  // try/catch protects us if storage is blocked
  try {
    // Remove the key from localStorage
    localStorage.removeItem(key)
  } catch {
    // Nothing to do if removing fails
  } // End of try/catch
} // End of removeList
