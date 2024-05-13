import './TopDisplay.css';
// One individual itemDisplay Component will display that item by accepting an index state and a feed state
export const TopDisplay = (props) => {
    // Source the top item to display
    const topItem = props.topItem;

    return (
        <div className="TopDisplay">
            <div className="ColorPalletWrap">
                <div className="ColorPallet">
                    <div className="ColorDisplay" style={{backgroundColor: (topItem.productColors.length > 0 ? `#${topItem.productColors[0][2]}` : "red") }}></div>
                    <div className="ColorDisplay" style={{backgroundColor: (topItem.productColors.length > 1 ? `#${topItem.productColors[1][2]}` : "orange") }}></div>
                    <div className="ColorDisplay" style={{backgroundColor: (topItem.productColors.length > 2 ? `#${topItem.productColors[2][2]}` : "yellow") }}></div>
                    <div className="ColorDisplay" style={{backgroundColor: (topItem.productColors.length > 3 ? `#${topItem.productColors[3][2]}` : "blue") }}></div>
                </div>
            </div>
            <img className="TopBackgroundImg" src={topItem.productImg} alt="Top"></img>
        </div>
    )
}