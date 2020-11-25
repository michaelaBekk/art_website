import React, {Component} from 'react';
import './payment.css';
import SubscriptionSelection from '../Cart/subscription_selection';
import ChangeFrequency from '../Cart/change_frequency';
import Header from '../Navigation/header';
import Footer from '../Navigation/footer';
import axios from 'axios';
import Product from '../Products_Data/product_example_img.json';
import ShippingCountryList from './shipping_country_list';
import BillingCountryList from './billing_country_list';
import ShippingStateList from './shipping_state_list';
import BillingStateList from './billing_state_list';
import { createBrowserHistory } from 'history';


export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.autofillBillingAddress = this.autofillBillingAddress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateShippingCountry = this.updateShippingCountry.bind(this);
        this.updateShippingState = this.updateShippingState.bind(this);
        this.updateBillingCountry = this.updateBillingCountry.bind(this);
        this.updateBillingState = this.updateBillingState.bind(this);
        const frequency = localStorage.getItem('Frequency');

        this.state = {
            frequency: frequency,
            price: '',
            select_shipping_state: false,
            select_billing_state: false,
            // Card ----------
            name: '',
            exp_date: '',
            card_number: '',
            cvc: '',
            // Shipping -----------
            first_shipping_address: '',
            second_shipping_address: '',
            shipping_city: '',
            shipping_country: '',
            shipping_state: '',
            shipping_zip: '',
            shipping_state: '',
            // Billing -----------
            same_billing: false,
            first_billing_address: '',
            second_billing_address: '',
            billing_city: '',
            billing_country: '',
            billing_state: '',
            billing_zip: '',
            billing_state: '',
            // Errors ---------
            name_error: '',
            exp_date_error: '',
            card_number_error: '',
            cvc_error: '',
            first_shipping_address_error: '',
            second_shipping_address_error: '',
            shipping_city_error: '',
            shipping_country_error: '',
            shipping_state_error: '',
            shipping_zip_error: '',
            first_billing_address_error: '',
            second_billing_address_error: '',
            billing_city_error: '',
            billing_country_error: '',
            billing_state_error: '',
            billing_zip_error: '',
        }

    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            first_billing_address: this.state.first_shipping_address,
            second_billing_address: this.state.second_shipping_address,
            billing_city: this.state.shipping_city,
            billing_zip: this.state.shipping_zip
        });

        e.target.classList.remove('missing-field');
        this.setState({ [e.target.name + '_error']: '' });

        const category = localStorage.getItem('Category');

        {Product.map((product)=> {
            if(product.category == category) {
                this.setState({
                    price: product.price
                })
            }
        })}
        
    }

    //Update Shipping Country ----------------
    updateShippingCountry(value) {
        const shippingStateLabel = document.querySelector('.shipping-state-label');
        if(this.state.same_billing == true) {
            this.setState({billing_country: value});
        }

        this.setState({shipping_country: value});

        if(value == 'US') {
            this.setState({select_shipping_state: true});
            shippingStateLabel.style.display = "block";
        }else {
            this.setState({select_shipping_state: false});
            shippingStateLabel.style.display = "";
        }
    }

    //Update Shipping State ----------------
    updateShippingState(value) {
        this.setState({shipping_state: value});

        if(this.state.same_billing == true) {
            this.setState({billing_state: value});
        }
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

    // Billing address is the same as shipping ------------------
    autofillBillingAddress() {
        const sameAddressButton = document.querySelector('.same-address-button');
        const billingInput = document.querySelector('.billing-container');
        sameAddressButton.classList.toggle('same-address-button-selected');
        billingInput.classList.toggle('display-none');

        this.setState({
            first_billing_address: this.state.first_shipping_address,
            second_billing_address: this.state.second_shipping_address,
            billing_city: this.state.shipping_city,
            billing_country: this.state.shipping_country,
            billing_state: this.state.shipping_state,
            billing_zip: this.state.shipping_zip,
            same_billing: !this.state.same_billing
        });
    }


    //Proccess Payment -----------------------
    handleSubmit(e) {
        e.preventDefault();

        const history = createBrowserHistory();

        const user_ID = localStorage.getItem('user_ID');
        const category = localStorage.getItem('Category');
        const frequency = localStorage.getItem('Frequency');
        const diet = localStorage.getItem('Diet Restrictions');
        const fragrances = localStorage.getItem('Fragrance Allergies');
        
        axios.post('/create-customer', {
            user_ID,
            category,
            frequency,
            diet,
            fragrances,
            price: this.state.price,
            name: this.state.name,
            exp_date: this.state.exp_date,
            card_number: this.state.card_number,
            cvc: this.state.cvc,
            first_shipping_address: this.state.first_shipping_address,
            second_shipping_address: this.state.second_shipping_address,
            shipping_city: this.state.shipping_city,
            shipping_country: this.state.shipping_country,
            shipping_state: this.state.shipping_state,
            shipping_zip: this.state.shipping_zip,
            first_billing_address: this.state.first_billing_address,
            second_billing_address: this.state.second_billing_address,
            billing_city: this.state.billing_city,
            billing_country: this.state.billing_country,
            billing_state: this.state.billing_state,
            billing_zip: this.state.billing_zip
        }).then((response) => {

            const errors = [
                response.data.name,
                response.data.exp_date,
                response.data.card_number,
                response.data.cvc,
                response.data.first_shipping_address,
                response.data.shipping_city,
                response.data.shipping_zip,
                response.data.first_billing_address,
                response.data.billing_city,
                response.data.billing_zip
            ];

            // Payment Form Errors --------------
            const input = document.querySelectorAll('.payment-input');
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
            const shippingCountryButton = document.querySelector('.shipping-country-button');
            const billingCountryButton = document.querySelector('.billing-country-button');
            if(response.data.shipping_country) {
                this.setState({shipping_country_error: response.data.shipping_country.msg});
                shippingCountryButton.classList.add('missing-field');
            }

            if(response.data.billing_country) {
                this.setState({billing_country_error: response.data.billing_country.msg});
                billingCountryButton.classList.add('missing-field');
            }

            shippingCountryButton.addEventListener('click', () => {
                this.setState({ shipping_country_error: ''});
                shippingCountryButton.classList.remove('missing-field');
            });

            billingCountryButton.addEventListener('click', () => {
                this.setState({billing_country_error: ''});
                billingCountryButton.classList.remove('missing-field');
            });

            // State Errors ------------------
            const shippingStateButton = document.getElementById('shippingStateButton');
            const billingStateButton = document.getElementById('billingStateButton');
            if(response.data.shipping_state) {
                this.setState({shipping_state_error: response.data.shipping_state});
                shippingStateButton.classList.add('missing-field');

                shippingStateButton.addEventListener('click', () => {
                    this.setState({shipping_state_error: ''});
                    shippingStateButton.classList.remove('missing-field');
                });

                return  <ShippingStateList>
                            <button type="button" className="state-selection-button" id="shippingStateButton">Select State<i className="fa fa-caret-down btn-arrow"></i></button>
                        </ShippingStateList>  
            }

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

            //Successfully Subscribed ----------
            if(response.data == 'No errors' && response.status == 200) {
                localStorage.removeItem('Category');
                localStorage.removeItem('Frequency');
                localStorage.removeItem('Diet Restrictions');
                localStorage.removeItem('Fragrance Allergies');
                localStorage.setItem('Sub Category', category);
                localStorage.setItem('Sub Frequency', frequency);
                history.push('/successful_subscription-payment');
                window.location.reload();
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
        document.body.style.background = "white";
        return (
            <div>
                <ChangeFrequency />
                <div className='background'>
                    <Header />
                    <div className="container">
                        <h1 className="payment-page-title">Arts and Crafts
                            <i className="fa fa-paint-brush brush-as-img"></i>
                        </h1>
                    </div>
                    <SubscriptionSelection />
                    <div className="container">
                        <form onSubmit={this.handleSubmit} id="paymentForm">
                            <h1 className="form-title">Subscription Payment</h1>
                            {/* Card Information ----------------- */}
                            <div className="d-flex flex-row payment-section" id="nameContainer">
                                <label htmlFor="name" className="payment-label">Full Name (on card)
                                    <br />
                                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="payment-input" id="fullName" />
                                    <p className="empty-field" style={{color: '#b30000'}}>{this.state.name_error}</p>
                                </label>
                                <label htmlFor="date" className="payment-label">Card Exp.
                                    <br />
                                    <input type="text" name="exp_date" value={this.state.exp_date} onChange={this.handleChange} className="payment-input" id="expirationDate" placeholder="MM/YY" maxLength="5" />
                                    <p className="empty-field"  style={{color: '#b30000'}}>{this.state.exp_date_error}</p>
                                </label>
                            </div>
                            <div className="d-flex flex-row payment-section" id="cardContainer">
                                <label htmlFor="card_number" className="payment-label">Card Number
                                    <br />
                                    <input type="text" name="card_number" value={this.state.card_number} onChange={this.handleChange} className="payment-input" id="cardNumber" />
                                    <i className="fa fa-credit-card"></i>
                                    <br />
                                    <i className="fa fa-cc-visa card-types"></i>
                                    <i className="fa fa-cc-amex card-types"></i>
                                    <i className="fa fa-cc-mastercard card-types"></i>
                                    <i className="fa fa-cc-paypal card-types"></i>
                                    <i className="fa fa-cc-discover card-types"></i>
                                    <p className="empty-field" style={{color: '#b30000'}}>{this.state.card_number_error}</p>
                                </label>
                                <label htmlFor="cvc" className="payment-label">CVC
                                    <i className="material-icons help-icon" onClick={() => {
                                        const cvcDef = document.querySelector('.cvc-definition');
                                        cvcDef.classList.toggle('display-block');
                                    }}>help</i>
                                    <p className="cvc-definition">The final three digits of the number printed on the signature strip on the reverse of your card.</p>
                                    <br />
                                    <input type="text" name="cvc" value={this.state.cvc} onChange={this.handleChange} className="payment-input" id="cvc" maxLength="3" />
                                    <p className="empty-field"  style={{color: '#b30000'}}>{this.state.cvc_error}</p>
                                </label>
                            </div>
                            <hr className="section-division" />
                            {/* Shipping Address ----------------- */}
                            <div className="d-flex flex-column payment-section" id="addressContainer">
                                <p className="address-type">Shipping Address:</p>
                                <label htmlFor="address1" className="payment-label">Address 1</label>
                                <input type="text" name="first_shipping_address" value={this.state.first_shipping_address} onChange={this.handleChange}  className="payment-input" id="inputAddress" placeholder="1234 Main St" /> 
                                <p className="empty-field" style={{color: '#b30000'}}>{this.state.first_shipping_address_error}</p>
                                <br />
                                <label htmlFor="address2" className="payment-label">Address 2</label>
                                <input type="text" onChange={this.handleChange} value={this.state.second_shipping_address} name="second_shipping_address" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                            </div>
                            <div className="payment-section" id="shippingLocationContainer">
                                <div className="d-flex flex-row">
                                    <label htmlFor="city" className="payment-label">City
                                        <br />
                                        <input type="text" onChange={this.handleChange} value={this.state.shipping_city} name="shipping_city" className="payment-input" id="inputCity" />
                                        <p className="empty-field" style={{color: '#b30000'}}>{this.state.shipping_city_error}</p>
                                    </label>
                                    <label htmlFor="country" className="payment-label">Country
                                        <br />
                                        <ShippingCountryList country={this.updateShippingCountry} />
                                        <p className="empty-field" style={{color: '#b30000'}}>{this.state.shipping_country_error}</p>
                                    </label>
                                    <div className="state_container">
                                        <label htmlFor="state" className="payment-label shipping-state-label">State
                                            <br />
                                            {this.state.select_shipping_state ? <ShippingStateList state={this.updateShippingState} /> : null}
                                            <p className="empty-field"  style={{color: '#b30000'}}>{this.state.shipping_state_error}</p>
                                        </label>
                                    </div>
                                </div>
                                <label htmlFor="zip_code" className="payment-label" id="zipLabel">Zip
                                    <br />
                                    <input type="text" onChange={this.handleChange} value={this.state.shipping_zip} name="shipping_zip" className="payment-input" id="inputZip" />
                                    <p className="empty-field" style={{color: '#b30000'}}>{this.state.shipping_zip_error}</p>
                                </label>
                            </div>
                            <hr className="section-division" />
                            {/* Billing Address ----------------- */}
                            <button type="button" className="same-address-button" onClick={this.autofillBillingAddress}><p>Billing address is the same as shipping</p></button>
                            <div className="billing-container">
                                <div className="d-flex flex-column payment-section" id="addressContainer">
                                    <p className="address-type">Billing Address:</p>
                                    <label htmlFor="address1" className="payment-label">Address 1</label>
                                    <input type="text" name="first_billing_address" value={this.state.first_billing_address} onChange={this.handleChange} className="payment-input" id="inputAddress" placeholder="1234 Main St" />
                                    <p className="empty-field" style={{color: '#b30000'}}>{this.state.first_billing_address_error}</p>
                                    <br />
                                    <label htmlFor="address2" className="payment-label">Address 2</label>
                                    <input type="text" name="second_billing_address" value={this.state.second_billing_address} onChange={this.handleChange} id="inputAddress2" placeholder="Apartment, studio, or floor" />
                                </div>
                                <div className="payment-section" id="billingLocationContainer">
                                    <div className="d-flex flex-row">
                                        <label htmlFor="city" className="payment-label">City
                                            <br />
                                            <input type="text" name="billing_city" onChange={this.handleChange} value={this.state.billing_city} className="payment-input" id="inputCity" />
                                            <p className="empty-field" style={{color: '#b30000'}}>{this.state.billing_city_error}</p>
                                        </label>
                                        <br />
                                        <label htmlFor="country" className="payment-label">Country
                                            <br />
                                            <BillingCountryList country={this.updateBillingCountry} />
                                            <p className="empty-field" style={{color: '#b30000'}}>{this.state.billing_country_error}</p>
                                        </label>
                                        <div className="state_container">
                                            <label htmlFor="state" className="payment-label billing-state-label">State
                                                <br />
                                                {this.state.select_billing_state ? <BillingStateList state={this.updateBillingState}  /> : null}
                                                <p className="empty-field"  style={{color: '#b30000'}}>{this.state.billing_state_error}</p>
                                            </label>
                                        </div>
                                    </div>
                                    <label htmlFor="zip_code" className="payment-label" id="zipLabel">Zip
                                        <br />
                                        <input type="text"  name="billing_zip" onChange={this.handleChange} value={this.state.billing_zip} className="payment-input" id="inputZip" />
                                        <p className="empty-field" style={{color: '#b30000'}}>{this.state.billing_zip_error}</p>
                                    </label>
                                </div>
                            </div>
                            <hr className="section-division" />
                            <button type="submit" className="submit-payment-button">Submit Payment</button>  
                        </form>
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}