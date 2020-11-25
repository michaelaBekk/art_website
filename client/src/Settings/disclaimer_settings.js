import React, { Component } from 'react';
import './settings.css';


class DisclaimerSettings extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="display-settings-container">
              <h1 className="disclaimer-title">Disclaimer</h1>
              <p><strong>Arts and Crafts</strong> uses cookies in order to store certain information regarding a user.</p>
              <p>Cookies do not typically contain any information that personally identifies a user, but personal information that we store about you may be linked to the information stored in and obtained from Cookies. For further information on how we use, store and keep your personal data secure, see our <a href="https://www.privacypolicies.com/live/85740372f6fc2faefca85a2a4f161af6">Privacy Policy.</a></p>
            </div>
        );
    }
}

export default DisclaimerSettings;