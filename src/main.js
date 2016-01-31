/** A grid of Escher maps powered by tinier.js.

 Zachary King 2016

*/

import { createMiddleware, run } from 'tinier'
import { Grid } from './Grid'

import { applyMiddleware, createStore } from 'redux'
import createLogger from 'redux-logger'

const createStoreWithMiddleware = applyMiddleware(
  createMiddleware(Grid),
  createLogger()
)(createStore)

const api = run(Grid, document.body, Grid.init(2), createStoreWithMiddleware)

api.addCell()
