import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import checkLoggedIn from '../Reducers/login_reducer';
import verifyToken from '../Middleware/login_middleware';
import { composeWithDevTools } from 'redux-devtools-extension';


//STORE
let log_in_store = createStore(checkLoggedIn, composeWithDevTools(
    applyMiddleware(verifyToken)
));

//DISPATCH
log_in_store.dispatch({
    type: "default",
    type: "LOGGED_IN"
});



export default log_in_store;