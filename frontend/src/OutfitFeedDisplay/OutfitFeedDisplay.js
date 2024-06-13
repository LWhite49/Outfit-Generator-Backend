import "./OutfitFeedDisplay.css";
import { useContext } from "react";
import { FeedContext } from "../AppMain";
import { TopDisplay } from "./TopDisplay/TopDisplay";
import { BottomDisplay } from "./BottomDisplay/BottomDisplay";
import { ShoeDisplay } from "./ShoeDisplay/ShoeDisplay";
import feedButtonMax from "../images/waistMaxIcon.svg";
import feedButton from "../images/waistIncrementIcon.svg";
import thumbsUp from "../images/thumbsUp.svg";
import thumbsDown from "../images/thumbsDown.svg";

export const OutfitFeedDisplay = (props) => {
	// Source feed from provider
	const {
		outfitFeed,
		refetchExpandFeed,
		feedStatus,
		setFeedStatus,
		rateOutfitMutation,
		subPage,
	} = useContext(FeedContext);

	// Define variable for feedDisplayCount
	let displayCount = props.displayCount || 3;

	// Create a function that increments the feed index
	const incrementFeed = () => {
		setFeedStatus({
			feedLength: feedStatus.feedLength,
			currIndex: feedStatus.currIndex + 1,
		});
		if (feedStatus.currIndex + displayCount + 7 >= feedStatus.feedLength) {
			refetchExpandFeed();
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
					<div className="Outfit-Rating-Button-Container">
						<button
							className="Outfit-Rating-Button"
							onClick={(event) => {
								// Return if outfit has already been rated Pos recently
								if (
									event.target.classList.contains(
										"Outfit-Rating-Img-Pos-Clicked"
									)
								) {
									return;
								}
								// Call mutation to rate outfit
								rateOutfitMutation.mutate(
									outfitFeed.pallet[
										outfitFeed.outfits[
											feedStatus.currIndex + i
										].top
									].top.productColors,
									outfitFeed.pallet[
										outfitFeed.outfits[
											feedStatus.currIndex + i
										].bottom
									].bottom.productColors,
									outfitFeed.pallet[
										outfitFeed.outfits[
											feedStatus.currIndex + i
										].shoe
									].shoes.productColors,
									1
								);
								// Add class to img to signal rating
								event.target.classList.add(
									"Outfit-Rating-Img-Pos-Clicked"
								);
								// Remove the class in .5 seconds
								const likeTimeout = setTimeout(() => {
									// Check if the website is still on the same page, if not, clear the timeout
									if (subPage !== "/generator") {
										clearTimeout(likeTimeout);
									}
									// Remove the class
									event.target.classList.remove(
										"Outfit-Rating-Img-Pos-Clicked"
									);
									// Clear the timeout
									clearTimeout(likeTimeout);
								}, 500);
							}}>
							<img
								src={thumbsUp}
								alt="Rate-Pos"
								className="Outfit-Rating-Img-Pos"
							/>
						</button>
						<button
							className="Outfit-Rating-Button"
							onClick={(event) => {
								// Return if outfit has already been rated Neg recently
								if (
									event.target.classList.contains(
										"Outfit-Rating-Img-Neg-Clicked"
									)
								) {
									return;
								}
								// Call mutation to rate outfit
								rateOutfitMutation.mutate(
									outfitFeed.pallet[
										outfitFeed.outfits[
											feedStatus.currIndex + i
										].top
									].top.productColors,
									outfitFeed.pallet[
										outfitFeed.outfits[
											feedStatus.currIndex + i
										].bottom
									].bottom.productColors,
									outfitFeed.pallet[
										outfitFeed.outfits[
											feedStatus.currIndex + i
										].shoe
									].shoes.productColors,
									0
								);
								// Add class to img to signal rating
								event.target.classList.add(
									"Outfit-Rating-Img-Neg-Clicked"
								);
								// Remove the class in .5 seconds
								const dislikeTimeout = setTimeout(() => {
									// Check if the website is still on the same page, if not, clear the timeout
									if (subPage !== "/generator") {
										clearTimeout(dislikeTimeout);
									}
									// Remove the class
									event.target.classList.remove(
										"Outfit-Rating-Img-Neg-Clicked"
									);
									// Clear the timeout
									clearTimeout(dislikeTimeout);
								}, 500);
							}}>
							<img
								src={thumbsDown}
								alt="Rate-Neg"
								className="Outfit-Rating-Img-Neg"
							/>
						</button>
					</div>
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
