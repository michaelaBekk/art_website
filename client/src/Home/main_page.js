import React, {Component} from 'react';
import Footer from '../Navigation/footer';
import './main_page.css';
import Header from '../Navigation/header';


class MainPage extends Component {
    constructor(props) {
        super(props);
    }

  //Image Slide Show----------
    componentDidMount() {
        const images = document.querySelectorAll('img');
        let i=0;
        setInterval(() => {
                images[i].style.display = "none";
                if(i < images.length - 1) {
                    i++;
                }else {
                    i = 0;
                }
                images[i].style.display = "block";
            }, 3000); 
        
        }

    render() {
        document.body.style.background = "white";
    return (
            <div>
                <Header />
                <div className="container mx-auto" style={{width: 1200 + 'px'}}>
                    <h1 className= "title">Arts and Crafts Supplies</h1> 
                    <h3 className= "subtitle">World's largest variety of art supplies straight to your door</h3> 
                </div>
                <div className="image-container">
                    <div className="image-slides">
                        <img src="../images/paint-basics.jpg" />
                        <img src="../images/pastels-pantel.jpg" />
                        <img src="../images/sewing-kit.jpg" />
                        <img src="../images/pens.jpg" />
                        <img src="../images/pencils.jpg" />
                        <img src="../images/variation-supplies.jpg"  />
                        <img src="../images/texture-sticks.jpg" />
                        <img src="../images/canvas.jpg" />
                        <img src="../images/paint-brushes.jpg" />
                        <img src="../images/embroidery.jpg"/>
                    </div>
                </div>
        </div>
    );

    }
}

export default MainPage