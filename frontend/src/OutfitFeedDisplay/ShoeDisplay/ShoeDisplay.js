import './ShoeDisplay.css';
// One individual itemDisplay Component will display that item by accepting an index state and a feed state
export const ShoeDisplay = (props) => {
    // Source the top item to display
    const shoeItem = props.item;

    return (
        <div className="ShoeDisplay">
            <div className="Color-Pallet">
                <div className="Color-Display-First" style={{backgroundColor: (shoeItem.productColors.length > 0 ? `#${shoeItem.productColors[0][2]}` : "red") }}></div>
                <div className="Color-Display" style={{backgroundColor: (shoeItem.productColors.length > 1 ? `#${shoeItem.productColors[1][2]}` : "orange") }}></div>
                <div className="Color-Display" style={{backgroundColor: (shoeItem.productColors.length > 2 ? `#${shoeItem.productColors[2][2]}` : "yellow") }}></div>
                <div className="Color-Display-Last" style={{backgroundColor: (shoeItem.productColors.length > 3 ? `#${shoeItem.productColors[3][2]}` : "blue") }}></div>
            </div>
            <img className="ShoeImage" src={shoeItem.productImg} alt="Top" onClick={() => {window.open(`${shoeItem.productListing}`)}}></img>
            <div className="Shoe-Display-Size-Container">
                <p className="Shoe-Display-Size-Text"> {shoeItem.productSize}</p>
            </div>
        </div>
    )
}