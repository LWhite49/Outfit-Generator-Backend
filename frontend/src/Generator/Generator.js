import './Generator.css'
import { useContext, useState } from 'react';
import { FeedContext } from '../App';
import Switch from 'react-switch';
import maleIcon from '../images/maleIcon.svg';
import femaleIcon from '../images/femaleIcon.svg';

export const Generator = () => {
    // Source elements from provider
    const { outfitFeed, setSize, setBrand, setTopGender, setBottomGender, setShoeGender, topGender, bottomGender, shoeGender, size, brand} = useContext(FeedContext);
    
    // Define checked states for each slider
    const [topChecked, setTopChecked] = useState(false);
    const [bottomChecked, setBottomChecked] = useState(false);
    const [shoeChecked, setShoeChecked] = useState(false);

    // Define a function that accepts a gender and SetGender and toggles accordingly
    const toggleGender = (gender, setGender, setChecked) => {
        if (gender == "male") { 
            setGender("female");
            setChecked(true);
        }

        else {
            setGender("male");
            setChecked(false);
        }
    }

    // Define styles for the slider images
    const sliderImgMale = {
        height: "60%",
        width: "60%",
        padding: "5px"
    }

    const sliderImgFemale = {
        height: "60%",
        width: "60%",
        padding: "5px",
        paddingLeft: "7px"
    }
    return (
        <div className="Generator">
            <div className="Generator-Settings">
                <p className="Generator-Settings-Header">Generator Settings</p>
                <div className="Gender-Container">
                    <div className="Gender-Slider-Container">
                        <label forHTML="Top-Gender-Slider" className="Slider-Label">Top Gender:</label>
                        <Switch id="Top-Gender-Slider" onChange={() => {toggleGender(topGender, setTopGender, setTopChecked)}} checked={topChecked} offColor={"#6FAFEC"} onColor={"#F5B7C2"} uncheckedIcon={<img style={sliderImgMale} src={maleIcon} alt="M"/>} checkedIcon={<img style={sliderImgFemale} src={femaleIcon} alt="W"/>}></Switch>
                    </div>
                    <div className="Gender-Slider-Container">
                        <label forHTML="Bottom-Gender-Slider" className="Slider-Label">Bottom Gender:</label>
                        <Switch id="Bottom-Gender-Slider" onChange={() => {toggleGender(bottomGender, setBottomGender, setBottomChecked)}} checked={bottomChecked} offColor={"#6FAFEC"} onColor={"#F5B7C2"} uncheckedIcon={<img style={sliderImgMale} src={maleIcon} alt="M"/>} checkedIcon={<img style={sliderImgFemale} src={femaleIcon} alt="W"/>}></Switch>
                    </div>
                    <div className="Gender-Slider-Container">
                        <label forHTML="Shoe-Gender-Slider" className="Slider-Label">Shoe Gender:</label>
                        <Switch id="Shoe-Gender-Slider" onChange={() => {toggleGender(shoeGender, setShoeGender, setShoeChecked)}} checked={shoeChecked} offColor={"#6FAFEC"} onColor={"#F5B7C2"} uncheckedIcon={<img style={sliderImgMale} src={maleIcon} alt="M"/>} checkedIcon={<img style={sliderImgFemale} src={femaleIcon} alt="W"/>}></Switch>
                    </div>
                </div>
                <div className="Size-Container">
                    <div className="Size-Input-Container">
                        <p className="Size-Label">Top Sizes:</p>
                        <button className="Size-Button">All</button>
                        <button className="Size-Button">XS</button>
                        <button className="Size-Button">S</button>
                        <button className="Size-Button">M</button>
                        <button className="Size-Button">L</button>
                        <button className="Size-Button">XL</button>
                        <button className="Size-Button">XXL</button>
                    </div>
                    <p>Shoe Size:</p>
                </div>
                <div className="Brand-Container">
                    <p>Brand:</p>
                </div>
            </div>
            <div className="Display">
                {outfitFeed.map((outfit, index) => {
                    return (
                    <div key={index} className="Outfit">
                        <img src={outfit.top.productImg} alt="Top" className="TopDisplay" />
                        <img src={outfit.bottom.productImg} alt="Bottom" className="BottomDisplay"/>
                        <img src={outfit.shoes.productImg} alt="Shoes" className='ShoeDisplay'/>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}