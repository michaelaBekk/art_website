import React, { Component } from 'react';
import axios from 'axios';
import SubscriptionChange from './subscription_change';
import {createBrowserHistory} from 'history';


class SubscriptionsList extends Component {
    constructor(props) {
        super(props);
        this.handleUpdateFrequency = this.handleUpdateFrequency.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.editDiet = this.editDiet.bind(this);
        this.editFragrance = this.editFragrance.bind(this);
        this.state = {
            baking: false,
            candlemaking: false,
            fragrance: this.props.fragrance,
            diet: this.props.diet,
            change: false,
            frequency: this.props.frequency,
            value: '',
            next_billing_date: '',
            successful_cancel: this.props.successful_cancel
        }
    }

    componentDidMount() {
        if(this.props.category == 'Baking') {
            this.setState({baking: true});
        }
        if(this.props.category == 'Candlemaking') {
            this.setState({candlemaking: true});
        }
    }

    // Edit Diet Restrictions ---------- 
    editDiet(e) {
        const history = createBrowserHistory();
        const dietValues = document.getElementById('dietRestrictionValues');

        let saveButton = document.createElement('p');
        saveButton.setAttribute('class', 'edit-diet');
        saveButton.innerHTML = "Save";
        e.target.replaceWith(saveButton);

        const editButton = e.target;

        let dietInput  = document.createElement('input');
        dietInput.type = "text";
        dietInput.className = "edit-diet-input";
        dietInput.value = this.state.value;
        document.querySelector('.dietary-restrictions-settings').appendChild(dietInput);

        dietValues.replaceWith(dietInput);

            dietInput.addEventListener('change', (e) => {
                this.setState({diet: e.target.value});
            })


        // Save Changes 
        saveButton.addEventListener('click', (e) => {  
            e.target.replaceWith(editButton);
            
            if(this.state.diet == null) {
                dietInput.replaceWith(this.props.diet);
            }else {
                dietInput.replaceWith(dietValues);    
            }    

            // Send Changes to database
            const user_ID = localStorage.getItem('user_ID');
            axios.post('https://art-crafts-site.herokuapp.com/update-diet-restrictions', {
                user_ID,
                diet: this.state.diet
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
        })
    }

    // Edit Fragrance Allergies ---------- 
    editFragrance(e) {
        const history = createBrowserHistory();
        const fragranceValues = document.getElementById('fragranceAllergyValues');
       
        let saveButton = document.createElement('p');
        saveButton.setAttribute('class', 'edit-fragrance');
        saveButton.innerHTML = "Save";
        e.target.replaceWith(saveButton);

        const editButton = e.target;

        let fragranceInput = document.createElement('input');
        fragranceInput.type = "text";
        fragranceInput.className = "edit-fragrance-input";
        fragranceInput.value = this.state.value;
        document.querySelector('.fragrance-allergies-settings').appendChild(fragranceInput);

        fragranceValues.replaceWith(fragranceInput);

            fragranceInput.addEventListener('change', (e) => {
                this.setState({fragrance: e.target.value});
            })

        // Save Changes 
        saveButton.addEventListener('click', (e) => { 

            if(this.state.fragrance == null) {
                fragranceInput.replaceWith(this.props.fragrance);
            }else {
                fragranceInput.replaceWith(fragranceValues);    
            }   

            e.target.replaceWith(editButton);
        
            // Send Changes to database
            const user_ID = localStorage.getItem('user_ID');
            axios.post('https://art-crafts-site.herokuapp.com/update-fragrance-allergies', {
                user_ID,
                fragrance: this.state.fragrance
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
            });
        })
    }

    updateValue(value) {
        this.setState({value});
    }

    handleUpdateFrequency(e) {
        this.setState({
            change: true,
            frequency: ''
        });
   
        let saveButton = document.createElement('p');
        saveButton.setAttribute('class', 'sub-save');
        saveButton.innerHTML = "Save";
        e.target.replaceWith(saveButton);

        const changeButton = e.target;

        saveButton.addEventListener('click', (e) => {
            if(this.state.value == '') {
                this.setState({
                    change: false,
                    frequency: this.props.frequency
                });
            }else {
                this.setState({
                    change: false,
                    frequency: this.state.value
                });
            }
          
            e.target.replaceWith(changeButton);

            // Update Subscription Frequency -------------
            const user_ID = localStorage.getItem('user_ID');
            const successfulMessage = document.querySelector('.successful-update');
            axios.post('https://art-crafts-site.herokuapp.com/update-subscription', {
                user_ID,
                frequency: this.state.frequency,
                category: this.props.category,
                price: this.props.price,
                count: this.props.count
            }).then((response) => {
                this.setState({next_billing_date: response.data.next_billing_date});

                if(response.data.next_billing_date) {
                    successfulMessage.style.display = "block";
                }
            })
        });
        
    } 

    render() {
        const diet_list = this.state.diet.split(',').join(' ');
        return (
            <div>
                <p className="successful-update">Subscription updated successfully! Next payment is on <strong>{this.state.next_billing_date}</strong></p>
                <div className="subscription-settings-container">
                    <p className="subscription-label d-flex flex-row">Selection: <span className="subscription-value category-value" style={{marginLeft:200 + 'px'}}>{this.props.category}</span></p>
                    <hr />
                    <p className="subscription-label d-flex flex-row">Frequency:  {this.state.change ? <SubscriptionChange value={this.updateValue} /> : null}<span className="subscription-value frequency-value" style={{marginLeft:180 + 'px'}}>{this.state.frequency}</span><span className="sub-change" onClick={this.handleUpdateFrequency}>Change</span></p>
                    <hr />
                    <p className="subscription-label d-flex flex-row">Price: <span className="subscription-value">${this.props.price}.00 <span style={{fontSize: 16 + 'px'}}>USD</span> / month</span></p>
                    {this.state.baking ? (
                        <div className="dietary-restrictions-settings">
                            <hr />
                            <div className="d-flex flex-row">
                                <p className="subscription-label">Diet Restrictions:
                                    <div className="diet-values-container d-flex flex-row justify-content-center">
                                        <span className="subscription-value" id="dietRestrictionValues">{diet_list}</span>
                                    </div>
                                </p>
                                <p className="edit-diet" onClick={this.editDiet}>Edit</p>
                            </div>
                        </div>
                    ): null}
                    {this.state.candlemaking ? (
                        <div className="fragrance-allergies-settings">
                            <hr />
                            <div className="d-flex flex-row">
                                <p className="subscription-label">Fragrance Allergies:
                                    <div className="fragrance-values-container d-flex flex-row justify-content-center">
                                        <span className="subscription-value" id="fragranceAllergyValues">{this.state.fragrance}</span>
                                    </div>
                                </p>
                                <p className="edit-fragrance" onClick={this.editFragrance}>Edit</p>
                            </div>
                        </div>
                    ): null}
                </div>
            </div>
        );
    }
}

export default SubscriptionsList;