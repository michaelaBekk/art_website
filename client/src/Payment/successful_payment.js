import React from 'react';
import './successful_payment.css';
import Product from '../Products_Data/product_example_img.json';
import Header from '../Navigation/header';
import Footer from '../Navigation/footer';


export default function SuccessfulPayment() {
    document.body.style.background = "white";

    // Date Subscribed
    let today = new Date();
    const dd = String(today.getDate());
    const day = today.toLocaleString('default', { weekday: 'long' });
    const month = today.toLocaleString('default', { month: 'long' });
    const yyyy = today.getFullYear();
    today = day + ' ' + month + ' ' + dd + ',' + ' ' + yyyy;

    // Subscription Details
    const category = localStorage.getItem('Sub Category');
    const frequency = localStorage.getItem('Sub Frequency');
    
    // Get Price
    let price;
    {Product.map((product)=> {
        if(product.category == category) {
            return price = product.price
        }
    })}

    return (
        <div>
            <Header />
            <div className= "container successful-payment-container">
                <h1 className="successful-payment-title"><span style={{fontWeight: 'bold', fontSize:60 + 'px'}}>Thank you!</span> You have successfully subscribed to recieve Arts and Crafts Supplies.</h1>
                <p className="email-confirmation">An email confirmation has been sent to you.</p>
                <p className="date-subscribed">Payment processed on: <strong>{today}</strong></p>
                <div className="product-information-container">
                    <h3>Subscription Details</h3>
                    <p className= "subcription-details-title">Product: ............................  <span className="subcription-details-value">{category} Supplies</span></p>
                    <p className= "subcription-details-title">Subscription: ........................................... <span className="subcription-details-value">{frequency}</span></p>
                    <p className= "subcription-details-title">Price: ....................................... <span className="subcription-details-value">${price} USD / month</span></p>
                </div>
                <p className="change-details">Subscription details can be changed in <a className="settings-link" href="/settings">Settings</a></p>
            </div>
            <Footer />
        </div>
    );
}