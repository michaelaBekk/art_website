import React, {Component} from 'react';
import './verification.css';
import form_type_store from '../Stores/form_type_store';
import axios from 'axios';


export default class SuccessfulVerification extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        const user_ID = localStorage.getItem('user_ID');
        axios.post('/verified_sucessfully', {
            user_ID
        }).then((response) => {
            console.log(response);
        })
    }

    render() {
        return (
            <div className="container">
                <h1 className="verification-title"> Verify your Arts and Crafts account</h1>
                <p className="thank-you-for-signing-up"> Thank you for signing up for Arts and Crafts!</p>
                <p className="verification-instructions">Your email has been verified succesfully.<a className="log-in-after-verification" href="/" onClick={() => {
                    form_type_store.subscribe(() => console.log(form_type_store.setState({signup: false})));
                }}>Log In</a></p>
            </div>
        ); 
    }
}

