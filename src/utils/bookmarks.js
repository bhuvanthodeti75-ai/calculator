// Bookmarks and Recently Used Manager

const BOOKMARKS_KEY = 'calcnest_bookmarks';
const RECENTS_KEY = 'calcnest_recents';
const SAVED_CALCS_KEY = 'calcnest_saved_calculations';

export const getBookmarks = () => {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || [];
  } catch {
    return [];
  }
};

export const toggleBookmark = (id) => {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(id);
  if (index > -1) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(id);
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  return bookmarks;
};

export const isBookmarked = (id) => {
  return getBookmarks().includes(id);
};

export const getRecents = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY)) || [];
  } catch {
    return [];
  }
};

export const addRecent = (id) => {
  let recents = getRecents();
  // Remove existing to place at front
  recents = recents.filter(item => item !== id);
  recents.unshift(id);
  // Cap at 8 recent items
  recents = recents.slice(0, 8);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
  return recents;
};

export const getSavedCalculations = () => {
  try {
    return JSON.parse(localStorage.getItem(SAVED_CALCS_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveCalculation = (calcId, calcName, inputs, outputs) => {
  try {
    const list = getSavedCalculations();
    const entry = {
      id: Math.random().toString(36).substr(2, 9),
      calcId,
      calcName,
      inputs,
      outputs,
      timestamp: new Date().toISOString()
    };
    list.unshift(entry);
    // Cap at 15 saved results
    localStorage.setItem(SAVED_CALCS_KEY, JSON.stringify(list.slice(0, 15)));
    return entry;
  } catch (e) {
    console.error('Error saving calculation:', e);
  }
};

export const clearSavedCalculations = () => {
  localStorage.removeItem(SAVED_CALCS_KEY);
};
