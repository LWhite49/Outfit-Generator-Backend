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

    // Define state for top size button rendering
    const [topSizeButtonState, setTopSizeButtonState] = useState({
        all: true,
        XS: false,
        S: false,
        M: false,
        L: false,
        XL: false,
        XXL: false
    });

    // Define state for bottom size button rendering
    const [bottomSizeButtonState, setBottomSizeButtonState] = useState({
        all: true,
        XS: false,
        S: false,
        M: false,
        L: false,
        XL: false,
        XXL: false
    });

    // Define a function that toggles the top size button state 
    const toggleTopSizeButton = (sizeStr) => {
        // Branch for if All button is picked
        if (sizeStr === "all") {
            if (topSizeButtonState["all"] === false) {
                setTopSizeButtonState({
                    all: true,
                    XS: false,
                    S: false,
                    M: false,
                    L: false,
                    XL: false,
                    XXL: false
                });
                setSize({...size, topSizes: []}); 
            }
        }
        // Branch for if any other button is picked
        else {
            if (topSizeButtonState[sizeStr] === false) {
                setTopSizeButtonState({...topSizeButtonState, all: false, [sizeStr]: true});
                setSize({...size, topSizes: [...size.topSizes, sizeStr]});
            }
            else {
                if (size.topSizes.length > 1) {
                    setTopSizeButtonState({...topSizeButtonState, all: false, [sizeStr]: false});
                    setSize({...size, topSizes: size.topSizes.filter((size) => size !== sizeStr)})
                }
                else {
                    setTopSizeButtonState({
                        all: true,
                        XS: false,
                        S: false,
                        M: false,
                        L: false,
                        XL: false,
                        XXL: false
                    });
                    setSize({...size, topSizes: []});
                }  
            }
        }
    }
    // Define a function that toggles the bottom size button state
    const toggleBottomSizeButton = (sizeStr) => {
        // Branch for if All button is picked
        if (sizeStr === "all") {
            if (bottomSizeButtonState["all"] === false) {
                setBottomSizeButtonState({
                    all: true,
                    XS: false,
                    S: false,
                    M: false,
                    L: false,
                    XL: false,
                    XXL: false
                });
                setSize({...size, bottomSizes: []}); 
            }
        }
        // Branch for if any other button is picked
        else {
            if (bottomSizeButtonState[sizeStr] === false) {
                setBottomSizeButtonState({...bottomSizeButtonState, all: false, [sizeStr]: true});
                setSize({...size, bottomSizes: [...size.bottomSizes, sizeStr]});
            }
            else {
                if (size.bottomSizes.length > 1) {
                    setBottomSizeButtonState({...bottomSizeButtonState, all: false, [sizeStr]: false});
                    setSize({...size, bottomSizes: size.bottomSizes.filter((size) => size !== sizeStr)})
                }
                else {
                    setBottomSizeButtonState({
                        all: true,
                        XS: false,
                        S: false,
                        M: false,
                        L: false,
                        XL: false,
                        XXL: false
                    });
                    setSize({...size, bottomSizes: []});
                }
            }
        }
    }
    return (
        <div className="Generator">
            <div className="Generator-Settings">
                <p className="Generator-Settings-Header">Generator Settings</p>
                <div className="Gender-Container">
                    <div className="Gender-Slider-Container">
                        <label forHTML="Top-Gender-Slider" className="Slider-Label">Top Style:</label>
                        <Switch id="Top-Gender-Slider" onChange={() => {toggleGender(topGender, setTopGender, setTopChecked)}} checked={topChecked} offColor={"#6FAFEC"} onColor={"#F5B7C2"} uncheckedIcon={<img style={sliderImgMale} src={maleIcon} alt="M"/>} checkedIcon={<img style={sliderImgFemale} src={femaleIcon} alt="W"/>}></Switch>
                    </div>
                    <div className="Gender-Slider-Container">
                        <label forHTML="Bottom-Gender-Slider" className="Slider-Label">Bottom Style:</label>
                        <Switch id="Bottom-Gender-Slider" onChange={() => {toggleGender(bottomGender, setBottomGender, setBottomChecked)}} checked={bottomChecked} offColor={"#6FAFEC"} onColor={"#F5B7C2"} uncheckedIcon={<img style={sliderImgMale} src={maleIcon} alt="M"/>} checkedIcon={<img style={sliderImgFemale} src={femaleIcon} alt="W"/>}></Switch>
                    </div>
                    <div className="Gender-Slider-Container">
                        <label forHTML="Shoe-Gender-Slider" className="Slider-Label">Shoe Style:</label>
                        <Switch id="Shoe-Gender-Slider" onChange={() => {toggleGender(shoeGender, setShoeGender, setShoeChecked)}} checked={shoeChecked} offColor={"#6FAFEC"} onColor={"#F5B7C2"} uncheckedIcon={<img style={sliderImgMale} src={maleIcon} alt="M"/>} checkedIcon={<img style={sliderImgFemale} src={femaleIcon} alt="W"/>}></Switch>
                    </div>
                </div>
                <div className="Size-Container">
                    <div className="Size-Input-Container">
                        <p className="Size-Label">Top Sizes:</p>
                        <button className={topSizeButtonState["all"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleTopSizeButton("all")}}>All</button>
                        <button className={topSizeButtonState["XS"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleTopSizeButton("XS")}}>XS</button>
                        <button className={topSizeButtonState["S"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleTopSizeButton("S")}}>S</button>
                        <button className={topSizeButtonState["M"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleTopSizeButton("M")}}>M</button>
                        <button className={topSizeButtonState["L"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleTopSizeButton("L")}}>L</button>
                        <button className={topSizeButtonState["XL"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleTopSizeButton("XL")}}>XL</button>
                        <button className={topSizeButtonState["XXL"] === true ? "Size-Button-Small-Selected" : "Size-Button-Small"} onClick={() => {toggleTopSizeButton("XXL")}}>XXL</button>
                    </div>
                    <div className="Size-Input-Container">
                        <p className="Size-Label">Bottom Sizes:</p>
                        <button className={bottomSizeButtonState["all"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("all")}}>All</button>
                        <button className={bottomSizeButtonState["XS"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("XS")}}>XS</button>
                        <button className={bottomSizeButtonState["S"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("S")}}>S</button>
                        <button className={bottomSizeButtonState["M"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("M")}}>M</button>
                        <button className={bottomSizeButtonState["L"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("L")}}>L</button>
                        <button className={bottomSizeButtonState["XL"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("XL")}}>XL</button>
                        <button className={bottomSizeButtonState["XXL"] === true ? "Size-Button-Small-Selected" : "Size-Button-Small"} onClick={() => {toggleBottomSizeButton("XXL")}}>XXL</button>
                    </div>
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