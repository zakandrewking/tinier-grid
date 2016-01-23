'use strict'

import * as d3 from 'd3'
import * as escher from 'escher-vis'
import { createClass, createReducer } from 'tinier'

import 'escher-vis/css/dist/builder.css'

export const empty_cell = {
  map_data: null
}

export const Cell = createClass({
  reducer: createReducer(empty_cell, {}),
  actionCreators: {},
  create: (localState, appState, el) => {
    const escher_sel = d3.select(el).append('div').attr('class', 'escher-container')
    escher_sel.node().__builder__ = escher.Builder(null, null, null, escher_sel, {
      menu: 'zoom',
      never_ask_before_quit: true,
      scroll_behavior: 'none', // otherwise: Uncaught TypeError: Cannot read property 'stopPropagation' of null
    })
  },
  update: (localState, appState, el, actions, key) => {
    const escher_sel = d3.select(el).select('.escher-container')
    escher_sel.node().__builder__.load_map(localState.map_data)
  }
})
