'use strict'

import * as d3 from 'd3'
import { createView } from 'tinier'

export const Button = createView({

  init: function (text = '', clickActionAddress = null) {
    return { text, clickActionAddress }
  },

  create: function (localState, appState, el) {
    d3.select(el).append('button')
  },

  update: function (localState, appState, el, actions, actionWithAddress) {
    d3.select(el)
      .select('button')
      .text(localState.text)
      .on('click', actionWithAddress(localState.clickActionAddress) || null)
  },

})
