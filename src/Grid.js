'use strict'

import * as d3 from 'd3'
import { createView, createReducer,
         createAsyncActionCreators, createActionCreators,
         objectOf, arrayOf, addressAction,
         addressRelTo, addressRelFrom, } from 'tinier'
import { Cell, CLEAR_CELL, CLEAR_MESSAGES, } from './Cell'
import { Button, CLICK as BUTTON_CLICK, } from './Button'
import { times } from 'lodash'

import './grid.css'

// ---------
// constants
// ---------

// actions
const ADD_CELL = '@ADD_CELL'
const DELETE_CELL = '@DELETE_CELL'
const DELETE_LAST_CELL = '@DELETE_LAST_CELL'
const ADD_CELL_BEGIN = '@ADD_CELL_BEGIN'
const ADD_CELL_SUCCESS = '@ADD_CELL_SUCCESS'
const ADD_CELL_FAILURE = '@ADD_CELL_FAILURE'

// --------
// map URLs
// --------

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
function getJSON (url) {
  return new Promise(function (fulfill, reject) {
    d3.json(url, (e, d) => {
      if (e) reject (e)
      else fulfill(d)
    })
  })
}

// ------------
// tinier view
// ------------

export const Grid = createView({

  model: {
    cells: arrayOf(Cell),
    buttons: [ Button, Button, Button ],
  },

  init: function (initCellCount = 0) {
    // cell state
    const cells = times(initCellCount, i => {
      return Cell.init({ title: String(i + 1), width: 50, height: 50, })
    })
    // buttons state
    const addButton = Button.init(
      '+',
      addressAction(ADD_CELL, addressRelFrom([ 'buttons', 0 ]))
    )
    const deleteButton = Button.init(
      '-',
      addressAction(DELETE_LAST_CELL, addressRelFrom([ 'buttons', 1 ]))
    )
    const clear2Button = Button.init(
      'Clear second cell',
      addressAction(
        CLEAR_CELL,
        addressRelTo(['cells', 1 ], addressRelFrom([ 'buttons', 2 ]))
        // TODO addressRelTo and addressRelFrom should be commutative
      )
    )

    // model
    return {
      cells,
      buttons: [ addButton, deleteButton, clear2Button ],
      isLoading: false,
      message: '',
    }
  },

  getReducer: function (model) {
    return createReducer({
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
            model.cells.view.init({ map_data: action.payload.map_data }),
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
      },
      [DELETE_LAST_CELL]: (state, action) => {
        return Object.assign({}, state, {
          cells: state.cells.slice(0, -1)
        })
      }
    })
  },

  actionCreators: Object.assign(
    createAsyncActionCreators({
      [ADD_CELL]: () => {
        // Action creators that use the tinier middleware can return a promise
        // but not an action. Instead, they call other actions.
        return actions => {
          const { map_url, map_name } = randomMapURL()
          actions[ADD_CELL_BEGIN]({ map_name })
          return getJSON(map_url).then(
            // The only actions available are those defined in this view. These
            // actions already have the address built in.
            map_data => actions[ADD_CELL_SUCCESS]({ map_data, map_name }),
            error => actions[ADD_CELL_FAILURE]({ error, map_name })
          )
        }
      },
    }),
    createActionCreators([
      ADD_CELL_BEGIN, ADD_CELL_SUCCESS, ADD_CELL_FAILURE, DELETE_CELL, DELETE_LAST_CELL
    ])
  ),

  create: function (localState, appState, el, actions) {
    const sel = d3.select(el)
    // fill screen
    sel.attr('id', 'grid-container')
    sel.append('div').attr('id', 'grid-cells')
    // add title
    const nav = sel.append('div').attr('class', 'grid-nav')
    nav.append('div')
      .attr('id', 'title')
      .append('h1')
      .text('Escher Grid')
    nav.append('div').attr('id', 'add-button')
    nav.append('div').attr('id', 'delete-button')
    nav.append('div').attr('id', 'clear2-button')
    nav.append('div').attr('id', 'grid-status')
  },

  update: function (localState, appState, el, actions) {
    const sel = d3.select(el)

    // cell size
    const percent = 1.0 / Math.ceil(Math.sqrt(localState.cells.length)) * 100

    // cells
    const cells_sel = sel.select('#grid-cells')
            .selectAll('.grid-cell')
            .data(localState.cells)
    cells_sel.enter()
      .append('div')
      .attr('class', 'grid-cell')
    cells_sel
      .style('width', percent + '%')
      .style('height', percent + '%')
    cells_sel.exit()
      .remove()
    const cells_nodes = []
    cells_sel.each(function () {
      cells_nodes.push(this)
    })

    // message
    sel.select('#grid-status').text(localState.message)
    return {
      cells: cells_nodes,
      buttons: [
        sel.select('#add-button').node(),
        sel.select('#delete-button').node(),
        sel.select('#clear2-button').node(),
      ],
    }
  },

  getAPI: function (actions, actionWithAddress) {
    return {
      addCell: actions[ADD_CELL]
    }
  },

})
