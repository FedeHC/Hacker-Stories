// Libraries:
import { useState, useEffect, useReducer, useCallback } from "react";
import "./App.css";
import logo from "./shared/img/favicon.png";
import axios from 'axios';

// Subcomponents:
import useSemiPersistentState from "./shared/subcomponents/SemiPersistentState";
import SearchForm from "./shared/subcomponents/SearchForm";
import TableStories from "./shared/subcomponents/TableStories";
import { API_ENDPOINT } from "./shared/urls";


function App() {
  // Using custom hook:
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  // URL state:
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  // useReducer function:
  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,            // Setting loading condition.
          isError: false,
        };
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,       // Updating array with results.
        };
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,              // Setting error condition.
          errorMsg: action.payload,   // Return string with error message.
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
    } catch (error) {                                 // Catch any errors while fetching data.
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

  // Using useCallback to disable re-rendering if inputSearch changes:
  const handleRemoveStory = useCallback( (item) => {
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
              <tbody id="bodyTable">
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

export default App;
