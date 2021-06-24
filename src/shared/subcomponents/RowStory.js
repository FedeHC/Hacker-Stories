import { URL_COMMENTS } from "../urls";


// Subcomponent RowStory:
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

export default RowStory;
