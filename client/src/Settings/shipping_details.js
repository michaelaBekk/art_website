import React, {Component} from 'react';
import axios from 'axios';
import {createBrowserHistory} from 'history';
import EditShippingAddress from './edit_shipping_address';
import './shipping_details.css';

export default class ShippingDetails extends Component {
    constructor(props) {
        super(props);
        this.updateShippingAddress = this.updateShippingAddress.bind(this);
        this.successfulShippingAddressUpdate = this.successfulShippingAddressUpdate.bind(this);
        this.state = {
            edit: false,
            category: this.props.category,
            count: this.props.count,
            shipping_address: '',
            successful_shipping_address_update: false
        }
    }

    // Update Shipping Address --------------
    updateShippingAddress(value) {
        this.setState({shipping_address: value});
    }

    // Successful Shipping Address Update ------------
    successfulShippingAddressUpdate(value) {
        const editButton = document.querySelector('.edit-payment-info');
        this.setState({
            successful_shipping_address_update: value,
            edit: false
        });
        editButton.style.display = "";
    }

    
    // Shipping Details ------------
    async componentDidMount() {
         const user_ID = localStorage.getItem('user_ID');
         const history = createBrowserHistory();

        await axios.post('/shipping-settings', {
            user_ID,
            category: this.state.category,
            count: this.state.count
        }).then((response) => {
            this.setState({shipping_address: response.data.shipping_address});
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
        return (
            <div>
                <div>
                    {this.state.successful_shipping_address_update ? (
                        <div className="successful-shipping_address_update">
                            <p><strong>{this.props.category}</strong> shipping address has been successfully updated!</p>
                        </div>
                    ): null}
                    <div className="payment-info-container d-flex flex-column">
                        <h2 className="payment-categories">{this.props.category}</h2>
                        <p>Shipping Address: <span className="shipping-address">{this.state.shipping_address}</span></p>
                    </div>
                </div>
                {this.state.edit ? <EditShippingAddress 
                    category={this.props.category}
                    count={this.props.count}
                    successful_shipping_address_update={this.successfulShippingAddressUpdate}
                    shipping_address={this.updateShippingAddress}
                /> : null}
                <p className="edit-payment-info" onClick={(e) => {
                    this.setState({edit: true});
                    e.target.style.display = "none";
                }}>Edit</p>
                <hr />
            </div>
        )
    }
}