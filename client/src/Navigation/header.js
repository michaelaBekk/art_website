import React, {Component} from 'react';
import './header.css';
import axios from 'axios';


class Header extends Component {
    constructor(props) {
        super(props);
        const first_name = localStorage.getItem('First Name');
        const category = localStorage.getItem('Category');
        this.state = {
            first_name,
            category
        }
    }

    async componentDidUpdate() {
        const user_ID = localStorage.getItem('user_ID');
        await axios.post('/header', {
            user_ID
        }).then((response) => {
            this.setState({first_name: response.data})
        })
    }
    
    render() {
        return (
            <div>
                <div className="navbar container-fluid">
                    <div className="line-1 d-flex justify-content-center" style={{marginLeft: 'auto'}}>
                        <a className="navbar-options" href="/">Home</a>
                        <a className="navbar-options" href="/personalized-kit">Get Personalized Art Kit</a>
                        <p className="navbar-options" id="user">Welcome Back, {this.state.first_name} </p> 
                    </div>
                    <div className="line-2 d-flex justify-content-end" style={{marginLeft: 'auto'}}>
                        <a href="/settings" className="navbar-label"><i className="material-icons navbar-icon">settings</i>Settings</a>
                        <a href="/cart" className="navbar-label"><i className="material-icons navbar-icon">shopping_cart</i>Cart
                        {this.state.category !== null ? (
                            <span className="cart-contains-items">1</span>
                        ): null}</a>
                        <p className="navbar-label" onClick={() => {
                            localStorage.removeItem('Token Expiration');
                            window.location.reload();
                        }}><i className="material-icons navbar-icon" >login</i> Log Out</p>
                    </div>
                </div>   
            </div>
        )
    }
}

export default Header;