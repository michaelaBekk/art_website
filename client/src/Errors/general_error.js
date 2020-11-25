import React from 'react';


function GeneralError() {
    document.body.style.background = "white";
    return (
        <div className="container" style={{marginTop:200 + 'px', width: 450 + 'px'}}>
            <h1 style={{fontSize:40 + 'px', whiteSpace: 'nowrap', fontWeight:'bold', fontFamily: 'Arial'}}> Error </h1>
            <p style={{fontFamily: 'Arial'}}>Oops! Looks like something went wrong on the server. Try again or contact the site owner if the problem persists.</p>
            <p style={{fontSize:18 + 'px'}}>Return to <a href="/">Arts and Crafts Supplies</a></p>
        </div>
    );
}

export default GeneralError;