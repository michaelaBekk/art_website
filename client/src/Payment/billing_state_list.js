import React, { Component } from 'react';


export default class BillingStateList extends Component {
    constructor(props) {
        super(props);
        this.selectBillingStateMenu = this.selectBillingStateMenu.bind(this);
        this.state = {
            selected_billing_state: 'Select State'
        }
    }

    selectBillingStateMenu() {
        const stateMenu = document.querySelector('.billing-state-menu');
        const stateMenuOptions = document.querySelectorAll('.billing-state-menu option');
        stateMenu.classList.toggle('display-block');
        for(let s=0; s < stateMenuOptions.length; s++) {
            stateMenuOptions[s].addEventListener('click', () => {
                this.setState({selected_billing_state: stateMenuOptions[s].value});
                this.props.state(stateMenuOptions[s].value);
            })
        }
    }

    render() {
        return (
            <div>
                <button type="button" onClick={this.selectBillingStateMenu} className="state-selection-button" id="billingStateButton">{this.state.selected_billing_state}<i className="fa fa-caret-down btn-arrow"></i>
                    <div className="billing-state-menu">
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                    </div>
                </button>
            </div>
        );
    }
}