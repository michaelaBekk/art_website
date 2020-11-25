import React, { Component } from 'react';
import './verification.css';

class Verification extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="container">  
                <h1 className= "verification-title">Verify your Arts and Crafts account</h1>
                <p className="thank-you-for-signing-up">Thank you for signing up for Arts and Crafts! Next step:</p>
                <p className="verification-instructions"> We sent a link to the email address you provided. Please verify your email in order to finish creating your account.</p>
            </div>
        );
    }
}

export default Verification;