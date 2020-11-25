import React, {Component} from 'react';

class CancelSubscription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: true,
            value: []
        }
    }

    render() {
        return (
            <div>
                <p className="all-subscriptions" onClick={(e) => {
                    e.target.classList.toggle('selected-subscriptions');
                    this.setState({selected: !this.state.selected});
                    
                    if(this.state.selected == true) {
                        this.state.value.push(this.props.category);
                    }else {
                        this.state.value.pop(this.props.category);
                    }
                    this.props.selected(this.state.value);

                }}>{this.props.category}</p>
            </div>
        );
    }
}

export default CancelSubscription;