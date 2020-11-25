import React, {Component} from 'react';
import './cart_items.css';
import Product from '../Products_Data/product_example_img.json';
import Header from '../Navigation/header';
import Footer from '../Navigation/footer';
import ChangeFrequency from './change_frequency';
import SubscriptionSelection from './subscription_selection';


export default class CartItems extends Component {
    constructor() {
        super();
        const frequency = localStorage.getItem('Frequency');
        this.state = {
            frequency: frequency,
            img: '',
            price: ''
        }
    }

    componentDidMount() {
        const category = localStorage.getItem('Category')
        {Product.map((product)=> {
            if(product.category == category) {
                this.setState({
                    img: product.img,
                    price: product.price
                })
            }
        })}
    }

    render() {
        document.body.style.background = "white";
        return (
            <div>
                <ChangeFrequency />
                <div className='background'>
                    <Header />
                    <div>
                        <h1 className="cart-items-title">Shopping Cart</h1>
                    </div>
                    <div className="payment-summary-container">
                        <h2 className="payment-summary-title">Order Summary:</h2>
                        <h5 className="total">Subscription Total: ${this.state.price} per month</h5>
                        <a href="/personalized-kit/subscription-payment"><button type="button" className="checkout-button">Proceed to Checkout</button></a>
                    </div>
                    <SubscriptionSelection />
                    <Footer />
                </div>
            </div>
        );
    }
} 