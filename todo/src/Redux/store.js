import { createStore,applyMiddleware} from 'redux'

// import loginReducer from './ReduxThunk/reducer';
import { composeWithDevTools } from 'redux-devtools-extension'
import {createLogger} from 'redux-logger'

import reduxThunk from 'redux-thunk'
import loginReducer from './reducer';

const store = createStore(loginReducer,
    composeWithDevTools(applyMiddleware(reduxThunk,createLogger())))

export default store