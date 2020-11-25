import React, {Component} from 'react';
import axios from 'axios';
import {createBrowserHistory} from 'history';
import ShippingCountryList from '../Payment/shipping_country_list';
import ShippingStateList from '../Payment/shipping_state_list';

export default class EditShippingAddress extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateShippingCountry = this.updateShippingCountry.bind(this);
        this.updateShippingState = this.updateShippingState.bind(this);
        this.state = {
            category: this.props.category,
            count: this.props.count,
            shipping_address: '',
            first_shipping_address: '',
            second_shipping_address: '',
            shipping_city: '',
            shipping_country: '',
            shipping_state: '',
            shipping_zip: '',
            // Errors ---------
            first_shipping_address_error: '',
            second_shipping_address_error: '',
            shipping_city_error: '',
            shipping_country_error: '',
            shipping_state_error: '',
            shipping_zip_error: '',
        }
    }
    
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
        e.target.classList.remove('missing-field');
        this.setState({ [e.target.name + '_error']: '' });
    }

    //Update Shipping Country ----------------
    updateShippingCountry(value) {
        const shippingStateLabel = document.querySelector('.shipping-state-label');
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
    }

    // Update Shipping Address ------------
    handleSubmit(e) {
        e.preventDefault();

        const user_ID = localStorage.getItem('user_ID');
        const history = createBrowserHistory();
        
        axios.post('/update-shipping-address', {
            user_ID,
            category: this.state.category,
            count: this.state.count,
            first_shipping_address: this.state.first_shipping_address,
            second_shipping_address: this.state.second_shipping_address,
            shipping_city: this.state.shipping_city,
            shipping_country: this.state.shipping_country,
            shipping_state: this.state.shipping_state,
            shipping_zip: this.state.shipping_zip
        }).then((response) => {

            const errors = [
                response.data.first_shipping_address,
                response.data.shipping_city,
                response.data.shipping_zip
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
            const shippingCountryButton = document.querySelector('.shipping-country-button');
            
            if(response.data.shipping_country) {
                this.setState({shipping_country_error: response.data.shipping_country.msg});
                shippingCountryButton.classList.add('missing-field');
            }

            shippingCountryButton.addEventListener('click', () => {
                this.setState({shipping_country_error: ''});
                shippingCountryButton.classList.remove('missing-field');
            });

            // State Errors ------------------
            const shippingStateButton = document.getElementById('shippingStateButton');

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

            if(response.data == 'Shipping Address Updated') {
                this.props.successful_shipping_address_update('true');
                this.props.shipping_address(
                    `${this.state.first_shipping_address},
                    ${this.state.second_shipping_address},
                    ${this.state.shipping_city},
                    ${this.state.shipping_country},
                    ${this.state.shipping_state},
                    ${this.state.shipping_zip}`
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
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="edit-shipping-container">
                        <label htmlFor="address1" className="edit-payment-label">Address 1
                            <br />
                            <input type="text" name="first_shipping_address" value={this.state.first_shipping_address} onChange={this.handleChange} className="edit-payment-input" placeholder="1234 Main St" />
                            <p className="empty-field" style={{color: '#b30000'}}>{this.state.first_shipping_address_error}</p>
                        </label>
                        <label htmlFor="address2" className="edit-payment-label" id="address2Label">Address 2
                            <br />
                            <input type="text" name="second_shipping_address" value={this.state.second_shipping_address} onChange={this.handleChange} className="secondAddressInput" placeholder="Apartment, studio, or floor" />
                        </label>
                        <div className="edit-shipping-location-container">
                            <div className="d-flex flex-row">
                                <label htmlFor="city" className="edit-payment-label">City
                                    <br />
                                    <input type="text" name="shipping_city" onChange={this.handleChange} value={this.state.shipping_city} className="edit-payment-input" id="inputCity" />
                                    <p className="empty-field" style={{color: '#b30000'}}>{this.state.shipping_city_error}</p>
                                </label>
                                <label htmlFor="zip_code" className="edit-payment-label" id="editZipCode">Zip
                                    <br />
                                    <input type="text" name="shipping_zip" onChange={this.handleChange} value={this.state.shipping_zip} className="edit-payment-input" id="inputZip" />
                                    <p className="empty-field" style={{color: '#b30000'}}>{this.state.shipping_zip_error}</p>
                                </label>
                            </div>
                            <div>
                                <br />
                                <label htmlFor="country" className="edit-payment-label">Country
                                    <br />
                                    <ShippingCountryList country={this.updateShippingCountry} />
                                    <p className="empty-field" style={{color: '#b30000'}}>{this.state.shipping_country_error}</p>
                                </label>
                                <label htmlFor="state" className="edit-payment-label shipping-state-label">State
                                    <br />
                                    {this.state.select_shipping_state ? <ShippingStateList state={this.updateShippingState}  /> : null}
                                    <p className="empty-field"  style={{color: '#b30000'}}>{this.state.shipping_state_error}</p>
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