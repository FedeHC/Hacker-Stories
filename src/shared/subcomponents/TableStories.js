import { memo } from "react";
import RowStory from "./RowStory";


// Subcomponent TableStories (as memo function):
const TableStories = memo(function ({ list, onRemoveItem,
                                      lastField, onFunctionOrder, lastOrder,
                                      titleOrder, onTitleArrow,
                                      authorOrder, onAuthorArrow,
                                      dateOrder, onDateArrow,
                                      commentsOrder, onCommentsArrow,
                                      pointsOrder, onPointsArrow }) {
   return (
    <>
      <tr className="rowStoriesHead">
        <th>#</th>

        <th onClick={ () => onTitleArrow() }
        >{"Title " + titleOrder}</th>

        <th onClick={ () => onAuthorArrow() }
        >{"Author " + authorOrder}</th>

        <th /* onClick={ () => onDateArrow() } */
        >{"Date " + dateOrder}</th>

        <th /* onClick={ /*() => onCommentsArrow() } */
        >{"Comments " + commentsOrder}</th>
        
        <th /* onClick={ /*() => onPointsArrow() } */
        >{"Points " + pointsOrder}</th>

        <th>Actions</th>
      </tr>

      {list.sort(onFunctionOrder(lastField, lastOrder())).map((item, index) => (
        <RowStory key={item.objectID}
                  item={item}
                  index={index}
                  onRemoveItem={onRemoveItem} />
      ))}
    </>
  )
});

export default TableStories;
