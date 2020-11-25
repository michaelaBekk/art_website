import React from 'react';


//REDUCER
let initialState = {
    loggedIn: false,
    title: ['Account']
}

function checkLoggedIn(state = initialState, action) {
    switch(action.type) {
        case 'LOGGED_IN':
            return {
                loggedIn: true,
                title: []
            }
        break;
        default:
            return state;
    }
}

export default checkLoggedIn;