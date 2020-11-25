import React from 'react';


function NotFound() {
    document.body.style.background = "white";
    return (
        <div className="container" style={{marginTop:200 + 'px', width: 450 + 'px'}}>
            <h1 style={{fontSize:30 + 'px', whiteSpace: 'nowrap', fontFamily: 'Arial'}}><span style={{fontSize:70 + 'px', fontWeight:'bold'}}>404</span> Page Not Found</h1>
            <p style={{fontSize:18 + 'px'}}>Return to <a href="/">Arts and Crafts Supplies</a></p>
        </div>
    );
}

export default NotFound;