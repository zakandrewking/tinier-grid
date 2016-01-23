'use strict'

import * as d3 from 'd3'
import { createClass, createReducer } from 'tinier'
import { ADD_CELL } from './actionTypes'

export const emptyAddButton = {}

export const AddButton = createClass({
  create: (localState, appState, el, actions) => {
    d3.select(el)
      .append('button')
      .text('+')
      .on('click', () => actions[ADD_CELL]())
  }
})
