import React, {Component} from 'react';
import SignUpForm from './sign_up';
import LoginForm from './login';
import Footer from '../Navigation/footer';
import formDisplay from '../Reducers/form_reducer';
import {connect} from 'react-redux';
import './sign-up_log-in.css';

const mapStateToProps = (state) => {
    return {
        signup: state.state.signup
    }
}

const mapDispatchToProps = () => {
    return {
        formDisplay
    }
}


class Account extends Component{
    constructor() {
        super();  
        this.state = {
            signup: ''
        }
    }

    componentDidMount() {
        this.setState({signup: this.props.state})
        if(this.props.signup == true) {
            document.querySelector('.log-in-header').classList.remove('header-background');
            document.querySelector('.sign-up-header').classList.add('header-background')
        }else {
            document.querySelector('.log-in-header').classList.add('header-background');
            document.querySelector('.sign-up-header').classList.remove('header-background')
        }
    }

    render() {
        return (
            <div>
                <div className="container mx-auto" id="mainPageContainer" style={{width: 400 + 'px'}}>
                    <div>
                        <h1 className="page-title"> Arts and Crafts </h1>
                    </div>
                    <img className="thread-needle-img" src="../images/thread-needle.png" />
                    <div className="marketing-message">
                        <h2>World's largest Arts and Crafts Supplies Store</h2>
                        <p>Whether you paint, sew, draw, or make origami, we have something for you!</p>
                        <p>We give you a quick and easy survey that generates a custom list of supplies catered to your needs.</p>
                        <p>Choose how often you need to re stock and we will ship it staright to your door. No hassle! So what are you waiting for? Sign up today.</p>
                    </div>
                    <div className="container mx-auto form-container">
                        <div className="d-flex">
                            {this.state.signup? <SignUpForm /> : <LoginForm /> }
                                <div className="sign-up-header header-background" onClick={() => {
                                    this.setState({signup: true})
                                    document.querySelector('.log-in-header').classList.remove('header-background');
                                    document.querySelector('.sign-up-header').classList.add('header-background')
                                }}>Sign Up</div>
                                <div className="log-in-header" onClick={() => {
                                    this.setState({signup: false})
                                    document.querySelector('.log-in-header').classList.add('header-background');
                                    document.querySelector('.sign-up-header').classList.remove('header-background')
                                }}>Log In</div> 
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        ) 
    }
   
}


export default connect(mapStateToProps, mapDispatchToProps)(Account);