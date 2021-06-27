import { memo } from "react";
import RowStory from "./RowStory";


// Subcomponent TableStories (as memo function):
const TableStories = memo(function ({ list, onRemoveItem, order, onOrder, onFunctionOrder }) {
   return (
    <>
      <tr className="rowStoriesHead">
        <th>#</th>

        <th onClick={ () => onOrder('title') }
        >{"Title " + order.title}</th>

        <th onClick={ () => onOrder('author') }
        >{"Author " + order.author}</th>

        <th onClick={ () => onOrder('created_at') }
        >{"Date " + order.created_at}</th>

        <th onClick={ () => onOrder('num_comments') }
        >{"Comments " + order.num_comments}</th>
        
        <th onClick={ () => onOrder('points') }
        >{"Points " + order.points}</th>

        <th>Actions</th>
      </tr>

      {list.sort(onFunctionOrder(order.lastField, order[order.lastField])).map( (item, index) => 
        <RowStory key={item.objectID}
                  item={item}
                  index={index}
                  onRemoveItem={onRemoveItem} />
      )}
    </>
  )
});

export default TableStories;
