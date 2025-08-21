// Clear all localStorage data to fix conflicts
export const clearAllStorage = () => {
  localStorage.removeItem('stitch_savour_user');
  localStorage.removeItem('stitch_savour_registered_users');
  localStorage.removeItem('token');
  localStorage.removeItem('stitch_savour_cart');
  console.log('All localStorage cleared');
};

// Call this in browser console if needed
window.clearAllStorage = clearAllStorage;