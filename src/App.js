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

const DEFAULT_SEARCH = "React";

function App() {
  // Using custom hook for keeping record of the input value:
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", DEFAULT_SEARCH);

  // Page state:
  const [page, setPage] = useState(0);

  // URL state:
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  // dataList (for input) state:
  const [dataList, setdataList] = useState([DEFAULT_SEARCH]); // Array with a first value.

  // Reducer stories function:
  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isOnInit: false,            // Finish init condition.
          isLoading: true,            // Start load condition.
        };
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          data: action.payload,       // Updating array with results.
          isLoading: false,
        };
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,           // Finish loading condition.
          isError: true,              // Start error condition.
          errorMsg: action.payload,   // Set error string message.
        };
      case 'STORY_REMOVE':
        return {
          ...state,
          data: state.data.filter((story) =>
            action.payload.objectID !== story.objectID
          ),
        };
      case 'STORIES_ADD_PAGE':
        return {
          ...state,
          data: [...state.data, ...action.payload],
          isLoading: false
        };
      default:
        throw new Error();
    }
  };

  // Reducer initial stories object :
  const reducerStoriesObj = {
    data: [],
    isOnInit: true,                   // On true at initializing.
    isLoading: false,
    isError: false,
    errorMsg: null
  };

  // useReducer for fetched stories:
  const [stories, dispatchStories] = useReducer(storiesReducer, reducerStoriesObj);

  // Reducer order function:
  const orderReducer = (state, action) => {
    const cleanOrderObj = {
      title: '',
      author: '',
      created_at: '',
      num_comments: '',
      points: '',
      lastfield: ''
    };

    switch (action.type) {
      case 'TITLE':
        return {
          ...cleanOrderObj,
          title: state.title === '▲' ? '▼' : '▲',
          lastField: action.type.toLowerCase()
        };
      case 'AUTHOR':
        return {
          ...cleanOrderObj,
          author: state.author === '▲' ? '▼' : '▲',
          lastField: action.type.toLowerCase()
        };
      case 'CREATED_AT':
        return {
          ...cleanOrderObj,
          created_at: state.created_at === '▲' ? '▼' : '▲',
          lastField: action.type.toLowerCase()
        };
      case 'NUM_COMMENTS':
        return {
          ...cleanOrderObj,
          num_comments: state.num_comments === '▲' ? '▼' : '▲',
          lastField: action.type.toLowerCase()
        };
      case 'POINTS':
        return {
          ...cleanOrderObj,
          points: state.points === '▲' ? '▼' : '▲',
          lastField: action.type.toLowerCase()
        };
      default:
        throw new Error();
    };
  }

    // Reducer initial order object :
    const reducerOrderObj = {
      title: '',
      author: '',
      created_at: '',
      num_comments: '',
      points: '▼',                    // 'points' is the default order at first fetch.
      lastField: ''
    };
  
    // useReducer for asc/desc order in columns:
    const [order, dispatchOrder] = useReducer(orderReducer, reducerOrderObj);
  
  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  const handleFetchStories = useCallback(async (newPg) => {       // newPage has a value if user clicks 'Show more stories!' button.
    dispatchStories({ type: 'STORIES_FETCH_INIT' });              // Change to loading condition.

    try {
      if(newPg) {
        setPage(newPg);                                           // Increment page count.
        const results = await axios.get(`${url}&page=${newPg}`);  // Fetch data from HN.
        dispatchStories(                                          // Dispatch data to useReducer.
          {
            type: 'STORIES_ADD_PAGE',
            payload: results.data.hits,
          });
      }
      else {
        const results = await axios.get(`${url}&page=0`);         // Fetch data from HN.
        dispatchStories(                                          // Dispatch data to useReducer.
          {
            type: 'STORIES_FETCH_SUCCESS',
            payload: results.data.hits,
          });
      }
    } catch (error) {                                             // Catch any fetch errors.
      dispatchStories(
        {
          type: 'STORIES_FETCH_FAILURE',
          payload: error.message,
        });
    }
  }, [url]);                                                      // Only fetch again if URL and page changes.
  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setUrl(`${API_ENDPOINT}${searchTerm}&page=${page}`);
 
    if(!(dataList.includes(searchTerm))) {    // if searchTerm is NOT in dataList...
      let newDataList = [...dataList];
      newDataList.unshift(searchTerm);        // 'unshift' mutates newDataList.
      
      if(newDataList.length > 5)
       newDataList = newDataList.slice(0,5)   // Keep array to five (5) elements.

      setdataList(newDataList);               // Add searchTerm in array as 1° element.
    }
  };

  // Using useCallback to disable re-rendering if inputSearch changes:
  const handleRemoveStory = useCallback( (item) => {
    dispatchStories({
      type: 'STORY_REMOVE',
      payload: item,
    });
  }, []);

  // Functions for showing arrows on top of the columns for ordering (if clicked): 
  const handleArrowField = (field) => {
    dispatchOrder({ type: field.toUpperCase()})
  };

  // Function for the sort array function:
  const handleFunctionOrder = (field, fieldOrder) => {
    if(fieldOrder === '')
      return undefined;             // Return undefined to sort function.
    else {
      return (a, b) => {
        if (typeof a[field] === 'string') {
          if (a[field].toLowerCase() < b[field].toLowerCase())
            if(fieldOrder === '▲') return -1;
            else return 1;

          else if (a[field].toLowerCase() > b[field].toLowerCase())
            if(fieldOrder === '▲') return 1;
            else return -1;

          else return 0;
        }
        else {
          if (a[field] < b[field])
            if(fieldOrder === '▲') return -1;
            else return 1;

          else if (a[field] > b[field])
            if(fieldOrder === '▲') return 1;
            else return -1;

          else return 0;
        }
      }
    }
  };

  // --------------------------------------------------------------------------
  // JSX
  // --------------------------------------------------------------------------

  return (
    <> 
      <div className="divApp">
        <br/>
        <img src={logo} className="imageLogo" alt="" />
        <h1 className="titleApp">Hacker Stories</h1>
        <br/><br/>

        {/* Show if ERROR */}
        {!stories.isOnInit && stories.isError &&
          <>
            <p className="subTitle">Sorry, something went wrong when searching for data. :(
            <br />Try again later.</p><br />
            {/* <p className="errorMessage">Reason: {stories.errorMsg}</p> */}
          </>
        }

        {/* Show while LOADING */}
        {!stories.isOnInit && stories.isLoading && <p className="subTitle">Loading new data...</p>}

        {/* Show when LOADED */}
        {!stories.isOnInit && !stories.isLoading && !stories.isError &&
          <>
            <SearchForm searchTerm={searchTerm}
                        onSearchInput={handleSearchInput}
                        onSearchSubmit={handleSearchSubmit}
                        dataList={dataList} />

            <table className="tableStories">
              <tbody id="bodyTable">
                <TableStories list={stories.data}
                              onRemoveItem={handleRemoveStory}
                              order={order}
                              onOrder={handleArrowField}
                              onFunctionOrder={handleFunctionOrder} />
              </tbody>
            </table>

            <br/><br/>

            <div className="moreStoriesDiv">
              <button id="moreStoriesButton"
                      type="button"
                      onClick={ () => handleFetchStories(page+1)}
              >Show more stories!</button>
            </div>
            <br/>
          </>
        }
      </div>
    
      {!stories.isOnInit && !stories.isLoading &&
        <div className="divFooter">
          <img src={logo} className="imageLogoFooter" alt="" />
          <h1 className="titleFooter">Por FedeHC - 2021</h1>
        </div>
      }
    </>
  );
}

export default App;
