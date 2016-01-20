/** A grid of Escher maps powered by tinier.js.

 Zachary King 2016

*/

import { createClass, createReducer, objectOf, arrayOf } from 'tinier'
import { Grid } from './Grid'
import { Cell } from './Cell'
import { AddButton } from './AddButton'

import { applyMiddleware, createStore } from 'redux'
import createLogger from 'redux-logger'
const logger = createLogger()
const createStoreWithMiddleware = applyMiddleware(logger)(createStore)


const app = Grid('main', {
  cells: arrayOf(Cell('cells')),
  add: AddButton('addButton')
})

const api = app.run(document.body,
                    null, // TODO is this right?
                    createStoreWithMiddleware)

api.addTodo({ text: 'new' })
