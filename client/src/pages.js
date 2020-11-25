import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import checkLoggedIn from './Reducers/login_reducer';
import Account from './Account/account';
import Verification from './Account/verification';
import NotFound from './Errors/not_found';
import SuccessfulVerification from './Account/successful_verification';
import ExpiredToken from './Errors/expired_token';
import MainPage from './Home/main_page';
import PersonalizedKit from './Personalized_Kit/personalized_kit';
import SuccessfulPayment from './Payment/successful_payment';
import Payment from './Payment/payment';
import verifyToken from './Middleware/login_middleware';
import ForgotPassword from './Password/forgot_password';
import form_type_store from './Stores/form_type_store';
import {Provider} from 'react-redux';
import ResetPassword from './Password/reset_password';
import ResetPasswordInstructions from './Password/reset_password_instructions';
import SuccessfulPasswordUpdate from './Password/successful_password_update';
import Cart from './Cart/cart';
import Settings from './Settings/settings';
import InternalServerError from './Errors/500_error';
import GeneralError from './Errors/general_error';

const mapStateToProps = (state) => {
    return {
        loggedIn: state.loggedIn,
        title: state.title,
        reload: state.reload
    }
}

const mapDispatchToProps = () => {
    return {
        checkLoggedIn,
        verifyToken
    }
}


class RenderPage extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        const title = document.querySelector('title');
        title.innerHTML = "Arts and Crafts | " + this.props.title
    }

    render() {
        const user_ID = localStorage.getItem('user_ID');
        const category = localStorage.getItem('Category');
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact strict path="/" render={() => {
                            if(this.props.loggedIn == false) {
                                return <Provider store={form_type_store}><Account /></Provider>
                            }else{
                                this.props.title.push('Home');
                                return <MainPage/>
                            }
                        }} />
                        <Route exact strict path="/forgot-password" render={() => {
                            this.props.title.pop('Account');
                            this.props.title.push('Forgot Password');
                            return <ForgotPassword />
                        }} />
                        <Route exact strict path={"/reset-password/" + user_ID} render={() => {
                            this.props.title.pop('Account');
                            this.props.title.push('Reset Password');
                            return <ResetPasswordInstructions />
                        }} />
                        <Route exact strict path={"/reset-password/new-password/" + user_ID} render={() => {
                            this.props.title.pop('Account');
                            this.props.title.push('Reset Password');
                            return <ResetPassword />
                        }} />
                        <Route exact strict path={'/reset-password/new-password/successfully-reset/' + user_ID} render={() => {
                            this.props.title.pop('Account');
                            this.props.title.push('Reset Password');
                            return <SuccessfulPasswordUpdate />
                        }} />
                        <Route exact strict path="/personalized-kit" render={() => {
                            if(this.props.loggedIn == false) {
                                return  <Redirect exact to="/" />
                            }else {
                                this.props.title.push('Personalized Kit');
                                return <PersonalizedKit />
                            }
                        }} />
                        <Route exact strict path="/settings" render={() => {
                            if(this.props.loggedIn == false) {
                                return  <Redirect exact to="/" />
                            }else {
                                this.props.title.push('Settings');
                                return <Settings />
                            }
                        }} />
                        <Route exact strict path="/cart" render={() => {
                            if(this.props.loggedIn == false) {
                                return  <Redirect exact to="/" />
                            }else {
                                this.props.title.push('Cart');
                                return <Cart />
                            }
                        }} />
                        <Route exact strict path="/personalized-kit/subscription-payment" render={() => {
                            if(category == null) {
                                return  <Redirect exact to="/cart" />
                            }
                            if(this.props.loggedIn == false) {
                                return  <Redirect exact to="/" />
                            }else {
                                this.props.title.push('Payment');
                                return <Payment />
                            }
                        }} />
                        <Route exact strict path="/successful_subscription-payment" render={() => {
                            if(this.props.loggedIn == false) {
                                return  <Redirect exact to="/" />
                            }else {
                                this.props.title.push('Successful Payment');
                                return <SuccessfulPayment />
                            }
                        }} />
                        <Route exact strict path={"/verification/" + user_ID} render={() => {
                            this.props.title.pop('Account');
                            this.props.title.push('Verification');
                            return <Verification />
                        }} />
                        <Route exact strict path={"/verified_successfully/" + user_ID} render={() => {
                            this.props.title.pop('Account');
                            this.props.title.push('Verification');
                            return <SuccessfulVerification />
                        }} />
                        <Route exact string path="/error403/invalid_link" render={() => {
                             this.props.title.pop('Account');
                            this.props.title.push('Error 403');
                            return <ExpiredToken />
                        }} />
                        <Route exact strict path="/error500/internal_server_error"  render={() => {
                             this.props.title.pop('Account');
                            this.props.title.push('Error 500');
                            return <InternalServerError />
                        }} />
                        <Route path="/error"  render={() => {
                            this.props.title.pop('Account');
                            this.props.title.push('Error');
                            return <GeneralError />
                        }} />
                        <Route path="*"  render={() => {
                            this.props.title.pop('Account');
                            this.props.title.push('Error 404');
                            return <NotFound />
                        }} />
                    </Switch>
                </div>
            </Router>
        );
    }
    
}

export default connect(mapStateToProps, mapDispatchToProps)(RenderPage);
