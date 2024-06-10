import "./OutfitFeedDisplay.css";
import { useContext, useEffect } from "react";
import { FeedContext } from "../AppMain";
import { TopDisplay } from "./TopDisplay/TopDisplay";
import { BottomDisplay } from "./BottomDisplay/BottomDisplay";
import { ShoeDisplay } from "./ShoeDisplay/ShoeDisplay";
import feedButtonMax from "../images/waistMaxIcon.svg";
import feedButton from "../images/waistIncrementIcon.svg";
export const OutfitFeedDisplay = (props) => {
	// Source feed from provider
	const {
		outfitFeed,
		expandFeed,
		feedStatus,
		setFeedStatus,
		size,
		brand,
		topGender,
		bottomGender,
		shoeGender,
	} = useContext(FeedContext);

	// Define variable for feedDisplayCount
	let displayCount = props.displayCount || 3;

	// Create useEffect that sets sets the feedStatus to its default value each time outfitFeed is updated
	useEffect(() => {
		setFeedStatus({ feedLength: 20, currIndex: 0 });
	}, [size, brand, topGender, bottomGender, shoeGender, setFeedStatus]);

	// Create a function that increments the feed index
	const incrementFeed = () => {
		setFeedStatus({
			feedLength: feedStatus.feedLength,
			currIndex: feedStatus.currIndex + 1,
		});
		if (feedStatus.currIndex + displayCount + 7 >= feedStatus.feedLength) {
			expandFeed();
			setFeedStatus({
				feedLength: feedStatus.feedLength + 20,
				currIndex: feedStatus.currIndex + 1,
				expanded: true,
			});
		}
	};

	// Create a function that decrements the feed index
	const decrementFeed = () => {
		if (feedStatus.currIndex === 0) {
			return;
		}
		setFeedStatus({
			feedLength: feedStatus.feedLength,
			currIndex: feedStatus.currIndex - 1,
		});
	};

	// Create an array to iterate over when generating the feed
	const feedArray = [];
	for (let i = 0; i < displayCount; i++) {
		feedArray.push(i);
	}

	return (
		<div className="Outfit-Feed-Display">
			<button className="Outfit-Feed-Button" onClick={decrementFeed}>
				<img
					className="Outfit-Feed-Button-Left"
					src={
						feedStatus.currIndex === 0 ? feedButtonMax : feedButton
					}
					alt={"-"}
				/>
			</button>
			{feedArray.map((i, index) => (
				<div className="Outfit-Feed-Item" key={index}>
					<TopDisplay
						item={
							outfitFeed.pallet[
								outfitFeed.outfits[feedStatus.currIndex + i].top
							].top
						}
					/>
					<BottomDisplay
						item={
							outfitFeed.pallet[
								outfitFeed.outfits[feedStatus.currIndex + i]
									.bottom
							].bottom
						}
					/>
					<ShoeDisplay
						item={
							outfitFeed.pallet[
								outfitFeed.outfits[feedStatus.currIndex + i]
									.shoe
							].shoes
						}
					/>
				</div>
			))}
			<div className="Outfit-Feed-Item-Buffer">
				<TopDisplay
					item={
						outfitFeed.pallet[
							outfitFeed.outfits[
								feedStatus.currIndex + feedArray.length
							].top
						].top
					}
					invis={true}
				/>
				<BottomDisplay
					item={
						outfitFeed.pallet[
							outfitFeed.outfits[
								feedStatus.currIndex + feedArray.length
							].bottom
						].bottom
					}
					invis={true}
				/>
				<ShoeDisplay
					item={
						outfitFeed.pallet[
							outfitFeed.outfits[
								feedStatus.currIndex + feedArray.length
							].shoe
						].shoes
					}
					invis={true}
				/>
			</div>
			<button
				className="Outfit-Feed-Button-EndDiv"
				onClick={incrementFeed}>
				<img
					className="Outfit-Feed-Button-Right"
					src={
						feedStatus.currIndex + displayCount >
						feedStatus.feedLength - 1
							? feedButtonMax
							: feedButton
					}
					alt={"+"}
				/>
			</button>
		</div>
	);
};
