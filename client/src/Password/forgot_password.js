import React, { Component } from 'react';
import './forgot_password.css';
import {createBrowserHistory} from 'history';

class ForgotPassword extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            email: '',
            empty_email_error: '',
            invalid_email_error: ''
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const history = createBrowserHistory();

        const user = {
            email: this.state.email
        }

        const response = await fetch('/forgot-password', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }).catch((err) => {
            if(err.response.status == 404) {
                history.push('/error404/not_found');
                window.location.reload();
            }else if(err.response.status == 500) {
                history.push('/error500/internal_server_error');
                window.location.reload();
            }else {
                history.push('/error');
                window.location.reload();
            }
        });
        
        const data = await response.json();

        const email = document.querySelector('input');

        if(data.email) {
            email.classList.add('missing-field');
            this.setState({empty_email_error: data.email.msg});
        }else if(data.invalid_email) {
            email.classList.add('missing-field');
            this.setState({invalid_email_error: data.invalid_email});
        }else if(data.errors == "No Errors Found") {
            const user_ID = localStorage.getItem('user_ID');
            history.push('/reset-password/' + user_ID)
            window.location.reload();
        }else {
            return;
        }
    }

    handleChange(e) {
        this.setState({email: e.target.value});
        const email = document.querySelector('input');
        email.classList.remove('missing-field');
        this.setState({empty_email_error: ''});
        this.setState({invalid_email_error: ''});
    }

    render() {
        document.body.style.background = "white";
        return (
            <div className="container" id="forgotPasswordContainer" style={{width:600 + 'px'}}>
                <h1 id="forgot-title">Arts and Crafts</h1>
                <h2 id="forgot-subtitle">Reset Password</h2>
                <p className="forgot-instructions">Please type in the email address you used to create your Arts and Crafts account.</p>
                <p className="empty-field">{this.state.empty_email_error}</p>
                <p className="empty-field">{this.state.invalid_email_error}</p>
                <form className="form-group" onSubmit={this.handleSubmit}>
                    <input type="text" name="email" className="email-to-retrieve-password-input" value={this.state.email} onChange={this.handleChange} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email Address" />
                    <br />
                    <button type="submit" className="btn btn-dark" id="submitBtn">Submit</button>
                </form>
            </div>
        );
    }
}


export default ForgotPassword