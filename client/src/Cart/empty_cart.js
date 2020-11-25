import React, {Component} from 'react';
import './empty_cart.css';
import Product from '../Products_Data/product_example_img.json';
import Header from '../Navigation/header';
import Footer from '../Navigation/footer';


export default class EmptyCart extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        const images = document.querySelectorAll('.advertising-images-slides img');
        let i=0;
        setInterval(() => {
                images[i].style.display = "none";
                if(i < images.length - 1) {
                    i++;
                }else {
                    i = 0;
                }
                images[i].style.display = "block";
                images[i].classList.add('image-animation');
            }, 6000);
        }
 
    render() {
        return (
            <div>
                <Header />
                <div>
                    <img className="arrow" src="../images/arrow.jpg" alt="arrow rose" />
                </div>
                <div className="empty-cart-container container-fluid">
                    <h1 className="empty-cart-title">Arts and Crafts</h1>
                    <span className="cart-count">Cart: 0 items</span>
                    <h3 className="empty-cart-subtitle">There is currently nothing in your cart.</h3>
                    <a className="personalized-kit-link" href="/personalized-kit"> Start customizing a kit</a>
                    <div className="advertising-image-container">
                        <div className="advertising-images-slides">
                            {Product.map((product)=> {
                                return <img src={product.img} alt="products images" />
                            })}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
} 