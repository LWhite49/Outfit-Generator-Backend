import "./Home.css";
import { useContext } from 'react';
import { FeedContext } from '../App';
import { Link } from 'react-router-dom';
import { Carousel } from '../Carousel/Carousel.js';

export const Home = () => {
    const { outfitFeed, images } = useContext(FeedContext);
    return (
        <div className="Home">
            <div className="Home-Hero">
                <Carousel images={images}/>
            </div>
            <div className="Home-Hero">
                <h1> Home Page </h1>
                <Link to="/generator"> Generator </Link>
            </div>
            <div className="Home-WhatIsThis">
                <h2> What is this? </h2>
                <p> This is a simple outfit generator that uses a database of clothing items to create random outfits based on your preferences. </p>
                <p> Come Explore {outfitFeed.length} Outfits! </p>
            </div>
        </div>
    )
}