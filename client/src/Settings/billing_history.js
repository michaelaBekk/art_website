import React, { Component } from 'react';
import './billing_history.css';

export default class BillingHistory extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1 className="invoice-subscription">{this.props.category}</h1>
                <div className="d-flex flex-row invoice-values">
                    <p className="invoice-number">{this.props.invoice_number}</p>
                    <p className="invoice-amount">${this.props.amount}.00</p>
                    <p className="invoice-status">{this.props.status}</p>
                    <p className="invoice-date">{this.props.date}</p>
                </div>
                <hr />
            </div>
        );
    }
}