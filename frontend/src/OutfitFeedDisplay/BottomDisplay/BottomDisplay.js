import "./BottomDisplay.css";
import { useContext } from "react";
import { FeedContext } from "../../AppMain";
import { Tooltip } from "react-tooltip";
import reportSvg from "../../images/reportSvg.svg";
// One individual itemDisplay Component will display that item by accepting an index state and a feed state
export const BottomDisplay = (props) => {
	const { bottomGender, deleteOutfitMutation } = useContext(FeedContext);
	// Source the top item to display
	const bottomItem = props.item;
	const invis = props.invis || false;

	return (
		<div className={invis ? "BottomDisplayInvis" : "BottomDisplay"}>
			<div className="Color-Pallet">
				<div
					className="Color-Display-First"
					style={{
						backgroundColor:
							bottomItem.productColors.length > 0
								? `#${bottomItem.productColors[0][0]}`
								: "red",
					}}></div>
				<div
					className="Color-Display"
					style={{
						backgroundColor:
							bottomItem.productColors.length > 1
								? `#${bottomItem.productColors[1][0]}`
								: "orange",
					}}></div>
				<div
					className="Color-Display"
					style={{
						backgroundColor:
							bottomItem.productColors.length > 2
								? `#${bottomItem.productColors[2][0]}`
								: "yellow",
					}}></div>
				<div
					className="Color-Display-Last"
					style={{
						backgroundColor:
							bottomItem.productColors.length > 3
								? `#${bottomItem.productColors[3][0]}`
								: "blue",
					}}></div>
			</div>
			<img
				className="BottomImage"
				src={bottomItem.productImg}
				alt="Top"
				onClick={() => {
					window.open(`${bottomItem.productListing}`);
				}}
				loading="lazy"></img>
			<div className="Bottom-Display-Size-Container">
				<p className="Bottom-Display-Size-Text">
					{" "}
					{bottomItem.productSize}
				</p>
			</div>
			<button
				className="Report-Outfit-Button"
				data-tooltip-id="reportBottom"
				onClick={(e) => {
					// Define colleciton and source outfit ID
					const collection = bottomGender === "male" ? 1 : 4;
					const outfitID = bottomItem.productImg;
					// Call mutation to delete outfit
					deleteOutfitMutation.mutate({
						id: outfitID,
						collection: collection,
						item: bottomItem,
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
			<Tooltip id="reportBottom" effect="solid" content="Report Bottom" />
		</div>
	);
};
