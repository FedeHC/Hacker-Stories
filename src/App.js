import { useState, useEffect, useRef, useReducer, useCallback, memo } from "react";
import "./App.css";
import logo from "./img/favicon.png";
import axios from 'axios';


// API URL Endpoint (searching by relevance):
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// URL Comments:
const URL_COMMENTS = 'https://news.ycombinator.com/item?id=';

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

function App() {
  // --------------------------------------------------------------------------
  // Hooks
  // --------------------------------------------------------------------------

  // Custom hook:
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  // URL state:
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  // useReducer function:
  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,          // Setting loading condition.
          isError: false,
        };
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,     // Updating array with results.
        };
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,            // Setting error condition.
          errorMsg: action.payload, // Return string with error message.
        };
      case 'REMOVE_STORY':
        return {
          ...state,
          data: state.data.filter((story) =>
            action.payload.objectID !== story.objectID
          ),
        };
      default:
        throw new Error();
    }
  };

  // Reducer Object:
  const reducerObject = {
    data: [],
    isLoading: false,
    isError: false
  };

  // useReducer:
  const [stories, dispatchStories] = useReducer(storiesReducer, reducerObject);

  // Fetch stories:
  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });  // Call dispatch to change to loading state.

    try {
      const result = await axios.get(url);            // And fetch stories from HN's API.
      dispatchStories(
        {
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits,
        });
    } catch (error) {                                 // Catch errors if any.
      dispatchStories(
        {
          type: 'STORIES_FETCH_FAILURE',
          payload: error.message,
        });
    }
  }, [url]);                                          // Only fetch again if URL with searchTerm changes.

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  // Using useCallback (with an empty array) to disable re-rendering if inputSearch
  // changes:
  const handleRemoveStory = useCallback((item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }, []);

  // --------------------------------------------------------------------------
  // JSX
  // --------------------------------------------------------------------------
  
  // console.log("[APP]");
  return (
    <>
      <img src={logo} className="imageLogo" alt="" />
      <div className="divApp">
        <h1>Hacker Stories</h1>

        {/* Show if ERROR */}
        {stories.isError &&
          <>
            <p className="subTitle">Sorry, something went wrong when searching for data. :(
            <br />Try again later.</p><br />
            {/* <p className="errorMessage">Reason: {stories.errorMsg}</p> */}
          </>
        }

        {/* Show while LOADING */}
        {stories.isLoading && <p className="subTitle">Loading...</p>}

        {/* Show when LOADED */}
        {!stories.isLoading && !stories.isError &&
          <>
            <SearchForm searchTerm={searchTerm}
                        onSearchInput={handleSearchInput}
                        onSearchSubmit={handleSearchSubmit} />
            <table className="tableStories">
              <tbody>
                <TableStories list={stories.data}
                              onRemoveItem={handleRemoveStory} />
              </tbody>
            </table>

            <br/>
          </>
        }
      </div>
    </>
  );
}

// --------------------------------------------------------------------------
// SUB-COMPONENTS
// --------------------------------------------------------------------------

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <>
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel id="searchInput"
                      value={searchTerm}
                      type="text"
                      onInputChange={onSearchInput}
                      isFocused={true}
      >Search:</InputWithLabel>

      <button id="submitButton"
              type="submit"
              disabled={!searchTerm}
      >Submit!</button>

      <br /> <br />
    </form>
    <br />
  </>
);

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

const TableStories = memo( function ({ list, onRemoveItem }) {
  // console.log("[LIST]");
  return list.map( (item, index) => (
    <RowStory key={item.objectID}
              item={item}
              index={index}
              onRemoveItem={onRemoveItem} />
  ))
});

function RowStory({ item, index, onRemoveItem }) {
  const dateStory = new Date(item.created_at).toLocaleDateString() + ' ' +
                    new Date(item.created_at).toLocaleTimeString();
  index += 1;

  return (
    <>
      <tr className={index % 2 === 0 ? "rowStories1" : "rowStories2"}>
        <td className="firstCol">{'#' + index + ' '}</td>

        <td className="secondCol">
          <span className="fieldTitle">{ item.title? "Title: " : "Comment: "}</span>
          <a href={item.url ? item.url : URL_COMMENTS + item.objectID}
             className="linkField"
             target="_blank"
             rel="noreferrer"
          >{item.title ? item.title : '[Link]'}</a>
          <br/>

          <span className="fieldTitle">Author/s: </span>
          <span className="fieldData">{item.author}</span>
          <br/>

          <span className="fieldTitle">Date: </span>
          <span className="fieldData">{dateStory}</span>
          <br/>

          {item.title &&
          <>
            <span className="fieldTitle">Comments: </span>
            <a href={URL_COMMENTS + item.objectID}
               className="linkField"
               target="_blank"
               rel="noreferrer"
            >{item.num_comments}</a>
            <br/>
          </>
          }

          <span className="fieldTitle">Points: </span>
          <span className="fieldData">{item.points ? item.points : '-'}</span>
          <br/>
        </td>

        <td className="thirdCol">
          <div className="buttonDiv">
            <button id="dissmissButton"
                    type="button"
                    onClick={() => onRemoveItem(item)}
            >❌</button>
            <span className="buttonTooltip">Dismiss this story</span>
          </div>
        </td>
      </tr>
    </>
  );
}

export default App;
export { SearchForm, InputWithLabel, TableStories, RowStory };

