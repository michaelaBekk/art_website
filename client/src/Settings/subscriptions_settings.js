import React, { Component, createElement } from 'react';
import SubscriptionList from './subscriptions_list';
import CancelSubscription from './cancel_subscription';
import './subscription_settings.css';
import axios from 'axios';
import {createBrowserHistory} from 'history';

class SubscriptionsSettings extends Component {
    constructor(props) {
        super(props);
        this.cancelSubscription = this.cancelSubscription.bind(this);
        this.updateSelection = this.updateSelection.bind(this);
        this.closeCancelWindow = this.closeCancelWindow.bind(this);
        this.state = {
           cancel_clicked: false,
           selected_subs: [],
           error: '',
           successful_cancel: ''
        }
    }

    updateSelection(value) {
        if(value.length == 0) {
            this.state.selected_subs.pop(value[0]);
        }

        if(!this.state.selected_subs.includes(value[0])) {
            this.state.selected_subs.push(value[0]);
        }else {
            return;
        }

        if(value.length == 0 && this.state.selected_subs[1] == null) {
            this.state.selected_subs.pop(this.state.selected_subs[0]);
        }
    }


    // Cancel Selected Subscriptions
    cancelSubscription(e) {
        const user_ID = localStorage.getItem('user_ID');
        const history = createBrowserHistory();
        axios.post('/cancel-subscription', {
            user_ID,
            category: this.state.selected_subs
        }).then((response) => {
            if(response.data.error) {
                this.setState({error: response.data.error});
            }else {
                const subList = document.querySelectorAll('.subscription-settings-container');
                const cancelledCategory = document.querySelectorAll('.category-value');
                const successMessage = document.querySelector('.successful-cancel');

                successMessage.style.display = "block";
                
                this.state.selected_subs.forEach(value => {
                    for(let i=0; i < subList.length; i++) {
                        if(cancelledCategory[i].innerHTML == value) {
                            subList[i].remove();
                        }
                    }
                })
                this.setState({
                    successful_cancel: response.data.successful_cancel,
                    cancel_clicked: false
                });  
            }
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

    // Close Cancel Window
    closeCancelWindow() {
        this.setState({cancel_clicked: false});
    }


    render() {
        return (
            <div> 
                <div className="display-settings-container">
                    <h1 className="settings-title subscription-settings-title" style={{marginLeft: 240 + 'px'}}>Subscriptions</h1>
                    <p className="successful-cancel">{this.state.successful_cancel}</p>
                    {this.props.category.length > 0 ? (
                        <div>
                            <div className="subscription-list">
                                {this.props.category.map((categories, index) => {
                                    return <SubscriptionList 
                                        category= {categories} 
                                        frequency= {this.props.frequency[index]} 
                                        price= {this.props.price[index]} 
                                        diet= {this.props.diet[index]}
                                        fragrance= {this.props.fragrance[index]}
                                        count= {this.props.count[index]}
                                    />
                                })}
                            </div>
                            <div className="subscription-buttons-container d-flex flex-row justify-content-end">
                                <a href="/personalized-kit"><p className="sub-add">Add Subscription</p></a>
                                <p className="sub-cancel" onClick={() => {    
                                    this.setState({cancel_clicked: true});
                                }}>Cancel Subscription</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="no-subscriptions">You are currently not subscribed to recieve any art supplies.<a className="personalized-kit" href="/personalized-kit"> Start a personalized kit</a></p>
                        </div>
                    )}
                </div>
                {this.state.cancel_clicked ? (
                    <div className="cancel-subscription-popup">
                        <i className="material-icons close-sub-cancel" onClick={this.closeCancelWindow}>close</i>
                        <h1 className="cancel-instructions">Select the subscription(s) you wish to cancel</h1>
                        {this.props.category.map((categories) => {
                            return <CancelSubscription
                                category= {categories}
                                selected= {this.updateSelection}
                            />
                        })}
                        <p className="empty-field">{this.state.error}</p>
                        <button type="button" className="cancel-sub-button" onClick={this.cancelSubscription}>Cancel Subscriptions</button>
                    </div> 
                ): null}  
            </div>
        );
    }
}

export default SubscriptionsSettings;