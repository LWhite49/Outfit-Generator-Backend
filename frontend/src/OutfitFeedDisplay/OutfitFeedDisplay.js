import "./OutfitFeedDisplay.css"
import { useContext, useState, useEffect } from 'react';
import { FeedContext } from '../App';
import { TopDisplay } from './TopDisplay/TopDisplay';
import { BottomDisplay } from './BottomDisplay/BottomDisplay';
import { ShoeDisplay } from './ShoeDisplay/ShoeDisplay';
import feedButtonMax from '../images/waistMaxIcon.svg';
import feedButton from '../images/waistIncrementIcon.svg';
export const OutfitFeedDisplay = (props) => {
    // Source feed from provider
    const { outfitFeed, setOutfitFeed } = useContext(FeedContext);

    // Define variable for feedDisplayCount
    let displayCount = props.displayCount || 3;

    // Create state for feed status, used for conditional rendering and feed expansion
    const [feedStatus, setFeedStatus] = useState({feedLength: 20, currIndex: 0});

    // Create useEffect that sets sets the feedStatus to its default value each time outfitFeed is updated
    useEffect(() => {
        setFeedStatus({feedLength: 20, currIndex: 0});
    }, [outfitFeed]);

    // Create a function that expands the feed by 20 outfits
    const expandFeed = () => {
        setFeedStatus({feedLength: feedStatus.feedLength + 20, currIndex: feedStatus.currIndex});
        // setOutfitFeed(outfitFeed.concat());
    }

    // Create a function that increments the feed index
    const incrementFeed = () => {
        setFeedStatus({feedLength: feedStatus.feedLength, currIndex: feedStatus.currIndex + 1});
        if (feedStatus.currIndex + 4 >= feedStatus.feedLength) { expandFeed(); }
    }

    // Create a function that decrements the feed index
    const decrementFeed = () => { setFeedStatus({feedLength: feedStatus.feedLength, currIndex: feedStatus.currIndex - 1}); }

    return (
        <div className="Outfit-Feed-Display">
            <button className="Outfit-Feed-Button" onClick={decrementFeed}>
                <img className="Outfit-Feed-Button-Left" src={(feedStatus.currIndex === 0) ? feedButtonMax : feedButton} alt={"-"}/>
            </button>
            <div className="Outfit-Feed-Item">
                <TopDisplay item={outfitFeed.pallet[feedStatus.currIndex].top} />
                <BottomDisplay item={outfitFeed.pallet[feedStatus.currIndex].bottom} />
                <ShoeDisplay item={outfitFeed.pallet[feedStatus.currIndex].shoes} />
            </div>
            <div className="Outfit-Feed-Item">
                <TopDisplay item={outfitFeed.pallet[feedStatus.currIndex + 1].top} />
                <BottomDisplay item={outfitFeed.pallet[feedStatus.currIndex + 1].bottom} />
                <ShoeDisplay item={outfitFeed.pallet[feedStatus.currIndex + 1].shoes} />
            </div>
            {(displayCount < 3) ? null : 
            <div className="Outfit-Feed-Item">
                <TopDisplay item={outfitFeed.pallet[feedStatus.currIndex + 2].top} />
                <BottomDisplay item={outfitFeed.pallet[feedStatus.currIndex + 2].bottom} />
                <ShoeDisplay item={outfitFeed.pallet[feedStatus.currIndex + 2].shoes} />
            </div>}
            {(displayCount < 4) ? null : 
            <div className="Outfit-Feed-Item">
                <TopDisplay item={outfitFeed.pallet[feedStatus.currIndex + 3].top} />
                <BottomDisplay item={outfitFeed.pallet[feedStatus.currIndex + 3].bottom} />
                <ShoeDisplay item={outfitFeed.pallet[feedStatus.currIndex + 3].shoes} />
            </div>}
            <button className="Outfit-Feed-Button" onClick={incrementFeed}>
                <img className="Outfit-Feed-Button-Right" src={(feedStatus.currIndex + displayCount >= feedStatus.feedLength) ? feedButtonMax : feedButton} alt={"+"}/>
            </button>
            
            


        </div>
    )

}
