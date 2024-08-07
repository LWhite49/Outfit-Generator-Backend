import "./TopDisplay.css";
import { useContext } from "react";
import { FeedContext } from "../../AppMain";
import { Tooltip } from "react-tooltip";
import reportSvg from "../../images/reportSvg.svg";

// One individual itemDisplay Component will display that item by accepting an index state and a feed state
export const TopDisplay = (props) => {
	const { topGender, deleteOutfitMutation } = useContext(FeedContext);
	// Source the top item to display
	const topItem = props.item;
	const invis = props.invis || false;

	return (
		<div className={invis ? "TopDisplayInvis" : "TopDisplay"}>
			<div className="Color-Pallet">
				<div
					className="Color-Display-First"
					style={{
						backgroundColor:
							topItem.productColors.length > 0
								? `#${topItem.productColors[0][0]}`
								: "red",
					}}></div>
				<div
					className="Color-Display"
					style={{
						backgroundColor:
							topItem.productColors.length > 1
								? `#${topItem.productColors[1][0]}`
								: "orange",
					}}></div>
				<div
					className="Color-Display"
					style={{
						backgroundColor:
							topItem.productColors.length > 2
								? `#${topItem.productColors[2][0]}`
								: "yellow",
					}}></div>
				<div
					className="Color-Display-Last"
					style={{
						backgroundColor:
							topItem.productColors.length > 3
								? `#${topItem.productColors[3][0]}`
								: "blue",
					}}></div>
			</div>
			<img
				className="TopImage"
				src={topItem.productImg}
				alt="Top"
				onClick={() => {
					window.open(`${topItem.productListing}`);
				}}
				loading="lazy"></img>
			<div className="Top-Display-Size-Container">
				<p className="Top-Display-Size-Text"> {topItem.productSize}</p>
			</div>
			<button
				className="Report-Outfit-Button"
				data-tooltip-id="reportTop"
				onClick={(e) => {
					// Define colleciton and source outfit ID
					const collection = topGender === "male" ? 0 : 3;
					const outfitID = topItem.productImg;
					// Call mutation to delete outfit
					deleteOutfitMutation.mutate({
						id: outfitID,
						collection: collection,
					});
					// Add class to report button to signal report
					e.target.classList.add("Report-Clicked");
					// Remove the class in .5 seconds
					const likeTimeout = setTimeout(() => {
						// Remove the class
						e.target.classList.remove("Report-Clicked");
						// Clear the timeout
						clearTimeout(likeTimeout);
					}, 500);
				}}>
				<img
					src={reportSvg}
					alt="Report"
					className="Report-Image"></img>
			</button>
			<Tooltip id="reportTop" effect="solid" content="Report Top" />
		</div>
	);
};
