'use strict'

import * as d3 from 'd3'
import * as d3_promise from 'd3.promise'
import { createClass, createReducer, basicActionCreators } from 'tinier'
import { ADD_CELL, ADD_CELL_BEGIN, ADD_CELL_SUCCESS, ADD_CELL_FAILURE, DELETE_CELL } from './actionTypes'
import { empty_cell } from './Cell'

function randomIntInclusive (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const url = 'https://escher.github.io/1-0-0/5/maps/Escherichia coli/'
const maps = [
  'iJO1366.Fatty acid beta-oxidation.json',
  'fake.json',
  'iJO1366.Nucleotide and histidine biosynthesis.json',
  'iJO1366.Central metabolism.json',
  'iJO1366.Fatty acid biosynthesis (saturated).json',
  'iJO1366.Nucleotide metabolism.json',
]
function randomMapURL () {
  const map_name = maps[randomIntInclusive(0, maps.length - 1)]
  const map_url = url + map_name
  return { map_url, map_name }
}

export const empty_grid = { cells: [], add: {} }

export const Grid = createClass({
  reducer: createReducer(empty_grid, {
    [ADD_CELL_BEGIN]: (state, action) => {
      return Object.assign({}, state, {
        isLoading: true,
        message: 'Loading ' + action.payload.map_name
      })
    },
    [ADD_CELL_SUCCESS]: (state, action) => {
      return Object.assign({}, state, {
        cells: [
            ...state.cells,
          Object.assign({}, empty_cell, { map_data: action.payload.map_data }),
        ],
        isLoading: false,
        message: 'Loaded ' + action.payload.map_name,
      })
    },
    [ADD_CELL_FAILURE]: (state, action) => {
      return Object.assign({}, state, {
        isLoading: false,
        message: 'Could not load "' + action.payload.map_name + '"',
      })
    }
  }),
  actionCreators: Object.assign({}, {
    // async actions
    [ADD_CELL]: () => { // TODO this seems like a hack
      // use thunk
      return actions => {
        const { map_url, map_name } = randomMapURL()
        actions[ADD_CELL_BEGIN]({ map_name })
        return d3_promise.json(map_url).then(
          map_data => actions[ADD_CELL_SUCCESS]({ map_data, map_name }),
          error => actions[ADD_CELL_FAILURE]({ error, map_name })
        )
      }
    },
  }, basicActionCreators([ // sync actions
    ADD_CELL_BEGIN,
    ADD_CELL_SUCCESS,
    ADD_CELL_FAILURE
  ])),
  create: (localState, appState, el) => {
    const sel = d3.select(el)
    // add title
    sel.append('span').append('h1').text('Escher Grid')
    sel.append('div').attr('id', 'cells')
    sel.append('div').attr('id', 'add-button')
    sel.append('div').attr('id', 'status')
  },
  update: (localState, appState, el) => {
    const sel = d3.select(el)

    // cells
    const cells_sel = sel.select('#cells')
            .selectAll('.cell')
            .data(localState.cells)
    cells_sel.enter()
      .append('div')
      .attr('class', 'cell')
    cells_sel.exit().remove()
    const cells_nodes = []
    cells_sel.each(function () {
      cells_nodes.push(this)
    })

    // message
    sel.select('#status').text(localState.message)
    return {
      cells: cells_nodes,
      addButton: sel.select('#add-button').node()
    }
  }
})
