import "./Home.css";
import { useContext } from 'react';
import { FeedContext } from '../App';
import { Link } from 'react-router-dom';
import { Carousel } from '../Carousel/Carousel.js';

export const Home = () => {
    const { outfitFeed, images, setSubPage } = useContext(FeedContext);
    return (
        <div className="Home">
            <div className="Home-Hero">
                <div className="Rel-Dummy">
                    <div className="Hero-Overlay">
                        <p className="Hero-Header">Outfit Generator</p>
                        <p className="Hero-Subheader"> Stylish fits from our image processing algorithm,<br/>curated for you.</p>
                        <Link to="/generator" onClick={() => {setSubPage("/generator")}}>
                            <button className="Hero-Button">Jump In</button>
                        </Link>
                    </div>   
                </div>
                <Carousel className="Hero-Background" images={images}/>
            </div>
            <div className="Project-Scale-Pannel">
                <p className="Project-Scale-Header"> Project Scale </p>
                <p className="Project-Scale-Text"> <span style={{color:"#5D0B98", fontWeight:"800", marginRight: "16px"}}> &bull; </span> This project was created by a team of 3 web developers from University of South Florida to demonstrate technical skills</p>
                <p className="Project-Scale-Text"> <span style={{color:"#5D0B98", fontWeight:"800", marginRight: "16px"}}> &bull; </span> Outfits are assembled piece by piece from a wardrobe of hundreds of thousands of clothes that updates daily  </p>
                <p className="Project-Scale-Text"> <span style={{color:"#5D0B98", fontWeight:"800", marginRight: "16px"}}> &bull; </span> Please hire me man I made a damn website t-t  </p>
            </div>
            <div className="The-Rundown-Pannel">
                <h2> What is this? </h2>
                <p> This is a simple outfit generator that uses a database of clothing items to create random outfits based on your preferences. </p>
            </div>
        </div>
    )
}