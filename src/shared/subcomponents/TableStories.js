import { memo } from "react";
import RowStory from "./RowStory";


// Subcomponent TableStories (as memo function):
const TableStories = memo( function ({ list, onRemoveItem }) {
  // console.log("[LIST]");
  return list.map( (item, index) => (
    <RowStory key={item.objectID}
              item={item}
              index={index}
              onRemoveItem={onRemoveItem} />
  ))
});

export default TableStories;
