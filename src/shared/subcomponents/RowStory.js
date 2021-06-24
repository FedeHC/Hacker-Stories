import { URL_COMMENTS } from "../urls";


// Subcomponent RowStory:
function RowStory({ item, index, onRemoveItem }) {
  // Get datetime string with "dd/mm/yyyy hh:mm" format:
  const dateStory = new Date(item.created_at).toLocaleDateString() + ' ' +
    new Date(item.created_at).toLocaleTimeString().split(":").slice(0, -1).join(":");
  index += 1;

  return (
    <>
      {/* Row */}
      <tr className={index % 2 === 0 ? "rowStories1" : "rowStories2"}>
        {/* # */}
        <td>{index}</td>
        
        {/* Title/Comment */}
        <td>
          <a href={item.url ? item.url : URL_COMMENTS + item.objectID}
             className="linkField"
             target="_blank"
             rel="noreferrer">
            <i>{item.title ? item.title : '(Link to HN comment)'}</i>
          </a>
        </td>

        {/* Author/s */}
        <td><span className="fieldData">{item.author}</span></td>

        {/* Date */}
        <td><span className="fieldData">{dateStory}</span></td>

        {/* # Comments */}
        {item.title ? (
          <td>
            <a href={URL_COMMENTS + item.objectID}
               className="linkField"
               target="_blank"
               rel="noreferrer"
            >{item.num_comments}</a>
          </td>
          ) : (
          <td>-</td>
          )
        }
        
        {/* Points */}
        <td><span className="fieldData">{item.points ? item.points : '-'}</span></td>
        
        {/* Dismiss */}
        <td className="buttonCol">
          <span className="buttonSpan">
            <button id="dismissButton"
                    type="button"
                    onClick={() => onRemoveItem(item)}
            >❌</button>
            <span className="buttonTooltip">Dismiss this story</span>
          </span>
        </td>
      </tr>
    </>
  );
}

export default RowStory;
