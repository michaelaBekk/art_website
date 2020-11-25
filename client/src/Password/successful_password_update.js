import React, { Component } from 'react';
import form_type_store from '../Stores/form_type_store';
import './reset_password.css';

class SuccessfulPasswordUpdate extends Component {
    constructor() {
        super();
    }
    render(){
        document.body.style.background = "#adebad";
        return (
            <div className="container" style={{width:450 + 'px', marginTop:100 + 'px'}}>
                <p className="updated-password">Password has been reset successfully.</p>
                <a href="/" className="redirect-to-main-page" onClick={() => {
                    form_type_store.subscribe(() => console.log(form_type_store.setState({signup: false})));
                }}>Return to log in</a>
            </div>
        );
    }
}

export default  SuccessfulPasswordUpdate;