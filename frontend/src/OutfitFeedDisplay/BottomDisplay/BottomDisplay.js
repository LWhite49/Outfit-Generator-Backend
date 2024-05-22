import './BottomDisplay.css';
// One individual itemDisplay Component will display that item by accepting an index state and a feed state
export const BottomDisplay = (props) => {
    // Source the top item to display
    const bottomItem = props.item;

    return (
        <div className="BottomDisplay">
            <div className="Color-Pallet">
                <div className="Color-Display-First" style={{backgroundColor: (bottomItem.productColors.length > 0 ? `#${bottomItem.productColors[0][0]}` : "red") }}></div>
                <div className="Color-Display" style={{backgroundColor: (bottomItem.productColors.length > 1 ? `#${bottomItem.productColors[1][0]}` : "orange") }}></div>
                <div className="Color-Display" style={{backgroundColor: (bottomItem.productColors.length > 2 ? `#${bottomItem.productColors[2][0]}` : "yellow") }}></div>
                <div className="Color-Display-Last" style={{backgroundColor: (bottomItem.productColors.length > 3 ? `#${bottomItem.productColors[3][0]}` : "blue") }}></div>
            </div>
            <img className="BottomImage" src={bottomItem.productImg} alt="Top" onClick={() => {window.open(`${bottomItem.productListing}`)}}></img>
            <div className="Bottom-Display-Size-Container">
                <p className="Bottom-Display-Size-Text"> {bottomItem.productSize}</p>
            </div>
        </div>
    )
}