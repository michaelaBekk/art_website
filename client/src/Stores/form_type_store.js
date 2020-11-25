import React from 'react';
import {createStore} from 'redux';
import formDisplay from '../Reducers/form_reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

//STORE
let form_type_store = createStore(formDisplay, composeWithDevTools());

//DISPATCH
form_type_store.dispatch({
    type: "default",
    type: "LOG_IN_LINK"
});

export default form_type_store;