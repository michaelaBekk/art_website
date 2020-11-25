import React, {Component} from 'react';
import './change_frequency.css';

class ChangeFrequency extends Component {
    constructor() {
        super();
        this.changeFrequency = this.changeFrequency.bind(this);
        const frequency = localStorage.getItem('Frequency');
        this.state = {
            frequency: frequency,
            img: '',
            price: ''
        }
    }

    changeFrequency(e) {
        document.body.style.background = "white";
        window.location.reload();
        localStorage.removeItem('Frequency');
        const frequency = localStorage.setItem('Frequency', e.target.value);
        document.querySelector('.change-frequency-popup ').style.display = "none";
        document.querySelector('.background').classList.remove('dim-background'); 
    }

    render() {
        document.body.style.background = "white";
        return (
            <div>
                <div className="change-frequency-popup">
                    <i className="material-icons close-window" onClick={() => {
                        document.body.style.background = "white";
                        document.querySelector('.change-frequency-popup ').style.display = "none";
                        document.querySelector('.background').classList.remove('dim-background'); 
                    }}>close</i>
                    <h6 style={{marginLeft:25 + 'px', marginTop:20 + 'px', color:'#1f601f'}}>Select how often you would like to recieve supplies:</h6>
                    <input className="form-check-input position-static" type="radio" name="frequency" id="blankRadio1" value="1 month" aria-label="..." onClick={this.changeFrequency} />
                    <label className="form-check-label frequency-label" htmlFor="frequency">1 month</label>
                    <br />
                    <input className="form-check-input position-static" type="radio" name="frequency" id="blankRadio1" value="3 months" aria-label="..."  onClick={this.changeFrequency} />
                    <label className="form-check-label frequency-label" htmlFor="frequency">3 months</label>
                    <br />
                    <input className="form-check-input position-static" type="radio" name="frequency" id="blankRadio1" value="6 months" aria-label="..." onClick={this.changeFrequency} />
                    <label className="form-check-label frequency-label" htmlFor="frequency"> 6 months</label>
                </div>
            </div>
        );
    }
}

export default ChangeFrequency;