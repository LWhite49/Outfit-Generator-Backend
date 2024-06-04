import "./OutfitFeedDisplay.css";
import { useContext, useEffect } from "react";
import { FeedContext } from "../App";
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
		if (feedStatus.currIndex + displayCount + 5 >= feedStatus.feedLength) {
			setFeedStatus({
				feedLength: feedStatus.feedLength + 20,
				currIndex: feedStatus.currIndex + 1,
				expanded: true,
			});
			expandFeed();
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
						item={outfitFeed.pallet[feedStatus.currIndex + i].top}
					/>
					<BottomDisplay
						item={
							outfitFeed.pallet[feedStatus.currIndex + i].bottom
						}
					/>
					<ShoeDisplay
						item={outfitFeed.pallet[feedStatus.currIndex + i].shoes}
					/>
				</div>
			))}
			<div className="Outfit-Feed-Item-Buffer">
				<TopDisplay
					item={
						outfitFeed.pallet[
							feedStatus.currIndex + feedArray.length
						].top
					}
					invis={true}
				/>
				<BottomDisplay
					item={
						outfitFeed.pallet[
							feedStatus.currIndex + feedArray.length
						].bottom
					}
					invis={true}
				/>
				<ShoeDisplay
					item={
						outfitFeed.pallet[
							feedStatus.currIndex + feedArray.length
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
