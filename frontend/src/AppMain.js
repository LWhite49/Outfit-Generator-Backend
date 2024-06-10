import "./AppMain.css";
import { Home } from "./Home/Home";
import { Generator } from "./Generator/Generator";
import { About } from "./About/About";
import { useState, createContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import logo from "./images/OGLogo.png";
import circle from "./images/circle.svg";
import loadingBuddy from "./images/LoadingBuddy.png";

//Import Images using require.context
const imageContext = require.context(
	"./images/CarouselImages",
	false,
	/\.(png|jpe?g|svg)$/
);
const imageContextKeys = imageContext.keys();
const images = imageContextKeys.map((key) => imageContext(key));

// Create a context for the outfitFeed array to avoid prop drilling
export const FeedContext = createContext();

// Create a query client for managing GET / POST requests

export const AppMain = () => {
	// Create a state for the outfitFeed array as well as a bool telling if the feed is randomly generated
	const [outfitFeed, setOutfitFeed] = useState([]);

	// Create state for feed status, used for conditional rendering and feed expansion
	const [feedStatus, setFeedStatus] = useState({
		feedLength: 20,
		currIndex: 0,
		expanded: false,
	});

	// Create a state for size, brand, and genders
	const [size, setSize] = useState({
		topSizes: [],
		bottomSizes: [],
		shoeSizes: [],
	});
	const [brand, setBrand] = useState([]);
	const [topGender, setTopGender] = useState("male");
	const [bottomGender, setBottomGender] = useState("male");
	const [shoeGender, setShoeGender] = useState("male");

	// Create a state for current subpage used for conditional rendering of navbar
	const [subPage, setSubPage] = useState("/home");

	// Create a state for the current width of the window
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	// Create a listener for window width changes
	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// Create a queryFn that fetches the outfitFeed from the server
	const fetchOutfitFeed = async () => {
		try {
			// Define target URL
			let url = `http://localhost:3500/generateOutfitFeed?size=${JSON.stringify(
				size
			)}&brand=${JSON.stringify(
				brand
			)}&topGender=${topGender}&bottomGender=${bottomGender}&shoeGender=${shoeGender}`;
			// Get the outfitFeed from the server
			console.log("Fetching Feed");
			let res = await axios.get(url);
			console.log("Feed Fetched");
			// Set the outfitFeed state
			setOutfitFeed(res.data);
		} catch (err) {
			console.log("Trouble Fetching outfitFeed:", err);
		}
	};
	// useQuery to fetch the outfitFeed from the server
	const { isLoading, isError } = useQuery({
		queryKey: [
			"outfitFeed",
			size,
			brand,
			topGender,
			bottomGender,
			shoeGender,
		],
		queryFn: fetchOutfitFeed,
		retry: 3,
		refetchOnWindowFocus: false,
	});

	// Define function that extends the feed by 20 outfits
	const expandFeed = async () => {
		try {
			let url = `http://localhost:3500/generateOutfitFeed?size=${JSON.stringify(
				size
			)}&brand=${JSON.stringify(
				brand
			)}&topGender=${topGender}&bottomGender=${bottomGender}&shoeGender=${shoeGender}`;
			let res = await axios.get(url);
			const diff = outfitFeed.pallet.length;
			const adjustedOutfits = res.data.outfits.map((outfit) => {
				outfit.top += diff;
				outfit.bottom += diff;
				outfit.shoe += diff;
				return outfit;
			});
			setOutfitFeed((prev) => ({
				pallet: prev.pallet.concat(res.data.pallet),
				outfits: prev.outfits.concat(adjustedOutfits),
			}));
			// console.log("Feed expanded");
		} catch (err) {
			console.log(err, "Error expanding feed");
		}
	};

	// useQuery to expand the feed
	const {
		isLoading: isLoadingExpand,
		isError: isErrorExpand,
		refetch: refetchExpandFeed,
	} = useQuery({
		queryKey: ["outfitFeedExpand"],
		queryFn: expandFeed,
		retry: 3,
		refetchOnWindowFocus: false,
		enabled: false,
	});
	// Object.keys(outfitFeed).length > 0
	return Object.keys(outfitFeed).length > 0 ? (
		<Router>
			<FeedContext.Provider
				value={{
					outfitFeed,
					setOutfitFeed,
					feedStatus,
					setFeedStatus,
					isLoading,
					isError,
					isLoadingExpand,
					isErrorExpand,
					refetchExpandFeed,
					images,
					setSubPage,
					setSize,
					setBrand,
					setTopGender,
					setBottomGender,
					setShoeGender,
					topGender,
					bottomGender,
					shoeGender,
					brand,
					size,
					windowWidth,
				}}>
				<div className="App">
					<div className="Navbar-Container">
						<div className="Navbar">
							<Link
								to="/"
								className={
									subPage === "/home"
										? "NavbarElem Selected"
										: "NavbarElem"
								}
								onClick={() => {
									setSubPage("/home");
								}}>
								{" "}
								Home{" "}
							</Link>
							<Link
								to="/generator"
								className={
									subPage === "/generator"
										? "NavbarElem Selected"
										: "NavbarElem"
								}
								onClick={() => {
									setSubPage("/generator");
								}}>
								{" "}
								Generator{" "}
							</Link>
							<Link
								to="/about"
								className={
									subPage === "/about"
										? "NavbarElem Selected"
										: "NavbarElem"
								}
								onClick={() => {
									setSubPage("/about");
								}}>
								{" "}
								About{" "}
							</Link>
						</div>
						<img className="NavbarLogo" src={logo} alt="Logo"></img>
					</div>
					<Routes>
						<Route path="/" element={<Home />}></Route>
						<Route
							path="/generator"
							element={<Generator />}></Route>
						<Route path="/about" element={<About />}></Route>
					</Routes>
				</div>
			</FeedContext.Provider>
		</Router>
	) : (
		<div className="App">
			<div className="Navbar-Container">
				<div className="Navbar">
					<img
						className="NavbarLogo-Loading"
						src={logo}
						alt="Logo"></img>
					<img
						className="Loading-Navbar-Circle"
						src={circle}
						style={{ animationDelay: "0.5s" }}
						alt=""></img>
					<img
						className="Loading-Navbar-Circle"
						src={circle}
						style={{ animationDelay: "0.25s" }}
						alt=""></img>
					<img
						className="Loading-Navbar-Circle"
						src={circle}
						alt=""></img>
				</div>
				<p className="Loading-Header">
					Our Fashionable Gnomes are building the website...
				</p>
				<img
					className="Loading-Spinner"
					src={loadingBuddy}
					alt="Loading Buddy"></img>
			</div>
		</div>
	);
};