import React, {Component} from 'react';
import Header from '../Navigation/header';
import Footer from '../Navigation/footer';
import './personalized_kit.css';
import { createBrowserHistory } from 'history';


export default class PersonalizedKit extends Component {
    constructor() {
        super();
        this.displayOptions = this.displayOptions.bind(this);
        this.chooseCategory = this.chooseCategory.bind(this);
        this.fiberOptions = this.fiberOptions.bind(this);
        this.paintingOptions = this.paintingOptions.bind(this);
        this.paperCraftsOptions = this.paperCraftsOptions.bind(this);
        this.dietarySelection = this.dietarySelection.bind(this);
        this.additionalDietarySelection = this.additionalDietarySelection.bind(this);
        this.frequency = this.frequency.bind(this);
        this.fragrances = this.fragrances.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            selected: 'Choose Category',
            secondQuestion: '',
            diet: [],
            other: '',
            fragrances: '',
            frequency: ''
        }
    }
    
// Choose a category
    displayOptions() {
        const dropdown = document.querySelector('.dropdown');
        dropdown.classList.toggle('show-dropdown');
    }
    fiberOptions() {
        const additionalFiberOptions = document.querySelector('.additional-fiber-options');
        additionalFiberOptions.classList.toggle('show-dropdown');
    }
    paintingOptions() {
        const additionalPaintingOptions= document.querySelector('.additional-painting-options');
        additionalPaintingOptions.classList.toggle('show-dropdown');
    }
    paperCraftsOptions() {
        const additionalPaperCraftsOptions = document.querySelector('.additional-paper-options');
        additionalPaperCraftsOptions.classList.toggle('show-dropdown');
    }

    chooseCategory(e) {
        const dropdown = document.querySelector('.dropdown');
        const dietaryRestrictions = document.querySelector('.dietary-restrictions-container');
        const additionalDietaryRestrictions = document.querySelector('.additional-dietary-restrictions')
        const candleAllergies = document.querySelector('.candle-allergies');
        const subscriptionContainer = document.querySelector('.subscription-container');
        this.setState({selected: e.target.value});
        dropdown.classList.remove('show-dropdown');
        subscriptionContainer.style.display = "block";
        if(e.target.value == 'Baking') {
            this.setState({secondQuestion: 'Do you have any dietary restrictions? Select all that apply.'})
            dietaryRestrictions.style.display = "block";
            additionalDietaryRestrictions.style.display = "block";
            candleAllergies.style.display = "";
        }else if(e.target.value == 'Candlemaking') {
            dietaryRestrictions.style.display = "";
            additionalDietaryRestrictions.style.display = "";
            this.setState({secondQuestion: "Are you allergic to any fragrances/candle ingredients?"})
            candleAllergies.style.display = "block";
        }else {
            this.setState({secondQuestion: ''})
            dietaryRestrictions.style.display = "";
            additionalDietaryRestrictions.style.display = "";
            candleAllergies.style.display = "";
        }
    }
   
    //Dietary Restriction Selection
    dietarySelection(e) {
        var value = this.state.diet.concat(e.target.innerHTML);
        this.setState({diet: value})
        e.target.classList.toggle('selected');
    }
    additionalDietarySelection(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    //Submit Button Apears upon frequency selection
    frequency(e) {
        const submitBtn = document.querySelector('.submit');
        submitBtn.style.display = "block";
        this.setState({frequency: e.target.value})
    }

    //Fragrance Allergies
    fragrances(e) {
        this.setState({fragrances: e.target.value})
    }

    //Send Letter
    async handleSubmit(event) {
        event.preventDefault();

        const history = createBrowserHistory();

        const first_name = localStorage.getItem('First Name');
        const last_name = localStorage.getItem('Last Name');

        const letter = {
            first_name,
            last_name,
            category: this.state.selected,
            diet: this.state.diet,
            other: this.state.other,
            fragrances: this.state.fragrances,
            frequency: this.state.frequency
        }

        const response = await fetch('/personalized-kit/subscription-payment', {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(letter)
        }).catch((err) => {
                if(err.response.status == 404) {
                    history.push('/error404/not_found');
                    window.location.reload();
                }else if(err.response.status == 500) {
                    history.push('/error500/internal_server_error');
                    window.location.reload();
                }else {
                    history.push('/error');
                    window.location.reload();
                }
            })
        
        const data = await response.json();

        if(data == 'No errors' && response.status == 200) {
            history.push('/personalized-kit/subscription-payment')
            window.location.reload();
            localStorage.setItem('Category', letter.category)
            localStorage.setItem('Frequency', letter.frequency)
 
            if(letter.category == 'Baking') {
                localStorage.setItem('Diet Restrictions', letter.diet + `,  ${letter.other}`)
            }else if(letter.category == 'Candlemaking') {
                localStorage.setItem('Fragrance Allergies', letter.fragrances)
            }else {
                return;
            }
        }
    }

    render() {
        document.body.style.background = "white";
        const first_name = localStorage.getItem('First Name');
        const last_name = localStorage.getItem('Last Name');
        return (
            <div>
                <Header />
                    <h2 className="instructions container" style={{width: 850 + "px"}}>Send us a letter and recieve a personalized kit of supplies</h2>
                    <form onSubmit={this.handleSubmit} className="container mx-auto" style={{width:950 + 'px'}} id="formBackground">
                        <p className="from">From: {first_name} {last_name}</p>
                        <img src="../images/post-stamp.png" className="post-stamp" alt="post stamp" />
                        <label id="first-question" className="questions">What type of arts and crafts are you interested in?</label>
                        <br />
                        <button type="button" className="select-type-btn" onClick={this.displayOptions}><span className="choose">{this.state.selected}</span><i className="fa fa-caret-down btn-arrow"></i></button>
                        <div name='Category' className="dropdown">
                            <option value="Baking" onClick={this.chooseCategory}>Baking</option>
                            <hr></hr>
                            <option value="Candlemaking" onClick={this.chooseCategory}>Candlemaking</option>
                            <hr></hr>
                            <option value="Drawing" onClick={this.chooseCategory}> Drawing</option>
                            <hr></hr>
                            <option value="Fashion" onClick={this.chooseCategory}> Fashion</option>
                            <hr></hr>
                            <option value="Fiber/Textile" onClick={this.fiberOptions}>Fiber/Textile</option>
                                <div className="additional-fiber-options">
                                    <option value="Applique" onClick={this.chooseCategory}> Applique </option>
                                    <option value="Crochet" onClick={this.chooseCategory}> Crochet </option>
                                    <option value="Embroidery" onClick={this.chooseCategory}> Embroidery </option>
                                    <option value="Felting" onClick={this.chooseCategory}> Felting </option>
                                    <option value="Knitting" onClick={this.chooseCategory}> Knitting </option>
                                    <option value="Lace Making" onClick={this.chooseCategory}> Lace Making </option>
                                    <option value="Macrame" onClick={this.chooseCategory}> Macrame </option>
                                    <option value="Rope Making" onClick={this.chooseCategory}> Rope Making </option>
                                    <option value="Rug Making" onClick={this.chooseCategory}> Rug Making </option>
                                    <option value="Sewing" onClick={this.chooseCategory}> Sewing </option>
                                    <option value="Spinning" onClick={this.chooseCategory}> Spinning </option>
                                    <option value="Stitch" onClick={this.chooseCategory}> Stitch </option>
                                    <option value="Tatting" onClick={this.chooseCategory}>Tatting</option>
                                    <option value="Weaving" onClick={this.chooseCategory}>Weaving</option>
                                </div>
                            <hr></hr>
                            <option value="Floral" onClick={this.chooseCategory}>Floral</option>
                            <hr></hr>
                            <option value="Gardening" onClick={this.chooseCategory}>Gardening</option>
                            <hr></hr>
                            <option value="Graffiti" onClick={this.chooseCategory}>Graffiti</option>
                            <hr></hr>
                            <option value="Jewelery" onClick={this.chooseCategory}>Jewelery</option>
                            <hr></hr>
                            <option value="Leatherwork" onClick={this.chooseCategory}>Leatherwork</option>
                            <hr></hr>
                            <option value="Metalwork" onClick={this.chooseCategory}>Metalwork</option>
                            <hr></hr>
                            <option value="Painting" onClick={this.paintingOptions}>Painting</option>
                            <div className="additional-painting-options">
                                <option value="Acrylic" onClick={this.chooseCategory}>Acrylic</option>
                                <option value="Enamel" onClick={this.chooseCategory}>Enamel</option>
                                <option value="Encaustic" onClick={this.chooseCategory}>Encaustic</option>
                                <option value="Gouache" onClick={this.chooseCategory}>Gouache</option>
                                <option value="Oil" onClick={this.chooseCategory}>Oil</option>
                                <option value="Tempera" onClick={this.chooseCategory}>Tempera</option>
                                <option value="Watercolor" onClick={this.chooseCategory}>Watercolor</option>
                            </div>
                            <hr></hr>
                            <option value="Paper Crafts" onClick={this.paperCraftsOptions}>Paper Crafts</option>
                                <div className="additional-paper-options">
                                    <option value="Bookbinding" onClick={this.chooseCategory}>Bookbinding</option>
                                    <option value="Calligraphy" onClick={this.chooseCategory}>Calligraphy</option>
                                    <option value="Decoupage" onClick={this.chooseCategory}>Decoupage</option>
                                    <option value="Origami" onClick={this.chooseCategory}>Origami</option>
                                    <option value="Papercutting" onClick={this.chooseCategory}>Papercutting</option>
                                    <option value="Paper Embossing" onClick={this.chooseCategory}>Paper Embossing</option>
                                    <option value="Papermaking" onClick={this.chooseCategory}>Papermaking</option>
                                    <option value="Paper Marbling" onClick={this.chooseCategory}>Paper Marbling</option>
                                    <option value="Parchment" onClick={this.chooseCategory}>Parchment</option>
                                    <option value=" Scrapbooking" onClick={this.chooseCategory}>Scrapbooking</option>
                                    <option value="Quilling" onClick={this.chooseCategory}>Quilling</option>
                                </div>
                            <hr></hr>
                            <option value="Pottery" onClick={this.chooseCategory}> Pottery</option>
                            <hr></hr>
                            <option value="Print" onClick={this.chooseCategory}>Print</option>
                            <hr></hr>
                            <option value="Sculpture" onClick={this.chooseCategory}>Sculpture</option>
                            <hr></hr>
                            <option value="Stonecraft" onClick={this.chooseCategory}>Stonecraft</option>
                            <hr></hr>
                            <option value="Woodwork" onClick={this.chooseCategory}>Woodwork</option>
                        </div>
                        <p id="second-question" className="questions">{this.state.secondQuestion}</p>
                        <div className="d-flex justify-content-between flex-wrap container">
                            <div className="dietary-restrictions-container">
                                <input className="form-check-input" name="diet" type="checkbox" value={this.state.diet} id="defaultCheck1" />
                                <label className="form-check-label" id="dietaryLabels" htmlFor="defaultCheck1" onClick={this.dietarySelection}>Milk/Lactose</label>
                                <input className="form-check-input" name="diet" type="checkbox" value={this.state.diet} id="defaultCheck1" />
                                <label className="form-check-label" id="dietaryLabels" htmlFor="defaultCheck1" onClick={this.dietarySelection}>Eggs</label>
                                <input className="form-check-input" name="diet" type="checkbox" value={this.state.diet} id="defaultCheck1" />
                                <label className="form-check-label" id="dietaryLabels" htmlFor="defaultCheck1" onClick={this.dietarySelection}>Peanuts/Tree Nuts</label>
                                <input className="form-check-input" name="diet" type="checkbox" value={this.state.diet} id="defaultCheck1" />
                                <label className="form-check-label" id="dietaryLabels" htmlFor="defaultCheck1" onClick={this.dietarySelection}>Gluten</label>
                                <input className="form-check-input" name="diet" type="checkbox" value={this.state.diet} id="defaultCheck1" />
                                <label className="form-check-label" id="dietaryLabels" htmlFor="defaultCheck1" onClick={this.dietarySelection}>Soybean</label>
                                <input className="form-check-input" name="diet" type="checkbox" value={this.state.diet} id="defaultCheck1" />
                                <label className="form-check-label" id="dietaryLabels" htmlFor="defaultCheck1" onClick={this.dietarySelection}>Dairy</label>
                                <input className="form-check-input" name="diet" type="checkbox" value={this.state.diet} id="defaultCheck1" />
                                <label className="form-check-label" id="dietaryLabels" htmlFor="defaultCheck1" onClick={this.dietarySelection}>Vegetarian/Vegan</label>
                                <input className="form-check-input" name="diet" type="checkbox" value={this.state.diet} id="defaultCheck1" />
                                <label className="form-check-label" id="dietaryLabels" htmlFor="defaultCheck1" onClick={this.dietarySelection}>Kosher</label>
                                <input className="form-check-input" name="diet" type="checkbox" value={this.state.diet} id="defaultCheck1" />
                                <label className="form-check-label" id="dietaryLabels" htmlFor="defaultCheck1" onClick={this.dietarySelection}>Paleo</label>
                                <input className="form-check-input" name="diet" type="checkbox" value={this.state.diet} id="defaultCheck1" />
                                <label className="form-check-label" id="dietaryLabels" htmlFor="defaultCheck1" onClick={this.dietarySelection} >Keto</label> 
                            </div>
                        </div>
                        <div className="additional-dietary-restrictions">
                            <label htmlFor="formGroupExampleInput" className="questions"> Did we miss anything? Other:</label>
                            <input type="text" name="other" className="form-control text" value={this.state.other} id="formGroupExampleInput" onChange={this.additionalDietarySelection} />
                        </div>
                        <div className="candle-allergies">
                            <textarea className="form-control" name="fragrances" id="exampleFormControlTextarea1" value={this.state.fragrances} onChange={this.fragrances} rows="3"></textarea>
                        </div>
                        <div className="subscription-container">
                            <p className="questions" id="third-question">How often would you like to recieve supplies?</p>
                            <div className="subscription-options d-flex justify-content-center">
                                <input className="form-check-input position-static radio" type="radio" name="frequency" id="blankRadio1" value="1 month" aria-label="..."  onClick={this.frequency} />
                                <label className="form-check-label frequency-label" htmlFor="frequency">1 month</label>
                                <input className="form-check-input position-static radio" type="radio" name="frequency" id="blankRadio1" value="3 months" aria-label="..." onClick={this.frequency} />
                                <label className="form-check-label frequency-label" htmlFor="frequency">3 months</label>
                                <input className="form-check-input position-static radio" type="radio" name="frequency" id="blankRadio1" value="6 months" aria-label="..." onClick={this.frequency} />
                                <label className="form-check-label frequency-label" htmlFor="frequency"> 6 months</label>
                            </div>
                            <button type="submit" className="submit">Send Letter</button>
                        </div>
                    </form>
                <Footer />
            </div>
        )
    }
}