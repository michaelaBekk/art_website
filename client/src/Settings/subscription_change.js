import React, {Component} from 'react';

export default class SubscriptionChange extends Component {
    constructor(props) {
        super(props);
        this.changeFrequency = this.changeFrequency.bind(this);
    }

    changeFrequency(e) {
        this.props.value(e.target.value);
    }
    
    render() {
        return (
            <div className="d-flex flex-row justify-content-center change-subscription-frequency">
                <input className="form-check-input position-static" type="radio" name="frequency" value="1 month" onChange={this.changeFrequency} aria-label="..." />
                <label className="form-check-label" htmlFor="frequency">1 month</label>
                <input className="form-check-input position-static" type="radio" name="frequency" value="3 months" onChange={this.changeFrequency} aria-label="..." />
                <label className="form-check-label" htmlFor="frequency">3 months</label>
                <input className="form-check-input position-static" type="radio" name="frequency" value="6 months" onChange={this.changeFrequency} aria-label="..." />
                <label className="form-check-label" htmlFor="frequency">6 months</label> 
            </div>
        );
    }
}