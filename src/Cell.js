'use strict'

import * as d3 from 'd3'
import * as escher from 'escher-vis'
import { createClass, createReducer } from 'tinier'

export const empty_cell = {
  map_data: null
}

export const Cell = createClass({
  reducer: createReducer(empty_cell, {}),
  actionCreators: {},
  create: (localState, appState, el) => {
    const sel = d3.select(el)
    escher.Builder(sel)
  },
  update: (localState, appState, el, actions, key) => {
    const sel = d3.select(el)
    sel.select('.escher-map').datum().load_map(localState.map_data)
  }
})
