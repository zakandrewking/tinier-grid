'use strict';

import * as d3 from 'd3';
import { createClass, createReducer } from 'tinier';
import { ADD_CELL, DELETE_CELL } from './actionTypes';
import { empty_cell } from './Cell';

export const empty_grid = { cells: {}, add: {} };

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
      return { type: ADD_CELL, text: get(data, 'text', '') };
    }
  },
  create: (localState, appState, el) => {
    const sel = d3.select(el)
    // add title
    sel.append('span').text('Todos')
    sel.append('div').attr('id', 'todos')
    sel.append('div').attr('id', 'add-button')
  },
  update: (localState, appState, el) => {
    const sel = d3.select(el)
    const todos_sel = sel.select('#todos')
    // bind data
    const sels = todos_sel.selectAll('.todo')
            .data(toArray(localState.todos), d => d.id)
    // on enter append divs
    sels.enter().append('div').attr('class', 'todo')
    sels.exit().remove()
    // object of todo containers
    const todo_containers = {}
    sels.each(function(d) { todo_containers[d.id] = this })
    // return containers for children
    return {
      todos: todo_containers,
      addButton: sel.select('#add-button').node()
    };
  }
});
