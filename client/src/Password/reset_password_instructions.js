import { render } from 'pug';
import React, { Component } from 'react';
import './forgot_password.css';

class ResetPasswordInstructions extends Component {
    constructor() {
        super();
    }
    render() {
        document.body.style.background = "white";
        return (
            <div className="container" style={{width:530 + 'px'}}>
                <h1 id="forgot-title">Arts and Crafts</h1> 
                <h2 id="forgot-subtitle">Forgot Password</h2> 
                <p className="forgot-instructions">A link to reset your password has been sent to your email.</p> 
            </div>
        );
    }
}

export default ResetPasswordInstructions;