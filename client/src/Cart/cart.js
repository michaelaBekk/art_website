import React, {Component} from 'react';
import CartItems from './cart_items';
import EmptyCart from './empty_cart';


class Cart extends Component {
    constructor() {
        super();
        this.state = {
            empty: ''
        }
    }

    componentDidMount() {
        const category = localStorage.getItem('Category');
        if(category !== null) {
            this.setState({empty: false})
        }else {
            this.setState({empty: true})
        }
    }
    
    render() {
        document.body.style.background = "white";
        return (
            <div>
                {this.state.empty ? <EmptyCart /> : <CartItems />} 
            </div>
        );
    }
}


export default Cart;