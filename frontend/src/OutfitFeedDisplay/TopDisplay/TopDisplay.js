import './TopDisplay.css';
// One individual itemDisplay Component will display that item by accepting an index state and a feed state
export const TopDisplay = (props) => {
    // Source the top item to display
    const topItem = props.item;
    const invis = props.invis || false;

    return (
        <div className={ invis ? "TopDisplayInvis" : "TopDisplay"}>
            <div className="Color-Pallet">
                <div className="Color-Display-First" style={{backgroundColor: (topItem.productColors.length > 0 ? `#${topItem.productColors[0][0]}` : "red") }}></div>
                <div className="Color-Display" style={{backgroundColor: (topItem.productColors.length > 1 ? `#${topItem.productColors[1][0]}` : "orange") }}></div>
                <div className="Color-Display" style={{backgroundColor: (topItem.productColors.length > 2 ? `#${topItem.productColors[2][0]}` : "yellow") }}></div>
                <div className="Color-Display-Last" style={{backgroundColor: (topItem.productColors.length > 3 ? `#${topItem.productColors[3][0]}` : "blue") }}></div>
            </div>
            <img className="TopImage" src={topItem.productImg} alt="Top" onClick={() => {window.open(`${topItem.productListing}`)}}></img>
            <div className="Top-Display-Size-Container">
                <p className="Top-Display-Size-Text"> {topItem.productSize}</p>
            </div>
        </div>
    )
}