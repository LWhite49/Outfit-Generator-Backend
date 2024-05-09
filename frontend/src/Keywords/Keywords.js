import './Keywords.css'
import { useState } from 'react'

export const Keywords = () => {
    // Define state for array of selected words and input text
    const [selectedWords, setSelectedWords] = useState([])
    const [inputText, setInputText] = useState('');

    // Define function that adds a word to the selectedWords array
    const addWord = (word) => {
        setSelectedWords(selectedWords.filter(w => w !== word));
        setSelectedWords([...selectedWords, word]);
    }
    const removeWord = (word) => { setSelectedWords(selectedWords.filter(w => w !== word)); }


    return (
        <div className="Keywords">
            <input className="Keyword-Input" type="text" value={""} onChange={(e) => {
                setInputText(e.target.value);
                if (e.key === "Enter") {addWord(inputText)}}}
            />
            <div className="Selected-Words">
                {selectedWords.map((word) => { return ( <p className="Selected-Word" onClick={() => removeWord(word)}>{word}</p> )}) }
            </div>
        </div> 
    )

}