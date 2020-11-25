import React from 'react';


const verifyToken =  store => next => action => {
    const token_exp = localStorage.getItem('Token Expiration');
    if(token_exp < Date.now() / 1000) {
        localStorage.removeItem('Token Expiration');
        localStorage.removeItem('First Name');
        localStorage.removeItem('Last Name');
    }else {
        next(action);
    }
    
}

export default verifyToken;