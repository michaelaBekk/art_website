import React from 'react';
import './footer.css';

function Footer() {
    return (
        <div>
            <footer className="container-fluid">
                <div className="contact-container d-flex flex-column">
                    <h6 className="contact">Contact</h6>
                    <p className="address">8586 Bear Hill St. Norristown, PA 19401</p>
                    <p className="contact-email ">Email: ArtsandCraftsSuppliesACS@gmail.com</p> 
                </div>
                <div className="legal-terms d-flex flex-row justify-content-end">
                    <a className="terms" style={{color:'white'}} href="https://www.termsfeed.com/live/5b1df8b0-1829-4001-904f-4b5ca0b0063f" target="_blank">Terms of use</a>
                    <a className="privacy-cookies" style={{color:'white'}} href="https://www.privacypolicies.com/agreement/view/85740372f6fc2faefca85a2a4f161af6" target="_blank">Privacy &amp; Cookies</a> 
                    <p className="copyright">&copy; Arts and Crafts Supplies ACS</p>  
                </div>
            </footer>
        </div>
    )
}

export default Footer