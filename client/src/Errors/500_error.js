import React from 'react';


function InternalServerError() {
    document.body.style.background = "white";
    return (
        <div className="container" style={{marginTop:200 + 'px', width: 450 + 'px'}}>
            <h1 style={{fontSize:30 + 'px', whiteSpace: 'nowrap', fontFamily: 'Arial'}}><span style={{fontSize:70 + 'px', fontWeight:'bold'}}>500</span> Internal Server Error</h1>
            <p style={{fontFamily: 'Arial'}}>Oops! Looks like something went wrong. Please contact the owner of the site.</p>
            <p style={{fontSize:18 + 'px'}}>Return to <a href="/">Arts and Crafts Supplies</a></p>
        </div>
    );
}

export default InternalServerError;