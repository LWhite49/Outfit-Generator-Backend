import './Generator.css'
import { useContext } from 'react';
import { FeedContext } from '../App';

export const Generator = () => {
    const { outfitFeed, requeryOutfitFeed } = useContext(FeedContext);

    return (
        <div className="Generator">
            <button onClick={requeryOutfitFeed}> Reload </button>
            <div className="Display">
                {outfitFeed.map((outfit, index) => {
                    return (
                    <div key={index} className="Outfit">
                        <img src={outfit.top.productImg} alt="Top" className="TopDisplay" />
                        <img src={outfit.bottom.productImg} alt="Bottom" className='BottomDisplay'/>
                        <img src={outfit.shoes.productImg} alt="Shoes" className='ShoeDisplay'/>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}