import React, { Component } from 'react';
import './payment_info.css';
import EditPaymentInfo from './edit-payment-info';

class PaymentInfo extends Component {
    constructor(props) {
        super(props);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.successfulPayment = this.successfulPayment.bind(this);
        this.updateCard = this.updateCard.bind(this);
        this.updateType = this.updateType.bind(this);
        this.updateExpDate = this.updateExpDate.bind(this);
        this.updateBillingAddress = this.updateBillingAddress.bind(this);
        this.state = {
            edit: false,
            successful_payment_update: false,
            last_four: this.props.last_four,
            type: this.props.type,
            exp_date: this.props.exp_month + '/' + this.props.exp_year,
            billing_address: this.props.billing_address
        }
    }

    // Cancel Payment Update ---------
    cancelEdit(value) {
        this.setState({edit: value});
    }

    // Successful Payment Update -----------
    successfulPayment(value) {
        this.setState({successful_payment_update: value});
    }

    // Update Payment Information -----------
    updateCard(value) {
        this.setState({last_four: value});
    }

    updateType(value) {
        this.setState({type: value});
    }

    updateExpDate(value) {
        this.setState({exp_date: value});
    }

    updateBillingAddress(value) {
        this.setState({billing_address: value});
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.successful_payment_update ? (
                        <div className="successful-payment-update">
                            <p><strong>{this.props.category}</strong> payment has been successfully updated!</p>
                        </div>
                    ): null}
                    <div className="payment-info-container d-flex flex-column">
                        <h2 className="payment-categories">{this.props.category}</h2>
                        <p className="payment">Card ending in <span className="last-four">{this.state.last_four}</span><span className="card-type">{this.state.type}</span></p>
                        <p>Expiration Date: <span className="expiration">{this.state.exp_date}</span></p>
                        <p>Billing Address: <span className="billing-address">{this.state.billing_address}</span></p>
                    </div>
                </div>
                <p className="edit-payment-info" onClick={() => {
                    this.setState({edit: true});
                }}>Edit</p>
                <hr />
                {this.state.edit ? <EditPaymentInfo 
                    edit={this.cancelEdit} 
                    category={this.props.category}
                    count={this.props.count}
                    successful_payment_update={this.successfulPayment}
                    card_number={this.updateCard}
                    type={this.updateType}
                    exp_date={this.updateExpDate}
                    billing_address={this.updateBillingAddress}
                /> : null}
            </div>
        )
    }
}


export default PaymentInfo;