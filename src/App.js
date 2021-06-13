import { useState, useEffect, useRef, useReducer, useCallback } from "react";
import "./App.css";
import logo from "./img/favicon.png";
import axios from 'axios';


// API URL Endpoint (searching by relevance):
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// URL Comments:
const URL_COMMENTS = 'https://news.ycombinator.com/item?id=';


// Custom hook:
const useSemiPersistentState = (key, initialState = "") => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}


function App() {
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
    // Call dispatch to change to loading state:
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    // And fetch stories from HN's API:

    try {
      const result = await axios.get(url);
      dispatchStories(
        {
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits,
        });
    } catch (error) {
      dispatchStories(
        {
          type: 'STORIES_FETCH_FAILURE',
          payload: error.message,
        });
    }
  }, [url]);  // Only fetch again if URL with searchTerm changes.

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]); 


  // Events handlers:
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  // JSX:
  return (
    <>
      <img src={logo} className="imageLogo" alt="" />
      <div className="divApp">
        <h1>Hacker Stories</h1>

        {/* Show on ERROR */}
        {stories.isError &&
          <>
            <p className="subTitle">Sorry, something went wrong when searching for data. :(
              <br />
              Try again later.</p>
            <br />
            {/* <p className="errorMessage">Reason: {stories.errorMsg}</p> */}
          </>
        }

        {/* Show while LOADING */}
        {stories.isLoading &&
          <p className="subTitle">Loading...</p>
        }

        {/* Show when LOADED */}
        {!stories.isLoading && !stories.isError &&
          <>
            <SearchForm searchTerm={searchTerm}
              onSearchInput={handleSearchInput}
              onSearchSubmit={handleSearchSubmit}
            />
            <br />

            <List list={stories.data}
              className="items"
              onRemoveItem={handleRemoveStory}
            />
            <br />
          </>
        }
      </div>
    </>
  );
}

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
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
);

function List({ list, onRemoveItem }) {
  return (
    <ul>
      {list.map((item, index) => {
        return (
          <li key={item.objectID} className="items">
            <Item item={item} index={index} onRemoveItem={onRemoveItem} />
            <br />
          </li>
        );
      })}
    </ul>
  );
}

function Item({ item, index, onRemoveItem }) {
  const dateStory = new Date(item.created_at).toLocaleDateString(); // Date.
  const timeStory = new Date(item.created_at).toLocaleTimeString(); // Time.
  const fullDateStory = dateStory + ' ' + timeStory;                // Date+Time.
  index = parseInt(index) + 1; // Parse index to integer and sum 1.

  return (
    <div className="containerSubItems">
      <div className="firstColSubItems">
        <SubItem title={'#' + index} data="" />
      </div>

      <div className="secondColSubItems">
        <SubItem title="Title:" data={item.title} url={item.url} />
        <SubItem title="Author/s:" data={item.author} />
        <SubItem title="Date:" data={fullDateStory} />
        <SubItem title="Comments:" data={item.num_comments} url={URL_COMMENTS + item.objectID} />
        <SubItem title="Points:" data={item.points} />
      </div>

      <div className="thirdColSubItems">
        <SubItem title="" fullItem={item} onRemoveItem={onRemoveItem} />
      </div>
    </div>
  );
}

function SubItem({ title, data, isBold, url, fullItem, onRemoveItem }) {
  return (
    <>
      <span className="fieldTitle">{title} </span>
      {/* If NO LINK is given... */}
      {!url &&
        <span className={isBold ? "fieldDataBold" : "fieldData"}>
          {/* If NO ITEM, just put data. */}
          {!fullItem && data}

          {/* If ITEM, insert button for dismiss story. */}
          {fullItem &&
            <div className="buttonDiv">
              <button id="dissmissButton"
                type="button"
                onClick={() => onRemoveItem(fullItem)}>
                ❌
              </button>
              <span className="buttonTooltip">Dismiss this story</span>
            </div>
          }
        </span>
      }

      {/* If LINK... */}
      {url &&
        <>
          <a href={url}
            className="linkField"
            target="_blank"
            rel="noreferrer">
            {data}
          </a>
        </>
      }
      <br />
    </>
  );
}

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

export default App;
