import {legacy_createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'

const enhancer = applyMiddleware(thunk)

const store = legacy_createStore(reducer, enhancer)

export default store