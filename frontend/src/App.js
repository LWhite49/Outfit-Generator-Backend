import './App.css';
import { Home } from './Home/Home';
import { Generator } from './Generator/Generator';
import { About } from './About/About';
import { useState, createContext, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import logo from './images/TempLogo.png';

//Import Images using require.context
const imageContext = require.context("./images/CarouselImages", false, /\.(png|jpe?g|svg)$/)
const imageContextKeys = imageContext.keys();
const images = imageContextKeys.map((key) => imageContext(key));

// Create a context for the outfitFeed array to avoid prop drilling
export const FeedContext = createContext();

// Create a query client for managing GET / POST requests
const client = new QueryClient();

function App() {

  // Create a state for the outfitFeed array
  const [outfitFeed, setOutfitFeed] = useState([]);

  // Create a state for size, brand, and genders
  const [size, setSize] = useState({topSizes: [], bottomSizes: [], shoeSizes: []});
  const [brand, setBrand] = useState([]);
  const [topGender, setTopGender] = useState("male");
  const [bottomGender, setBottomGender] = useState("male");
  const [shoeGender, setShoeGender] = useState("male");

  // Create a state for current subpage used for conditional rendering of navbar
  const [subPage, setSubPage] = useState("/home");

  // Create a useEffect that mounts the outfitFeed array from the server, and updates it when settings are changed
  useEffect(() => {
    // Define async funciton, since useaEffect cannot be async
    const updateFeed = async (size, brand, topGender, bottomGender, shoeGender) => {
    try {
      // Define target URL
      let url = `http://localhost:3500/generateOutfitFeed?size=${JSON.stringify(size)}&brand=${JSON.stringify(brand)}&topGender=${topGender}&bottomGender=${bottomGender}&shoeGender=${shoeGender}`;
      
      // Get the outfitFeed from the server
      let res = await axios.get(url);

      // Set the outfitFeed state
      setOutfitFeed(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  updateFeed(size, brand, topGender, bottomGender, shoeGender);
  }, [size, brand, topGender, bottomGender, shoeGender]);


  return (outfitFeed.length !== 0) ? (
    <QueryClientProvider client={client}>
      <Router>
        <FeedContext.Provider value={{outfitFeed, setOutfitFeed, images, setSubPage, setSize, setBrand, setTopGender, setBottomGender, setShoeGender, topGender, bottomGender, shoeGender, brand, size}}>
          <div className="App">
            <div className="Navbar-Container">
              <div className="Navbar">
                <Link to="/" className="NavbarElem" style={{color: (subPage === "/home") ? "#F5E7FF" : "white"}} onClick={() => {setSubPage("/home")}}> Home </Link>
                <Link to="/generator" className="NavbarElem" style={{color: (subPage === "/generator") ? "#F5E7FF" : "white"}} onClick={() => {setSubPage("/generator")}}> Generator </Link>
                <Link to="/about" className="NavbarElem" style={{color: (subPage ==="/about") ? "#F5E7FF" : "white"}} onClick={() => {setSubPage("/about")}}> About </Link>
              </div>
              <img className="NavbarLogo" src={logo} alt="Logo"></img>
            </div>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/generator" element={<Generator />}></Route>
              <Route path="/about" element={<About />}></Route>
            </Routes>
          </div>
        </FeedContext.Provider>
      </Router>
    </QueryClientProvider>
  ) : (<p> Loading </p>);
}

export default App;
