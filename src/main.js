/** A grid of Escher maps powered by tinier.js.

 NOTES

 Keep this bug in mind right now for linked dependencies:
 https://github.com/webpack/webpack/issues/1866

 Solution is to install the babel dependencies in the linked package also.

 Zachary King 2016

*/

import { createClass, createReducer, objectOf, arrayOf } from 'tinier'
import { Grid } from './Grid'
import { Cell } from './Cell'
import { AddButton } from './AddButton'

import { applyMiddleware, createStore } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
const logger = createLogger()
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore)

const app = Grid('main', {
  cells: arrayOf(Cell('cells')),
  add: AddButton('addButton'),
  isLoading: false,
  message: ''
})

const api = app.run(document.body, null, createStoreWithMiddleware)
