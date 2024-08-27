import "./ShoeDisplay.css";
import { useContext } from "react";
import { FeedContext } from "../../AppMain";
import { Tooltip } from "react-tooltip";
import reportSvg from "../../images/reportSvg.svg";
// One individual itemDisplay Component will display that item by accepting an index state and a feed state
export const ShoeDisplay = (props) => {
	const { shoeGender, deleteOutfitMutation } = useContext(FeedContext);
	// Source the top item to display
	const shoeItem = props.item;
	const invis = props.invis || false;

	return (
		<div className={invis ? "ShoeDisplayInvis" : "ShoeDisplay"}>
			<div className="Color-Pallet">
				<div
					className="Color-Display-First"
					style={{
						backgroundColor:
							shoeItem.productColors.length > 0
								? `#${shoeItem.productColors[0][0]}`
								: "red",
					}}></div>
				<div
					className="Color-Display"
					style={{
						backgroundColor:
							shoeItem.productColors.length > 1
								? `#${shoeItem.productColors[1][0]}`
								: "orange",
					}}></div>
				<div
					className="Color-Display"
					style={{
						backgroundColor:
							shoeItem.productColors.length > 2
								? `#${shoeItem.productColors[2][0]}`
								: "yellow",
					}}></div>
				<div
					className="Color-Display-Last"
					style={{
						backgroundColor:
							shoeItem.productColors.length > 3
								? `#${shoeItem.productColors[3][0]}`
								: "blue",
					}}></div>
			</div>
			<img
				className="ShoeImage"
				src={shoeItem.productImg}
				alt="Top"
				onClick={() => {
					window.open(`${shoeItem.productListing}`);
				}}
				loading="lazy"></img>
			<div className="Shoe-Display-Size-Container">
				<p className="Shoe-Display-Size-Text">
					{" "}
					{shoeItem.productSize}
				</p>
			</div>
			<button
				className="Report-Outfit-Button"
				data-tooltip-id="reportShoe"
				onClick={(e) => {
					// Define colleciton and source outfit ID
					const collection = shoeGender === "male" ? 2 : 5;
					const outfitID = shoeItem.productImg;
					// Call mutation to delete outfit
					deleteOutfitMutation.mutate({
						id: outfitID,
						collection: collection,
						item: shoeItem,
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
			<Tooltip id="reportShoe" effect="solid" content="Report Shoe" />
		</div>
	);
};
