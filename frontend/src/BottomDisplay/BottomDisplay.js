import './BottomDisplay.css';
// One individual itemDisplay Component will display that item by accepting an index state and a feed state
export const BottomDisplay = (props) => {
    // Source the top item to display
    const bottomItem = props.bottomItem;

    return (
        <div className="BottomDisplay">
            <div className="ColorPalletWrap">
                <div className="ColorPallet">
                    <div className="ColorDisplay" style={{backgroundColor: (bottomItem.productColors.length > 0 ? `#${bottomItem.productColors[0][2]}` : "red") }}></div>
                    <div className="ColorDisplay" style={{backgroundColor: (bottomItem.productColors.length > 1 ? `#${bottomItem.productColors[1][2]}` : "orange") }}></div>
                    <div className="ColorDisplay" style={{backgroundColor: (bottomItem.productColors.length > 2 ? `#${bottomItem.productColors[2][2]}` : "yellow") }}></div>
                    <div className="ColorDisplay" style={{backgroundColor: (bottomItem.productColors.length > 3 ? `#${bottomItem.productColors[3][2]}` : "blue") }}></div>
                </div>
            </div>
            <img className="BottomBackgroundImg" src={bottomItem.productImg} alt="Top"></img>
        </div>
    )
}