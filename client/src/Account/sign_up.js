import React, {Component} from 'react';
import { createBrowserHistory } from 'history';
import './sign-up_log-in.css';


class SignUpForm extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showPassword = this.showPassword.bind(this);
        this.hidePassword = this.hidePassword.bind(this);
        this.state = {
            first_name_Error: '',
            last_name_Error: '',
            email_Error: '',
            password_Error: ''
        }
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: ''
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

      async handleSubmit(event) { 
        event.preventDefault();
        
        const history = createBrowserHistory();
    
         const user = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
        }
        const response = await fetch('/sign-up', {
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

       if(data.errors == 'No Errors Found') {
            history.push('/verification/' + data.user_ID)
            window.location.reload();
            localStorage.setItem('user_ID', data.user_ID);
        }

      let errors_array = [
            data.first_name,
            data.last_name,
            data.email,
            data.password
        ];

    
        //Front end validation-------------------

        const formInputs = document.querySelectorAll('input');
 
            for(let f=0; f < formInputs.length; f++) {
                if(errors_array[f] !== undefined){
                    formInputs[f].classList.add('missing-field');
                    this.setState({ [formInputs[f].name + '_Error']: [errors_array[f].msg] })
                }else {
                    this.setState({ [formInputs[f].name + '_Error']: ''})
                    formInputs[f].classList.remove('missing-field');
                }
                if(data.emailTaken) {
                    this.setState({ [formInputs[2].name + '_Error']: data.emailTaken })
                }
            } 
            
        }

        handleChange(e) {
            this.setState({ [e.target.name] : e.target.value })
            const formInputs = document.querySelectorAll('input');
            for(let f=0; f < formInputs.length; f++) {
                if(formInputs[f].value !== '') {
                    this.setState({ [formInputs[f].name + '_Error']: ''})
                    formInputs[f].classList.remove('missing-field');
                }
            }
        }
    
    render() {
        return ( 
            <form onSubmit={this.handleSubmit} autoComplete="off" className="form-group" id="signupForm">
                <input type="text" name="first_name" value={this.state.first_name} onChange={this.handleChange} className="form-control first-name" placeholder="First Name" />
                <p className="empty-field">{this.state.first_name_Error}</p>
                <input type="text" name="last_name" value={this.state.last_name} onChange={this.handleChange} className="form-control last-name" placeholder="Last Name" />
                <p className="empty-field">{this.state.last_name_Error}</p>
                <input type="text" name="email" value={this.state.email} onChange={this.handleChange} className="form-control email" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email Address" />
                <p className="empty-field">{this.state.email_Error}</p>
                <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control password" id="exampleInputPassword1" placeholder="Password" />
                <i className="fa fa-eye show-password" onClick={this.showPassword}></i>
                <i className="fa fa-eye-slash hide-password" onClick={this.hidePassword}></i>
                <p className="empty-field">{this.state.password_Error}</p>
                <button type="submit" className="btn btn-success" id="signUpBtn">Sign Up</button>
            </form>
        );

    }

}

export default SignUpForm

