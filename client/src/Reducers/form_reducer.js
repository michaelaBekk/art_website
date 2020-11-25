import React from 'react';

//REDUCER
const intiialState = {
    signup: true
}
function formDisplay(state = intiialState, action) {
    switch(action.type) {
        case "LOG_IN_LINK": 
            return {
                state: {
                    signup: false
                }
            }
        break;
        default: 
            return state;
        
    }
}

export default formDisplay;