import { useEffect, useRef } from "react";

// Subcomponent InputWithLabel:
function InputWithLabel({ id, value, type, onInputChange, isFocused, children }) {
  // Useref hook for input:
  const inputRef = useRef();

  // Give focus to input on first render:
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input id={id}
             type={type}
             size={13}
             value={value}
             onChange={onInputChange}
             ref={inputRef} />
    </>
  );
}

export default InputWithLabel;
