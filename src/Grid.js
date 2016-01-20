'use strict';

import * as d3 from 'd3';
import { createClass, createReducer } from 'tinier';
import { ADD_CELL, DELETE_CELL } from './actionTypes';
import { empty_cell } from './Cell';

function randomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// TODO use async actions:
// http://rackt.org/redux/docs/advanced/AsyncActions.html
// https://github.com/acdlite/redux-actions
// https://github.com/acdlite/redux-promise
//
//function randomMapData () {
//maps = [
//
//]
//d3.json(maps[randomIntInclusive(0, maps.length - 1)], d => {
//
//}
//}

export const empty_grid = { cells: [], add: {} };

export const Grid = createClass({
  reducer: createReducer(empty_grid, {
    [ADD_CELL]: (state, action) => {
      return {
        ...state,
        cells: [
          ...state.cells,
          {...empty_cell, map_data: action.map_data }
        ]
      };
    }
  }),
  actionCreators: {
    [ADD_CELL]: data => {
      return { type: ADD_CELL, map_data: null };//randomMapData() };
    }
  },
  create: (localState, appState, el) => {
    const sel = d3.select(el)
      // add title
      sel.append('span').text('Escher Grid')
      sel.append('div').attr('id', 'cells')
      sel.append('div').attr('id', 'add-button')
  },
  update: (localState, appState, el) => {
    const sel = d3.select(el)
    const cells_sel = sel.select('#cells')
    return {
      cells: [],
      addButton: sel.select('#add-button').node()
    };
  }
});
