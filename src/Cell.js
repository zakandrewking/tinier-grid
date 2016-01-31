'use strict'

import * as d3 from 'd3'
import * as escher from 'escher-vis'
import { createView, createReducer, createLocalActionCreators, } from 'tinier'

import 'escher-vis/css/dist/builder.css'

// actions
const CLEAR_CELL = '@CLEAR_CELL'
// Global actions are defined just like local actions, but they are not
// addressed.
const CLEAR_MESSAGES = '@CLEAR_MESSAGES'

// view
export const Cell = createView({

  init: function ({ width = 10, height = 10, title = '', map_data = null,
                    message = '', } = {}) {
    return { width, height, title, map_data, message, }
  },

  actionCreators: function (address) {
    return createLocalActionCreators(address, [ CLEAR_CELL, CLEAR_MESSAGES ])
  },

  reducer: createReducer({
    [CLEAR_CELL]: (state, action) => {
      return Object.assign({}, state, {
        map_data: null,
      })
    },
    [CLEAR_MESSAGES]: (state, action) => {
      return Object.assign({}, state, {
        message: '',
      })
    },
  }),

  create: function (localState, _, el) {
    const escher_sel = d3.select(el).append('div').attr('class', 'escher-container')
    escher_sel.node().__builder__ = escher.Builder(null, null, null, escher_sel, {
      menu: 'zoom',
      never_ask_before_quit: true,
      scroll_behavior: 'none', // otherwise: Uncaught TypeError: Cannot read property 'stopPropagation' of null
    })
  },

  update: function (localState, _, el) {
    if (localState.map_data) {
      const escher_sel = d3.select(el).select('.escher-container')
      escher_sel.node().__builder__.load_map(localState.map_data)
    }
  },

})
