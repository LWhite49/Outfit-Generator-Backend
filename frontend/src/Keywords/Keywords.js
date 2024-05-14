import './Keywords.css'
import { useState } from 'react'
import { useContext } from 'react'
import { FeedContext } from '../App'
import brandTag from '../images/brandTag.svg'
export const Keywords = () => {

    // Source brand and setBrand
    const { brand, setBrand } = useContext(FeedContext);

    // Define state for array of selected words and input text
    const [selectedWords, setSelectedWords] = useState([])
    const [inputText, setInputText] = useState('');

    // Define function that adds a word to the selectedWords array
    const addWord = (word) => {
        let internalWord = word.toLowerCase();
        setSelectedWords(selectedWords.filter(w => w !== internalWord));
        setSelectedWords([...selectedWords, internalWord]);
        setBrand([...brand, internalWord]);
    }
    const removeWord = (word) => { 
        setSelectedWords(selectedWords.filter(w => w !== word));
        setBrand([...brand.filter(w => w !== word)]);
         }

    const makeUppercase = (word) => {
        const words = word.split(' ');
        let putStr = "";
        for (let wordd of words) { putStr += wordd.charAt(0).toUpperCase() + wordd.slice(1) + " "; }
        putStr = putStr.slice(0, -1);
        return putStr;
    }


    return (
        <div className="Keywords">
            <div className="Keyword-Input-Div">
                <input className="Keyword-Input" type="text" value={inputText} onChange={(e) => { setInputText(e.target.value);}} 
                    onKeyDown={(e) => {if (e.key === 'Enter') {
                    addWord(inputText); 
                    setInputText('');}}}
                />
                <button className="Add-Button" onClick={() => {addWord(inputText); setInputText('');}}>Add</button>
            </div>
            <div className="Selected-Words">
                {selectedWords.map((word) => {
                return (
                <div className="Selected-Word-Div" onClick={() => removeWord(word)}>
                    <p className="Selected-Word" >{makeUppercase(word)}</p>
                    <img className="Brand-x-Tag" src={brandTag} alt="x"/>
                </div>      
                )})}
                
            </div>
        </div> 
    )

}