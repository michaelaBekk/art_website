import React, {Component} from 'react';
import './subscription_selection.css';
import Product from '../Products_Data/product_example_img.json';



export default class SubscriptionSelection extends Component {
    constructor() {
        super();
        const frequency = localStorage.getItem('Frequency');
        this.deleteSelection = this.deleteSelection.bind(this);
        this.state = {
            frequency: frequency,
            img: '',
            price: ''
        }
    }

    componentDidMount() {
        const category = localStorage.getItem('Category');
        const subscriptionSelection = document.querySelector('.subscription-details-container');
        {Product.map((product)=> {
            if(product.category == category) {
                this.setState({
                    img: product.img,
                    price: product.price
                })
            }
        })}
        if(category == null) {
            subscriptionSelection.remove();
        }
    }

    // Delete Selection----------
        deleteSelection() {
            localStorage.removeItem('Category');
            localStorage.removeItem('Frequency');
            localStorage.removeItem('Diet Restrictions');
            localStorage.removeItem('Fragrance Allergies');
            window.location.reload();
        }

    render() {
        const category = localStorage.getItem('Category')
        return (
            <div className="container subscription-details-container">
                <div className="details d-flex flex-row justify-content-between">
                    <img className="example-of-product" src={this.state.img} />
                    <p className="category d-flex flex-column">{category}
                        <p className="sub-frequency">Subscription: {this.state.frequency}<br /><span className="change-frequency" onClick={() => {
                            document.body.style.background = "black";
                            document.querySelector('.change-frequency-popup ').style.display = "block";
                            document.querySelector('.background').classList.add('dim-background'); 
                        }}>Change</span></p>
                    </p>
                    <p className="price">${this.state.price} <span style={{fontSize: 12 + 'px'}}>USD</span> / month
                        <p className="delete-selection" onClick={this.deleteSelection}>Delete</p>
                    </p>
                </div>
            </div>
        );
    }
} 

