import { useEffect, useRef } from "react";

// Subcomponent InputWithLabel:
function InputWithLabel({ id, value, type, onInputChange, isFocused, dataList, children }) {
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
             list="inputDatalist"
             type={type}
             size={13}
             value={value}
             onChange={onInputChange}
             ref={inputRef} />
      
      <datalist id="inputDatalist">
        {dataList.map( (item, index) => 
          <option key={index} value={item} />
        )}
      </datalist>
    </>
  );
}

export default InputWithLabel;
