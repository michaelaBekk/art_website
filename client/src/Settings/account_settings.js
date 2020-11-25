import React, { Component } from 'react';
import {createBrowserHistory} from 'history';
import axios from 'axios';
import './account_settings.css';
import ChangePasswordSettings from './change_password_settings';


export default class AccountSettings extends Component {
    constructor(props) {
        super(props);
        this.editAccountInfo = this.editAccountInfo.bind(this);
        this.cancelUpdate =  this.cancelUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit =  this.handleSubmit.bind(this);
        this.updatePassword =  this.updatePassword.bind(this);
        this.cancelPasswordChange = this.cancelPasswordChange.bind(this);
        const first_name = localStorage.getItem('First Name');
        const last_name = localStorage.getItem('Last Name');
        this.state = {
            change_password_clicked: false,
            password_updated: false,
            first_name,
            last_name,
            initial_email: '',
            email: '',
            error_first_name: '',
            error_last_name: '',
            error_email: ''
        }
    }

    //Edit Account Info ------------
    editAccountInfo(e) {
        const accountInfoValue = document.querySelectorAll('.account-info-value');
        const changeInput = document.querySelectorAll('.edit-input');
        const saveChangesButton = document.querySelector('.save-changes-button');
        const editButton = document.querySelector('.edit-button');
        const cancelButton = document.querySelector('.cancel-button');
        const changePasswordButton = document.querySelector('.change-password-button');
        
        changePasswordButton.style.display = "block";

        accountInfoValue.forEach(value => {
            value.style.display = "none";
        });
        changeInput.forEach(input => {
            input.style.display = "block";
            saveChangesButton.style.display = "block";
            cancelButton.style.display = "block";
            editButton.style.display = "none";
        });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        e.target.classList.remove('missing-field');
        this.setState({['error_' + e.target.name]: ''});
    }

    //Save Changes ----------------------------
    async handleSubmit(e) {
        const history = createBrowserHistory();
        const changeInput = document.querySelectorAll('.edit-input');
        const accountInfoValue = document.querySelectorAll('.account-info-value');
        const saveChangesButton = document.querySelector('.save-changes-button');
        const editButton = document.querySelector('.edit-button');
        const cancelButton = document.querySelector('.cancel-button');
        const changePasswordButton = document.querySelector('.change-password-button');
        

        const user_ID = localStorage.getItem('user_ID');
        await axios.post('/account-settings', {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            user_ID
        }).then((response) => {
       
            const errors = [
                response.data.first_name,
                response.data.last_name,
                response.data.email
            ];

            for(let e=0; e < errors.length; e++) {
                if(errors[e]) {
                    changeInput[e].classList.add('missing-field');
                    this.setState({['error_' + changeInput[e].name]: [errors[e].msg]});
                }
                
                if(response.data == 'No errors') {
                    changeInput[e].classList.remove('missing-field');
                    this.setState({['error_' + changeInput[e].name]: ''});
                    localStorage.setItem('First Name', this.state.first_name);
                    localStorage.setItem('Last Name', this.state.last_name);
                   
                    accountInfoValue.forEach(value => {
                        value.style.display = "";
                    });
                    changeInput.forEach(input => {
                        input.style.display = "";
                        saveChangesButton.style.display = "";
                        cancelButton.style.display = "";
                        editButton.style.display = "";
                        changePasswordButton.style.display = "";
                    });
                }
            }
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
    }

    // Password has been changed 
    updatePassword(value) {
        this.setState({
            password_updated: value,
            change_password_clicked: false
        });
    }

    //Cancel Password Change
    cancelPasswordChange(value) {
        this.setState({change_password_clicked: value});
    }

    //Cancel Updating Info ----------------
    cancelUpdate() {
        const accountInfoValue = document.querySelectorAll('.account-info-value');
        const changeInput = document.querySelectorAll('.edit-input');
        const saveChangesButton = document.querySelector('.save-changes-button');
        const editButton = document.querySelector('.edit-button');
        const cancelButton = document.querySelector('.cancel-button');
        const first_name = localStorage.getItem('First Name');
        const last_name = localStorage.getItem('Last Name');
        const changePasswordButton = document.querySelector('.change-password-button');
        
        changePasswordButton.style.display = "";

        accountInfoValue.forEach(value => {
            value.style.display = "";
            this.setState({
                first_name,
                last_name,
                email: this.state.initial_email
            })
        });
        changeInput.forEach(input => {
            input.style.display = "";
            saveChangesButton.style.display = "";
            cancelButton.style.display = "";
            editButton.style.display = "";
        });
    }
    
    // Get Email ------------------------
    async componentDidMount()  { 
        const history = createBrowserHistory();
        const user_ID = localStorage.getItem('user_ID');
        await axios.post('/account-settings/retrieve-email', {
            user_ID
        }).then((response) => {
            this.setState({
                initial_email: response.data.email,
                email: response.data.email,
                initial_password: response.data.password
            })
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
    }

        render() {
        return (
            <div className="display-settings-container">
                <h1 className="settings-title">Account</h1>
                {this.state.password_updated ? (
                    <div>
                        <p className="successful-password-change">Your password has been updated!</p>
                    </div>
                ): null}
                {this.state.change_password_clicked ? <ChangePasswordSettings 
                    password_updated={this.updatePassword} 
                    change_password_clicked={this.cancelPasswordChange}
                /> : (
                    <div className="account-info-container d-flex flex-column">
                    <form>
                        <div className="first-name d-flex flex-row account-info">
                            <p className="account-info-label">First Name: </p>
                            <p className="account-info-value" id="firstNameValue"> {this.state.first_name}</p>
                            <input className="edit-input" onKeyPress={this.handleKeyPress} type="text" name="first_name" value={this.state.first_name} onChange={this.handleChange} />
                        </div >
                          <p className="empty-field" style={{marginLeft: 300 + 'px'}}>{this.state.error_first_name}</p>
                        <div className="last-name d-flex flex-row account-info">
                            <p className="account-info-label">Last Name:</p>
                            <p className="account-info-value" id="lastNameValue">{this.state.last_name}</p>
                            <input className="edit-input"  onKeyPress={this.handleKeyPress} type="text" name="last_name" value={this.state.last_name} onChange={this.handleChange} />
                        </div>
                        <p className="empty-field" style={{marginLeft: 300 + 'px'}}>{this.state.error_last_name}</p>
                        <div className="email-info d-flex flex-row account-info">
                            <p className="account-info-label">Email Address: </p>
                            <p className="account-info-value email-value" id="emailValue">{this.state.email}</p>
                            <input className="edit-input email-edit-input" onKeyPress={this.handleKeyPress} type="email" name="email" value={this.state.email} onChange={this.handleChange} />
                        </div>
                        <p className="empty-field" style={{marginLeft: 300 + 'px'}}>{this.state.error_email}</p>
                        <div className="password-info d-flex flex-row account-info">
                            <p className="account-info-label">Password: </p>
                            <p style={{fontSize: 25 + 'px'}} id="passwordValue">*********</p>
                        </div>
                            <button className="edit-button" type="button" onClick={this.editAccountInfo}>Edit</button>
                            <div className="d-flex fex-row">
                                <button className="save-changes-button" onClick={this.handleSubmit} type="button">Save Changes</button>
                                <button type="button" onClick={() => {
                                    
                                }} className="change-password-button" onClick={() => {
                                    this.setState({change_password_clicked: true})
                                }}>Change Password</button>
                                <button className="cancel-button" onClick={this.cancelUpdate} type="button">Cancel</button>
                            </div>
                    </form>
                </div>
                )}
                
            </div>
        );
    }
}

