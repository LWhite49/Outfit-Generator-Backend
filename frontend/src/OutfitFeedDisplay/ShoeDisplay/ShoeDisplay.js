import "./ShoeDisplay.css";
// One individual itemDisplay Component will display that item by accepting an index state and a feed state
export const ShoeDisplay = (props) => {
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
		</div>
	);
};
