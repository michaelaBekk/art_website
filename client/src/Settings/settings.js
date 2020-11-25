import React, { Component } from 'react';
import Header from '../Navigation/header';
import Footer from '../Navigation/footer';
import './settings.css';
import axios from 'axios';
import {createBrowserHistory} from 'history';
import AccountSettings from './account_settings';
import DisclaimerSettings from './disclaimer_settings';
import SubscriptionsSettings from './subscriptions_settings';
import BillingHistory from './billing_history';
import PaymentInfo from './payment_info';
import ShippingDetails from './shipping_details';


class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_exists: false,
            account_clicked: false,
            subscriptions_clicked: false,
            billing_history_clicked: false,
            payment_info_clicked: false,
            shipping_details_clicked: false,
            category: [],
            count: [],
            frequency: [],
            price: [],
            diet:[],
            fragrance: [],
            // Billing ---------
            invoice_number: '',
            amount: '',
            date: '',
            status: '',
            // Payment Information ---------
            last_four: '',
            billing_address: '',
            type: '',
            exp_month: '',
            exp_year: ''
        }
    }
    

    async componentDidMount() {
        const user_ID = localStorage.getItem('user_ID');
        const history = createBrowserHistory();
        
        // Get Subscriptions 
        axios.post('/subscription-settings', {
            user_ID
        }).then((response) => {
            if(response.data == 'No subscriptions') {
                this.setState({subscriptions: false});
            }else {
                this.setState({data_exists: true});
                response.data.forEach(values => {
                    this.state.category.push(values.category);
                    this.state.frequency.push(values.frequency);
                    this.state.price.push(values.price);
                    this.state.diet.push(values.diet_restrictions);
                    this.state.fragrance.push(values.fragrance_allergies);
                    this.state.count.push(values.count);
                });
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
        });

            // Get Billing History
            await axios.post('/billing-history', {
                user_ID
            }).then((response) => {
                this.setState({
                    invoice_number: response.data.invoice_number,
                    amount: response.data.amount,
                    date: response.data.date,
                    status: response.data.status
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
            })

            // Payment Information ------------
            await axios.post('/payment-settings', {
                user_ID
            }).then((response) => {
                this.setState({
                    last_four: response.data.lastFour,
                    billing_address: response.data.billingAddress,
                    type: response.data.type,
                    exp_month: response.data.exp_month,
                    exp_year: response.data.exp_year,
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
            })
        }

    render() {
        document.body.style.background = "white";
        return (
            <div>
                <Header /> 
                <div className="container">
                    <DisclaimerSettings />
                    <div className="settings-navbar d-flex flex-column">
                        <p onClick={() => this.setState({
                            account_clicked: true, 
                            subscriptions_clicked: false,
                            billing_history_clicked: false,
                            payment_info_clicked: false,
                            shipping_details_clicked: false
                            })}>Account</p>
                        <p onClick={() => this.setState({
                            account_clicked: false, 
                            subscriptions_clicked: true,
                            billing_history_clicked: false,
                            payment_info_clicked: false,
                            shipping_details_clicked: false
                            })}>Subscriptions</p>
                        <p onClick={() => this.setState({
                            account_clicked: false, 
                            subscriptions_clicked: false,
                            billing_history_clicked: true,
                            payment_info_clicked: false,
                            shipping_details_clicked: false
                        })}>Billing History</p>
                        <p onClick={() => this.setState({
                            account_clicked: false, 
                            subscriptions_clicked: false,
                            billing_history_clicked: false,
                            payment_info_clicked: true,
                            shipping_details_clicked: false
                        })}>Payment Information</p>
                        <p onClick={() => this.setState({
                            account_clicked: false, 
                            subscriptions_clicked: false,
                            billing_history_clicked: false,
                            payment_info_clicked: false,
                            shipping_details_clicked:true
                        })}>Shipping Details</p>
                    </div>
                    <div>
                        {this.state.account_clicked ? <AccountSettings /> : null }
                        {this.state.subscriptions_clicked ? <SubscriptionsSettings 
                            category={this.state.category} 
                            frequency={this.state.frequency} 
                            price={this.state.price} 
                            diet={this.state.diet}
                            fragrance={this.state.fragrance}
                            subscription_exists= {true}
                            count= {this.state.count}
                        /> : null}
                        {this.state.billing_history_clicked ? (
                            <div className="display-settings-container">
                                <h1 className="settings-title billing-history-settings-title" style={{marginLeft: 230 + 'px'}}>Billing History</h1>
                                {this.state.data_exists ? (
                                    <div>
                                        <div className="invoice-categories d-flex flex-row">
                                            <p>Inv No.</p>
                                            <p>Amount</p>
                                            <p>Status</p>
                                            <p>Date</p>
                                        </div>
                                        {this.state.category.map((categories, index) => {
                                            return <BillingHistory 
                                                category={categories} 
                                                invoice_number={this.state.invoice_number[index]}
                                                amount={this.state.amount[index]}
                                                date={this.state.date[index]}
                                                status={this.state.status[index]} 
                                            />
                                        })}
                                    </div>
                                ) : (
                                    <div>
                                        <p className="no-data">No billing history found</p>
                                    </div>
                                )}
                            </div>
                        ):null}
                            
                        {this.state.payment_info_clicked ? (
                            <div className="display-settings-container" id="paymentSettingsContainer">
                                <h1 className="settings-title payment-information-title" style={{whiteSpace:'nowrap', marginLeft: 160 + 'px'}}>Payment Information</h1>
                                {this.state.data_exists ? (
                                    <div>
                                        {this.state.last_four.map((digits, index) => {
                                            return <PaymentInfo 
                                                last_four= {digits}
                                                category={this.state.category[index]} 
                                                billing_address= {this.state.billing_address[index]}
                                                type= {this.state.type[index]}
                                                exp_month= {this.state.exp_month[index]}
                                                exp_year= {this.state.exp_year[index]}
                                                count= {this.state.count[index]}
                                            />
                                        })}
                                    </div>
                                    ): (
                                        <div>
                                            <p className="no-data">No payment information found</p>
                                        </div>
                                    )}
                            </div> 
                        ) : null}
                        {this.state.shipping_details_clicked ? (
                            <div className="display-settings-container" id="shippingSettingsContainer">
                                <h1 className="settings-title shipping-details-title" style={{whiteSpace:'nowrap', marginLeft: 200 + 'px'}}>Shipping Details</h1>
                                {this.state.data_exists ? (
                                    <div>
                                        {this.state.category.map((categories, index) => {
                                            return <ShippingDetails 
                                                category= {categories} 
                                                count= {this.state.count[index]}
                                            /> 
                                        })}
                                    </div>
                                ): (
                                    <div>
                                        <p className="no-data">No shipping details found</p>
                                    </div>
                                )}
                            </div>
                        ) : null}
                        </div>  
                    </div>
                <Footer />
            </div>
        );
    }
}

export default Settings;