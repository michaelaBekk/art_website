import React, {Component} from 'react';


class ExpiredToken extends Component {
    constructor() {
        super();
    }

    render() {
        document.body.style.background = "white";
        return (
            <div className="container" style={{marginTop:200 + 'px', width: 450 + 'px'}}>
                <h1 style={{fontSize:30 + 'px', whiteSpace: 'nowrap', fontFamily: 'Arial'}}><span style={{fontSize:70 + 'px', fontWeight:'bold'}}>403</span> Access Denied</h1>
                <p style={{fontSize:18 + 'px'}}>Access to the requested resource is forbidden</p>
                <p style={{fontSize:18 + 'px'}}>Return to <a href="/">Arts and Crafts Supplies</a></p>
            </div>
        );
    }
}

export default ExpiredToken;