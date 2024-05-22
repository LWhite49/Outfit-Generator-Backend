import './Generator.css'
import { useContext, useState } from 'react';
import { FeedContext } from '../App';
import Switch from 'react-switch';
import { Keywords } from '../Keywords/Keywords.js';
import maleIcon from '../images/maleIcon.svg';
import femaleIcon from '../images/femaleIcon.svg';
import waistSizeIncrementIcon from '../images/waistIncrementIcon.svg';
import waistSizeMax from '../images/waistMaxIcon.svg';
import { OutfitFeedDisplay } from '../OutfitFeedDisplay/OutfitFeedDisplay.js';

export const Generator = () => {
    // Source elements from provider
    const { setSize, setTopGender, setBottomGender, setShoeGender, topGender, bottomGender, shoeGender, size, windowWidth } = useContext(FeedContext);
    
    // Define checked states for each slider
    const [topChecked, setTopChecked] = useState(false);
    const [bottomChecked, setBottomChecked] = useState(false);
    const [shoeChecked, setShoeChecked] = useState(false);

    // Define a function that accepts a gender and SetGender and toggles accordingly
    const toggleGender = (gender, setGender, setChecked) => {
        if (gender === "male") { 
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

    // Define state for the waist size, which initializes as N/A
    const [waistSize, setWaistSize] = useState("---");

    // Define a function that accepts a bool, decrementing waist size if 0 and incrementing if 1
    const updateWaistSize = (bool) => {
        if (waistSize === 28 && bool === 0) { return; }
        if (waistSize === 44 && bool === 1) { return; }
        if (bool) {
            if (waistSize === "---") { 
                setWaistSize(32);
                setSize({...size, bottomSizes: [String(32)]}); 
            }
            else { 
                setWaistSize(Math.min(waistSize + 2, 44));
                setSize({...size, bottomSizes: [String(Math.min(waistSize + 2, 44))]});
            }
        }
        else {
            if (waistSize === "---") { 
                setWaistSize(32);
                setSize({...size, bottomSizes: [String(32)]});
             }
            else { 
                setWaistSize(Math.max(waistSize - 2, 28));
                setSize({...size, bottomSizes: [String(Math.max(waistSize - 2, 28))]}); 
            }
        }
        
        if (!isNaN(waistSize)) {
            setBottomSizeButtonState({
                all: false,
                XS: false,
                S: false,
                M: false,
                L: false,
                XL: false,
                XXL: false
            });
        }
    }
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
                setWaistSize("---"); 
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
    // Define state for the shoe size, which stores an interval of sizes
    const [shoeSizeRange, setShoeSizeRange] = useState([6, 15]);

    // Define a function that updates the shoe size range, where a passed 0 means the min size is updated and 1 means the max size is updated
    const updateShoeSizeRange = (event, bool) => {
        const input = Number(event.target.value);
        if (isNaN(input)) { return; }
        if (bool === 0) {
                let calcMin = Math.max(6, input);
                calcMin = Math.min(calcMin, shoeSizeRange[1] -.5);
                setShoeSizeRange([calcMin, shoeSizeRange[1]]);
        }
        else {
            let calcMax = Math.min(15, input);
            calcMax = Math.max(calcMax, shoeSizeRange[0] + .5);
            setShoeSizeRange([shoeSizeRange[0], calcMax]);
        }
        // Update the size state
        const shoeSizeArr = [];
        for (let i = shoeSizeRange[1]; i >= shoeSizeRange[0]; i-=.5) {
            shoeSizeArr.push(String(i));
        }
        setSize({...size, shoeSizes: shoeSizeArr});
    }

    // Define a state for the feed context which will be referenced by the feed components

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
                        <p className="Bottom-Size-Label">Bottom Sizes:</p>
                        <button className={bottomSizeButtonState["all"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("all")}}>All</button>
                        <button className={bottomSizeButtonState["XS"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("XS")}}>XS</button>
                        <button className={bottomSizeButtonState["S"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("S")}}>S</button>
                        <button className={bottomSizeButtonState["M"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("M")}}>M</button>
                        <button className={bottomSizeButtonState["L"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("L")}}>L</button>
                        <button className={bottomSizeButtonState["XL"] === true ? "Size-Button-Selected" : "Size-Button"} onClick={() => {toggleBottomSizeButton("XL")}}>XL</button>
                        <button className={bottomSizeButtonState["XXL"] === true ? "Size-Button-Small-Selected" : "Size-Button-Small"} onClick={() => {toggleBottomSizeButton("XXL")}}>XXL</button>
                        <div className="Waist-Container">
                            <p className="Waist-Size-Label">Waist (in.):</p>
                            <button className="Waist-Size-Down" onClick={() => {updateWaistSize(0)}}>
                                <img className="Waist-Size-Down-Icon" src={(waistSize === 28 ? waistSizeMax : waistSizeIncrementIcon)} alt="Decrease Waist Size"/>
                            </button>
                            <p className="Waist-Size-Display">{waistSize}</p>
                            <button className="Waist-Size-Up" onClick={() => {updateWaistSize(1)}}>
                                <img className="Waist-Size-Up-Icon" src={(waistSize === 44 ? waistSizeMax : waistSizeIncrementIcon)} alt="Increase Waist Size"/>
                            </button>
                        </div>
                    </div>
                    <div className="Size-Input-Container">
                        <p className='Size-Label'>Shoe Sizes:</p>
                        <p className="Waist-Size-Label">Min:</p>
                        <input type="text" className="Shoe-Size-Input" placeholder={shoeSizeRange[0]} onChange={(e) => updateShoeSizeRange(e, 0)}/>
                        <p className="Waist-Size-Label">Max:</p>
                        <input type="text" className="Shoe-Size-Input" placeholder={shoeSizeRange[1]} onChange={(e) => updateShoeSizeRange(e, 1)} />
                        <p className="Shoe-Size-Label"><span className="Shoe-Size-Range-Emph">{"["}</span>{shoeSizeRange[0]}<span className="Shoe-Size-Range-Emph">{","}</span>{shoeSizeRange[1]}<span className="Shoe-Size-Range-Emph">{"]"}</span></p>
                    </div>
                </div>
                <div className="Brand-Container">
                    <p className="Size-Label">Brand:</p>
                    <Keywords/>
                </div>
            </div>
            <OutfitFeedDisplay displayCount={Math.floor(windowWidth / 500)}/>
        </div>
    )
    }