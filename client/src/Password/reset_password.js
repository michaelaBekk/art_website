import React, { Component } from 'react';
import './reset_password.css';
import {createBrowserHistory} from 'history';


class ResetPassword extends Component {
    constructor() {
        super();
        this.showHidePassword = this.showPassword.bind(this);
        this.hidePassword = this.hidePassword.bind(this);
        this.showConfirmPassword = this.showConfirmPassword.bind(this);
        this.hideConfirmPassword = this.hideConfirmPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            password: '',
            confirmed_password: '',
            password_errors: '',
            confirmed_password_errors: '',
            passwords_match: ''
        }
    }

    //Show/Hide Passwords -------------------
    showPassword() {
        const passwordInput = document.querySelector('.change-password');
        const showPasswordIcon = document.querySelector('.fa-eye');
        const hidePasswordIcon = document.querySelector('.fa-eye-slash');
        passwordInput.setAttribute('type', 'text');
        showPasswordIcon.style.display = "none";
        hidePasswordIcon.style.display = "block";
    }
    hidePassword() {
        const passwordInput = document.querySelector('.change-password');
        const showPasswordIcon = document.querySelector('.fa-eye');
        const hidePasswordIcon = document.querySelector('.fa-eye-slash');
        passwordInput.setAttribute('type', 'password');
        showPasswordIcon.style.display = "block";
        hidePasswordIcon.style.display = "none";
    }
    showConfirmPassword() {
        const confirmPasswordInput = document.querySelector('.change-password-confirm');
        const showPasswordIcon = document.querySelector('.fa-eye-confirm');
        const hidePasswordIcon = document.querySelector('.fa-eye-slash-confirm');
        confirmPasswordInput.setAttribute('type', 'text');
        showPasswordIcon.style.display = "none";
        hidePasswordIcon.style.display = "block";
    }
    hideConfirmPassword() {
        const confirmPasswordInput = document.querySelector('.change-password-confirm');
        const showPasswordIcon = document.querySelector('.fa-eye-confirm');
        const hidePasswordIcon = document.querySelector('.fa-eye-slash-confirm');
        confirmPasswordInput.setAttribute('type', 'password');
        showPasswordIcon.style.display = "block";
        hidePasswordIcon.style.display = "none";
    }

    // Handle Submit -------------------------

    async handleSubmit(e) {
        e.preventDefault();

        const history = createBrowserHistory();

        const new_password = {
            password: this.state.password,
            confirmed_password: this.state.confirmed_password
        }

        const user_ID = localStorage.getItem('user_ID');

        const response = await fetch('/reset-password/new-password/' + user_ID, {
            method:"POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(new_password)
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

            const password = document.querySelector('.change-password');
            const confirmed_password = document.querySelector('.change-password-confirm');

            if(data.password) {
                password.classList.add('missing-field');
                this.setState({password_errors: data.password.msg});
            }
            if(data.confirmed_password) {
                confirmed_password.classList.add('missing-field');
                this.setState({confirmed_password_errors: data.confirmed_password.msg})
            }
            if(data.no_match) {
                password.classList.add('missing-field');
                confirmed_password.classList.add('missing-field');
                this.setState({passwords_match: data.no_match})
            }
            if(data.message == 'Password Updated') {
                history.push('/reset-password/new-password/successfully-reset/' + user_ID);
                window.location.reload();
            }
        }

    handleChange(e) {
        const password = document.querySelector('.change-password');
        const confirmed_password = document.querySelector('.change-password-confirm');
        this.setState({[e.target.name]: e.target.value});
        if(e.target.name == 'password') {
            this.setState({password_errors: ''});
            this.setState({passwords_match: ''});
            password.classList.remove('missing-field');
            confirmed_password.classList.remove('missing-field');

        }
        if(e.target.name == 'confirmed_password') {
            this.setState({confirmed_password_errors: ''});
            this.setState({passwords_match: ''});
            password.classList.remove('missing-field');
            confirmed_password.classList.remove('missing-field');
        }
        
    }

    render() {
        document.body.style.background = "#adebad";
        return (
            <div className="container mx-auto" id="changePasswordContainer" style={{width:420 + 'px', marginTop:100 + 'px'}}>
                <h1 className="change-password-title">Change Password</h1>
                <h5 className="change-password-subtitle"> Type in a new password:</h5>
                    <form onSubmit={this.handleSubmit} autoComplete="off" className="form-group" id="resetForm"> 
                        <i className="fa fa-eye" onClick={this.showPassword}></i>
                        <i className="fa fa-eye-slash" id="hidePassword" onClick={this.hidePassword}></i>
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control change-password" id="exampleInputPassword1" placeholder="New Password" />
                        <p className="empty-field">{this.state.password_errors}</p>
                        <i className="fa fa-eye fa-eye-confirm" onClick={this.showConfirmPassword}></i>
                        <i className="fa fa-eye-slash fa-eye-slash-confirm" id="hidePassword" onClick={this.hideConfirmPassword}></i>
                        <input type="password" name="confirmed_password" value={this.state.confirmed_password} onChange={this.handleChange} className="form-control change-password-confirm" id="exampleInputPassword1" placeholder="Confirm New Password" />
                        <p className="empty-field">{this.state.confirmed_password_errors}</p>
                        <p className="empty-field">{this.state.passwords_match}</p>
                        <button type="submit" className="btn btn-success" id="resetBtn">Reset</button>
                    </form>
            </div>
        );
    }
}

export default ResetPassword;