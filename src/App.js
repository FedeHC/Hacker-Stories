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
  // Using custom hook for keeping record of the input value:
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  // Table columns states:
  const [lastField, setLastField] = useState('');
  const [titleOrder, setTitleOrder] = useState('');
  const [authorOrder, setAuthorOrder] = useState('');
  const [dateOrder, setDateOrder] = useState('');
  const [commentsOrder, setCommentsOrder] = useState('');
  const [pointsOrder, setPointsOrder] = useState('');

  // URL state:
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  // useReducer function:
  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isOnInit: false,
          isLoading: true,            // Setting loading condition.
          isError: false,
        };
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isOnInit: false,
          isLoading: false,
          isError: false,
          data: action.payload,       // Updating array with results.
        };
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isOnInit: false,
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
    isOnInit: true,
    isLoading: false,
    isError: false
  };

  // useReducer:
  const [stories, dispatchStories] = useReducer(storiesReducer, reducerObject);

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

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

  // Functions for showing arrows on top of the columns for ordering (if clicked): 
  const handleTitleArrow = () => {
    titleOrder === '↑' ? setTitleOrder('↓') : setTitleOrder('↑');
    setLastField('title');
  }

  const handleAuthorArrow = () => {
    authorOrder === '↑' ? setAuthorOrder('↓') : setAuthorOrder('↑');    
    setLastField('author');
  }

  const handleDateArrow = () => {
    dateOrder === '↑' ? setDateOrder('↓') : setDateOrder('↑');
    setLastField('date');
  }

  const handleCommentsArrow = () => {
    commentsOrder === '↑' ? setCommentsOrder('↓') : setCommentsOrder('↑');
    setLastField('comments');
  }

  const handlePointsArrow = () => {
    pointsOrder === '↑' ? setPointsOrder('↓') : setPointsOrder('↑');
    setLastField('points');
  }

  // Function for the sort array function:
  const handleFunctionOrder = (field, fieldOrder) => {
    if(fieldOrder === ''){
      return undefined;
    }
    else if(fieldOrder === '↑') {      
      return (a, b) => {
        if (a[field].toLowerCase() < b[field].toLowerCase())
          return -1;
        if (a[field].toLowerCase() > b[field].toLowerCase())
          return 1;
        return 0;
      }
    }
    else if(fieldOrder === '↓') {
      return (a, b) => {
        if (a[field].toLowerCase() > b[field].toLowerCase())
          return -1;
        if (a[field].toLowerCase() < b[field].toLowerCase())
          return 1;
        return 0;
      }
    }
  }

  const handleLastOrder = () => {
    let lastOrder;
      switch(lastField){
        case 'title':
          lastOrder = titleOrder;
          break;
        case 'author':
          lastOrder = authorOrder;
          break;
        case 'date':
          lastOrder = dateOrder;
          break;
        case 'comments':
          lastOrder = commentsOrder;
          break;
        case 'points':
          lastOrder = pointsOrder;
          break;
        default:
          lastOrder = '';
          break;
      }
    return lastOrder;
  }

  // --------------------------------------------------------------------------
  // JSX
  // --------------------------------------------------------------------------
  
  return (
    <>
      <img src={logo} className="imageLogo" alt="" />
  
      <div className="divApp">
        <h1>Hacker Stories</h1>

        {/* Show if ERROR */}
        {!stories.isOnInit && stories.isError &&
          <>
            <p className="subTitle">Sorry, something went wrong when searching for data. :(
            <br />Try again later.</p><br />
            {/* <p className="errorMessage">Reason: {stories.errorMsg}</p> */}
          </>
        }

        {/* Show while LOADING */}
        {!stories.isOnInit && stories.isLoading && <p className="subTitle">Loading...</p>}

        {/* Show when LOADED */}
        {!stories.isOnInit && !stories.isLoading && !stories.isError &&
          <>
            <SearchForm searchTerm={searchTerm}
                        onSearchInput={handleSearchInput}
                        onSearchSubmit={handleSearchSubmit} />
            <table className="tableStories">
              <tbody id="bodyTable">
                <TableStories list={stories.data}
                              onRemoveItem={handleRemoveStory}

                              lastField={lastField}
                              onFunctionOrder={handleFunctionOrder}
                              lastOrder={handleLastOrder}

                              titleOrder={titleOrder}
                              onTitleArrow={handleTitleArrow}
                              authorOrder={authorOrder}
                              onAuthorArrow={handleAuthorArrow}
                              dateOrder={dateOrder}
                              onDateArrow={handleDateArrow}
                              commentsOrder={commentsOrder}
                              onCommentsArrow={handleCommentsArrow}
                              pointsOrder={pointsOrder}
                              onPointsArrow={handlePointsArrow} />
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
