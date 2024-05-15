import './TopDisplay.css';
// One individual itemDisplay Component will display that item by accepting an index state and a feed state
export const TopDisplay = (props) => {
    // Source the top item to display
    const topItem = props.item;

    return (
        <div className="TopDisplay">
            <div className="Color-Pallet">
                <div className="Color-Display-First" style={{backgroundColor: (topItem.productColors.length > 0 ? `#${topItem.productColors[0][2]}` : "red") }}></div>
                <div className="Color-Display" style={{backgroundColor: (topItem.productColors.length > 1 ? `#${topItem.productColors[1][2]}` : "orange") }}></div>
                <div className="Color-Display" style={{backgroundColor: (topItem.productColors.length > 2 ? `#${topItem.productColors[2][2]}` : "yellow") }}></div>
                <div className="Color-Display-Last" style={{backgroundColor: (topItem.productColors.length > 3 ? `#${topItem.productColors[3][2]}` : "blue") }}></div>
            </div>
            <img className="TopImage" src={topItem.productImg} alt="Top" onClick={() => {window.open(`${topItem.productListing}`)}}></img>
            <div className="Top-Display-Size-Container">
                <p className="Top-Display-Size-Text"> {topItem.productSize}</p>
            </div>
        </div>
    )
}