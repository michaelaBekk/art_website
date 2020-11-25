import React, {Component} from 'react';
import {createBrowserHistory} from 'history';

class LoginForm extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showPassword = this.showPassword.bind(this);
        this.hidePassword = this.hidePassword.bind(this);
        this.state = {
            email: '',
            password: ''
        }
        this.state = {
            email_error: '',
            password_error: '',
            incorrect_email_error: '',
            incorrect_password_error: ''
        }
    }

    showPassword() {
        const passwordInput = document.querySelector('.password');
        const showPasswordIcon = document.querySelector('.fa-eye');
        const hidePasswordIcon = document.querySelector('.fa-eye-slash');
        passwordInput.setAttribute('type', 'text');
        showPasswordIcon.style.display = "none";
        hidePasswordIcon.style.display = "block";
    }
    
     hidePassword() {
        const passwordInput = document.querySelector('.password');
        const showPasswordIcon = document.querySelector('.fa-eye');
        const hidePasswordIcon = document.querySelector('.fa-eye-slash');
        passwordInput.setAttribute('type', 'password');
        showPasswordIcon.style.display = "block";
        hidePasswordIcon.style.display = "none";
    }

    async handleSubmit(e) {
        e.preventDefault();

        const history = createBrowserHistory();

        const user = {
            email: this.state.email,
            password: this.state.password
        }
        
        const response = await fetch('/login', {
            method:"POST",
            headers: {
                "Accept": "application/json",
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
        })
        
        const data = await response.json();

        const email = document.querySelector('.email');
        const password = document.querySelector('.password');

        if(data.email) {
            email.classList.add('missing-field');
            this.setState({email_error: data.email.msg})
        }
        if(data.incorrect_email) {
            email.classList.add('missing-field');
            this.setState({incorrect_email_error: data.incorrect_email})
        }
        if(data.password) {
            password.classList.add('missing-field');
            this.setState({password_error: data.password.msg})
        }
        if(data.incorrect_password) {
            password.classList.add('missing-field');
            this.setState({incorrect_password_error: data.incorrect_password})
        }

        if(data.errors == 'No Errors Found') {
            history.push('/');
            window.location.reload();
            localStorage.setItem('Token Expiration', data.token_exp);
            localStorage.setItem('First Name', data.first_name);
            localStorage.setItem('Last Name', data.last_name);
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
        const email = document.querySelector('.email');
        const password = document.querySelector('.password');
        
        if(e.target.name == 'email') {
            this.setState({email_error: ''})
            this.setState({incorrect_email_error: ''})
            email.classList.remove('missing-field');
        }
        if(e.target.name == 'password') {
            this.setState({password_error: ''})
            this.setState({incorrect_epassword_error: ''})
            password.classList.remove('missing-field');
        }
    }

    render() {
    return (
        <form onSubmit={this.handleSubmit} className="form-group" id="loginForm">
            <p className="empty-field">{this.state.email_error}</p>
            <p className="empty-field">{this.state.incorrect_email_error}</p>
            <input type="text" name="email" value={this.state.email} className="form-control email" onChange={this.handleChange} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email Address" />
            <input className="form-control password" type="password" name="password" value={this.state.password} onChange={this.handleChange} id="exampleInputPassword1" placeholder="Password" />
            <i className="fa fa-eye show-password" onClick={this.showPassword}></i>
            <i className="fa fa-eye-slash hide-password" onClick={this.hidePassword}></i>
            <p className="empty-field">{this.state.password_error}</p>
            <p className="empty-field">{this.state.incorrect_password_error}</p>
            <a className="forgot-password" href="/forgot-password" target='_blank'> Forgot Password?</a>
            <button type="submit" className="btn btn-success" id="logInBtn">Log In</button> 
        </form>
        );
    }
}

export default LoginForm