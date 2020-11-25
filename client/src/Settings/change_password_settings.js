import React, {Component} from 'react';
import axios from 'axios';
import {createBrowserHistory} from 'history';


export default class ChangePasswordSettings extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.cancelChangePassword = this.cancelChangePassword.bind(this);
        this.state = {
            password: '',
            password_error: '',
            password_updated: false
        }
    }

    // Cancel change password -------
    cancelChangePassword() {
        this.setState({change_password_clicked: false});
        this.props.change_password_clicked(this.state.change_password_clicked);
    }

    // Submit new password --------
    handleSubmit(e) {
        e.preventDefault();
        const history = createBrowserHistory();
        const user_ID = localStorage.getItem('user_ID');
        const input = document.querySelector('input');

        axios.post('/account-settings-password-change', {
            user_ID,
            password:this.state.password
        }).then((response) => {
            if(response.data.password) {
                input.classList.add('missing-field');
                this.setState({password_error: response.data.password.msg})
            }else {
                this.setState({password_updated: true});
                this.props.password_updated(this.state.password_updated);
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

    handleChange(e) {
        this.setState({ password: e.target.value });
        e.target.classList.remove('missing-field');
        this.setState({password_error: ''});
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="d-flex flex-row new-password-container">
                        <label className="new-password-label" htmlFor="password">New Password</label>
                        <input className="edit-password-input" onChange={this.handleChange} type="password" name="password" value={this.state.password} />
                    </div>
                    <p className="empty-field" style={{marginLeft: 180 + 'px'}}>{this.state.password_error}</p>
                    <div className="change-password-buttons-container d-flex flex-row">
                        <button type="submit" className="save-new-password">Save</button>
                        <button className="cancel-password-change-button" onClick={this.cancelChangePassword} type="button">Cancel</button>
                    </div>
                </form>
           </div>
        );
    }
}