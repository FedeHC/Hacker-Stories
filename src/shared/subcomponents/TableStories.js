import { memo } from "react";
import RowStory from "./RowStory";


// Subcomponent TableStories (as memo function):
const TableStories = memo(function ({ list, onRemoveItem }) {
  // console.log("[LIST]");
  return (
    <>
      <tr className="rowStoriesHead">
        <th>#</th>
        <th id="titleHead">Title</th>
        <th>Author</th>
        <th>Date</th>
        <th>Comments</th>
        <th>Points</th>
        <th>Actions</th>
      </tr>

      {list.map((item, index) => (
        <RowStory key={item.objectID}
          item={item}
          index={index}
          onRemoveItem={onRemoveItem} />
      ))}
    </>
  )
});

export default TableStories;
