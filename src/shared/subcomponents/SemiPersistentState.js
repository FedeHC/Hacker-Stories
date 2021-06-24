import { useState, useEffect, useRef } from "react";

// Custom hook:
const useSemiPersistentState = (key, initialState = "") => {
  // Create ref hook for keep a made-up state:
  const isMounted = useRef(false);

  // Create state hook for keeping an input value via localStorage:
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  
  // Calling useEffect hook for saving the input value, but only on each re-rendering: 
  useEffect(() => {
    if (!isMounted.current) {           // If not mounted...
      isMounted.current = true;
    } else {                            // If mounted...
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
}

export default useSemiPersistentState;
