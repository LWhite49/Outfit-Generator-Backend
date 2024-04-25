import "./Home.css";
import { useContext } from 'react';
import { FeedContext } from '../App';
import { Link } from 'react-router-dom';
import { Carousel } from '../Carousel/Carousel.js';

export const Home = () => {
    const { images, setSubPage } = useContext(FeedContext);
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
                <div className="Home-Header-Wrap">
                    <p className="Project-Scale-Header"> Temporary Header </p>
                </div>
                <p className="Project-Scale-Text"> <span style={{color:"#5D0B98", fontWeight:"800", marginRight: "16px"}}> &bull; </span> We will put some cool shit here later like an diagram or graphics or something explaining how it works. </p>
                <p className="Project-Scale-Text"> <span style={{color:"#5D0B98", fontWeight:"800", marginRight: "16px"}}> &bull; </span> Maybe step by step with a pannel for each step? Scraping, Image Processing, then Outfit Generation?</p>
            </div>
        </div>
    )
}