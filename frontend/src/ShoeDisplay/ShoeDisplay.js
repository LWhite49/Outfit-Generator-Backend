import './ShoeDisplay.css';
// One individual itemDisplay Component will display that item by accepting an index state and a feed state
export const ShoeDisplay = (props) => {
    // Source the top item to display
    const shoeItem = props.shoeItem;

    return (
        <div className="ShoeDisplay">
            <div className="ColorPalletWrap">
                <div className="ColorPallet">
                    <div className="ColorDisplay" style={{backgroundColor: (shoeItem.productColors.length > 0 ? `#${shoeItem.productColors[0][2]}` : "red") }}></div>
                    <div className="ColorDisplay" style={{backgroundColor: (shoeItem.productColors.length > 1 ? `#${shoeItem.productColors[1][2]}` : "orange") }}></div>
                    <div className="ColorDisplay" style={{backgroundColor: (shoeItem.productColors.length > 2 ? `#${shoeItem.productColors[2][2]}` : "yellow") }}></div>
                    <div className="ColorDisplay" style={{backgroundColor: (shoeItem.productColors.length > 3 ? `#${shoeItem.productColors[3][2]}` : "blue") }}></div>
                </div>
            </div>
            <img className="ShoeBackgroundImg" src={shoeItem.productImg} alt="Top"></img>
        </div>
    )
}