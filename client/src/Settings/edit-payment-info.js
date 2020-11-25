import React, { Component } from 'react';
import BillingCountryList from '../Payment/billing_country_list';
import BillingStateList from '../Payment/billing_state_list';
import axios from 'axios';
import {createBrowserHistory} from 'history';


class EditPaymentInfo extends Component {
    constructor(props) {
        super(props);
        this.updateBillingCountry = this.updateBillingCountry.bind(this);
        this.updateBillingState= this.updateBillingState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange= this.handleChange.bind(this);
        this.state = {
            edit: true,
            category: this.props.category,
            count: this.props.count,
            name: '',
            card_number: '',
            exp_date: '',
            cvc: '',
            first_billing_address: '',
            second_billing_address: '',
            billing_city: '',
            billing_country: '',
            billing_state: '',
            billing_zip: '',
            select_billing_state: false,
            // Errors -------
            name_error: '',
            card_number_error: '',
            exp_date_error: '',
            cvc_error: '',
            first_billing_address_error: '',
            billing_city_error: '',
            billing_country_error: '',
            billing_state_error: '',
            billing_zip_error: '',
        }
    }

    handleChange(e) {
        this.setState({[e.target.name] : e.target.value});
        e.target.classList.remove('missing-field');
        this.setState({ [e.target.name + '_error']: '' });
    }

     //Update Billing Country ----------------
     updateBillingCountry(value) {
        const billingStateLabel = document.querySelector('.billing-state-label');
        this.setState({billing_country: value});
        if(value == 'US') {
            this.setState({select_billing_state: true});
            billingStateLabel.style.display = "block";
        }else {
            this.setState({select_billing_state: false});
            billingStateLabel.style.display = "";
        }
    }

    //Update Billing State ----------------
    updateBillingState(value) {
        this.setState({billing_state: value});
    }

    //Update Payment Information -----------------------
    handleSubmit(e) {
        e.preventDefault();

        const user_ID = localStorage.getItem('user_ID');
        const history = createBrowserHistory();
        
        axios.post('/update-payment', {
            user_ID,
            category: this.state.category,
            count: this.state.count,
            name: this.state.name,
            exp_date: this.state.exp_date,
            card_number: this.state.card_number,
            cvc: this.state.cvc,
            first_billing_address: this.state.first_billing_address,
            second_billing_address: this.state.second_billing_address,
            billing_city: this.state.billing_city,
            billing_country: this.state.billing_country,
            billing_state: this.state.billing_state,
            billing_zip: this.state.billing_zip
        }).then((response) => {

            const errors = [
                response.data.name,
                response.data.card_number,
                response.data.exp_date,
                response.data.cvc,
                response.data.first_billing_address,
                response.data.billing_city,
                response.data.billing_zip
            ];

            // Payment Form Errors --------------
            const input = document.querySelectorAll('.edit-payment-input');
            for(let e=0; e < errors.length; e++) {
                if(errors[e]) {
                    input[e].classList.add('missing-field');
                    this.setState({ [input[e].name + '_error']: errors[e].msg });
                }else {
                    input[e].classList.remove('missing-field');
                    this.setState({ [input[e].name + '_error']: '' });
                }
            }

            // Country Errors ----------------
            const billingCountryButton = document.querySelector('.billing-country-button');
            
            if(response.data.billing_country) {
                this.setState({billing_country_error: response.data.billing_country.msg});
                billingCountryButton.classList.add('missing-field');
            }

            billingCountryButton.addEventListener('click', () => {
                this.setState({billing_country_error: ''});
                billingCountryButton.classList.remove('missing-field');
            });

            // State Errors ------------------
            const billingStateButton = document.getElementById('billingStateButton');

            if(response.data.billing_state) {
                this.setState({billing_state_error: response.data.billing_state});
                billingStateButton.classList.add('missing-field');

                billingStateButton.addEventListener('click', () => {
                    this.setState({billing_state_error: ''});
                    billingStateButton.classList.remove('missing-field');
                });
                
                return  <BillingStateList>
                            <button type="button" className="state-selection-button" id="billingStateButton">Select State<i className="fa fa-caret-down btn-arrow"></i></button>
                        </BillingStateList> 
            }

            if(response.data.last_four) {
                this.props.edit(!this.state.edit);
                this.props.successful_payment_update('true');
                this.props.card_number(response.data.last_four);
                this.props.type(response.data.type);
                this.props.exp_date(this.state.exp_date);
                this.props.billing_address(
                    `${this.state.first_billing_address},
                    ${this.state.second_billing_address},
                    ${this.state.billing_city},
                    ${this.state.billing_country},
                    ${this.state.billing_state},
                    ${this.state.billing_zip}`
                )
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
    }

    render() {
        return (
            <div className="payment-edit-container">
                <i className="material-icons close-edit-payment-window" onClick={() => {
                    this.props.edit(!this.state.edit);
                }}>close</i>
                <form onSubmit={this.handleSubmit} className="d-flex flex-column">
                    <label htmlFor="name" className="edit-payment-label">Full Name (on card)
                        <br />
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="edit-payment-input" />
                        <p className="empty-field" style={{color: '#b30000'}}>{this.state.name_error}</p>
                    </label>
                    <label htmlFor="card_number" className="edit-payment-label">Card Number
                        <br />
                        <input type="text" name="card_number" value={this.state.card_number} onChange={this.handleChange} className="edit-payment-input" id="editCardNumber" />
                        <i className="fa fa-credit-card" id="cardIcon"></i>
                        <br />
                        <p className="empty-field" style={{color: '#b30000'}}>{this.state.card_number_error}</p>
                    </label>
                    <div className="d-flex flex-row">
                        <label htmlFor="date" className="edit-payment-label">Card Exp.
                            <br />
                            <input type="text" name="exp_date" value={this.state.exp_date} onChange={this.handleChange} className="edit-payment-input" id="expirationDate" placeholder="MM/YY" maxLength="5" style={{marginRight: 30 + 'px'}} />
                            <p className="empty-field"  style={{color: '#b30000'}}>{this.state.exp_date_error}</p>
                        </label>
                        <label htmlFor="cvc" className="edit-payment-label" id="editCvc">CVC
                            <i className="material-icons help-icon" id="cvcDefinitionIcon" onClick={() => {
                                const cvcDef = document.querySelector('.cvc-definition');
                                cvcDef.classList.toggle('display-block');
                            }}>help</i>
                            <p className="cvc-definition" id="paymentCvcDefinition" style={{color: '#1b501b'}}>The final three digits of the number printed on the signature strip on the reverse of your card.</p>
                            <br />
                            <input type="text" name="cvc" value={this.state.cvc} onChange={this.handleChange} className="edit-payment-input" id="cvc" maxLength="3" />
                            <p className="empty-field"  style={{color: '#b30000'}}>{this.state.cvc_error}</p>
                        </label>
                    </div>
                    <div className="edit-billing-container">
                        <label htmlFor="address1" className="edit-payment-label">Address 1
                            <br />
                            <input type="text" name="first_billing_address" value={this.state.first_billing_address} onChange={this.handleChange} className="edit-payment-input" placeholder="1234 Main St" />
                            <p className="empty-field" style={{color: '#b30000'}}>{this.state.first_billing_address_error}</p>
                        </label>
                        <label htmlFor="address2" className="edit-payment-label" id="address2Label">Address 2
                            <br />
                            <input type="text" name="second_billing_address" value={this.state.second_billing_address} onChange={this.handleChange} className="secondAddressInput" placeholder="Apartment, studio, or floor" />
                        </label>
                        <div className="edit-billing-location-container">
                            <div className="d-flex flex-row">
                                <label htmlFor="city" className="edit-payment-label">City
                                    <br />
                                    <input type="text" name="billing_city" onChange={this.handleChange} value={this.state.billing_city} className="edit-payment-input" id="inputCity" />
                                    <p className="empty-field" style={{color: '#b30000'}}>{this.state.billing_city_error}</p>
                                </label>
                                <label htmlFor="zip_code" className="edit-payment-label" id="editZipCode">Zip
                                    <br />
                                    <input type="text" name="billing_zip" onChange={this.handleChange} value={this.state.billing_zip} className="edit-payment-input" id="inputZip" />
                                    <p className="empty-field" style={{color: '#b30000'}}>{this.state.billing_zip_error}</p>
                                </label>
                            </div>
                            <div>
                                <br />
                                <label htmlFor="country" className="edit-payment-label">Country
                                    <br />
                                    <BillingCountryList country={this.updateBillingCountry} />
                                    <p className="empty-field" style={{color: '#b30000'}}>{this.state.billing_country_error}</p>
                                </label>
                                <label htmlFor="state" className="edit-payment-label billing-state-label">State
                                    <br />
                                    {this.state.select_billing_state ? <BillingStateList state={this.updateBillingState}  /> : null}
                                    <p className="empty-field"  style={{color: '#b30000'}}>{this.state.billing_state_error}</p>
                                </label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="save-payment-info">Save</button>  
                </form>
            </div>
        )
    }
}


export default EditPaymentInfo;