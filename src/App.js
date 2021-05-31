import "./App.css";
import logo from "./img/favicon.png";


function List(props) {
  return (
    <ul>
    {props.list.map((element) => {
      return (
        <li key={element.objectID}>
          <span className="fieldData">#{element.objectID}</span>
          <br />

          <span className="fieldTitle">Title: </span>
          <span className="fieldData">{element.title}</span>
          <br />

          <span className="fieldTitle">Author/s: </span>
          <span className="fieldData">{element.author}</span>
          <br />

          <span className="fieldTitle">URL: </span>
          <a href={element.url} className="fieldData" target="_blank" rel="noreferrer">{element.url}</a>
          <br /><br />
        </li>
      );
    })}
    </ul>
  );
}

function App() {
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 1,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 2,
    },
    {
      title: 'Sarasa',
      url: 'https://www.sarasa.com.ar/',
      author: 'Sar Langa',
      num_comments: 10,
      points: 10,
      objectID: 3,
    },
  ];
  
  const handleChange = (event) => {
    console.log(event.target.value);
  };

  return (
    <>
      <img src={logo} className="imageLogo" alt="" />
      <div className="divApp">
        <h1>Lista:</h1>
        <label htmlFor="inputSearch">Search: </label>
        <input id="inputSearch" type="text" size={13} onChange={handleChange} />
        <br /><br />
        
        <List list={stories} />
        <br />

      </div>
    </>
  );
}

export default App;
