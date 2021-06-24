import React from 'react';
import renderer from 'react-test-renderer';

import App, { SearchForm, InputWithLabel, TableStories, RowStory } from './App';


// Test suite:
describe('RowStory', () => {
  const item = {
    "created_at": "2017-09-22T21:51:56.000Z",
    "title": "Relicensing React, Jest, Flow, and Immutable.js",
    "url": "https://code.facebook.com/posts/300798627056246",
    "author": "dwwoelfel",
    "points": 2280,
    "story_text": null,
    "comment_text": null,
    "num_comments": 498,
    "story_id": null,
    "story_title": null,
    "story_url": null,
    "parent_id": null,
    "created_at_i": 1506117116,
    "relevancy_score": 7675,
    "_tags": [
      "story",
      "author_dwwoelfel",
      "story_15316175"
    ],
    "objectID": "15316175",
    "_highlightResult": {
      "title": {
        "value": "Relicensing <em>React</em>, Jest, Flow, and Immutable.js",
        "matchLevel": "full",
        "fullyHighlighted": false,
        "matchedWords": [
          "react"
        ]
      },
      "url": {
        "value": "https://code.facebook.com/posts/300798627056246",
        "matchLevel": "none",
        "matchedWords": []
      },
      "author": {
        "value": "dwwoelfel",
        "matchLevel": "none",
        "matchedWords": []
      }
    }
  };
  
  test('renders all properties', () => {
    const component = renderer.create(
      <RowStory key={item.objectID}
        item={item}
        index={1}
        onRemoveItem={() => true} />
    );
    /*
    expect(component.root.findAllByType('a')[0].props.href)
      .toEqual("https://code.facebook.com/posts/300798627056246");

    expect(component.root.findAllByType('span')[2].props.children)
      .toEqual("dwwoelfel");
    */

    expect(component.root.findAllByProps({ href: "https://code.facebook.com/posts/300798627056246" })
      .length).toEqual(1);
    expect(component.root.findAllByProps({ children: "dwwoelfel" }).length).toEqual(1);
  });
});