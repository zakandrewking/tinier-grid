'use strict'

import * as d3 from 'd3'
import * as escher from 'escher-vis'
import { createView, createReducer, createLocalActionCreators,
         createGlobalActionCreators, } from 'tinier'

import 'escher-vis/css/dist/builder.css'

// actions
export const CLEAR_CELL = '@CLEAR_CELL'
// Global actions are defined just like local actions, but they are not
// addressed.
export const CLEAR_MESSAGES = '@CLEAR_MESSAGES'

// view
export const Cell = createView({

  init: function ({ width = 10, height = 10, title = '', map_data = null,
                    message = '', } = {}) {
    return { width, height, title, map_data, message, }
  },

  getActionCreators: function (address) { // TODO this is not a normal address! warn.

    // TODO left off, Address here is ['cells', ':'] but we want ['cells', 1] in
    // the final dispatched action. However, getActionCreators is the same for
    // all instances of the view, so the address needs to get stuck in somewhere
    // else. In middleware? Or in main.js:247, maybe we need to keep a reference
    // to the unevaluated function instead of passing in address.

    const loc = createLocalActionCreators(address, [ CLEAR_CELL ])
    // To run a global action, the best approach is to define a new action
    // creator so that the action will be available in the draw functions.
    const glo = createGlobalActionCreators([ CLEAR_MESSAGES ])
    return Object.assign(loc, glo)
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
      const b = escher_sel.node().__builder__
      b.load_map(localState.map_data)
      b.map.zoom_extent_canvas()
    }
  },

})
