import "./Home.css";
import { useContext, useRef } from "react";
import { FeedContext } from "../App";
import { Link } from "react-router-dom";
import { Carousel } from "../Carousel/Carousel.js";
import Wavify from "react-wavify";
import downArrowHome from "../images/downArrowHome.svg";
import wardrobeSvg from "../images/cabinetSvg.svg";
import paintPalletSvg from "../images/paintPalletSvg.svg";
import palletBar from "../images/spectrumBar.png";

export const Home = () => {
	// Extract images from feed context
	const { images, setSubPage } = useContext(FeedContext);

	// Create reference for viewport height
	const targetRef = useRef(null);

	// Define function that scrolls to the top of the first section
	const scrollToAggregation = () => {
		if (targetRef.current) {
			targetRef.current.scrollIntoView({
				behavior: "smooth",
				alignToTop: true,
			});
		}
	};

	return (
		<div className="Home">
			<div className="Home-Hero">
				<div className="Rel-Dummy">
					<div className="Hero-Overlay">
						<p className="Hero-Header">Outfit Generator</p>
						<p className="Hero-Subheader">
							{" "}
							Stylish fits from our image processing algorithm,
							<br />
							curated for you.
						</p>
						<Link
							to="/generator"
							onClick={() => {
								setSubPage("/generator");
							}}>
							<button className="Hero-Button">Jump In</button>
						</Link>
					</div>
				</div>
				<Carousel className="Hero-Background" images={images} />
			</div>
			<div className="How-It-Works-Wrap">
				<div className="How-It-Works-Intro-Panel">
					{" "}
					<img
						className="Down-Arrow-Home"
						src={downArrowHome}
						alt="Down Arrow"></img>
					<p
						className="How-It-Works-Header"
						onClick={() => {
							scrollToAggregation();
						}}>
						How It Works
					</p>
					<img
						className="Down-Arrow-Home"
						src={downArrowHome}
						alt="Down Arrow"></img>
				</div>
				<Wavify
					className="Wave-Panel-Interface"
					strokeWidth="0"
					fill="#c9ace1"
					options={{ height: 20, amplitude: 35, speed: 0.25 }}
				/>
				<div className="Step-One-Aggregation-Panel" ref={targetRef}>
					<p className="Step-One-Header">
						<span className="Step-Span">Step #1: </span>Building our
						Wardrobe
					</p>
					<img
						className="Step-One-Image"
						src={wardrobeSvg}
						alt="Step One"></img>
					<p
						className="Step-One-Text"
						style={{ letterSpacing: ".4px" }}>
						{" "}
						<span className="Bullet-Span">&bull; </span>A diverse
						and well-rounded wardrobe is the foundation for all{" "}
						<span className="Bullet-Text-Emph">
							stylish outfits
						</span>
					</p>
					<p
						className="Step-One-Text"
						style={{ letterSpacing: ".4px" }}>
						{" "}
						<span className="Bullet-Span">&bull; </span>Our program
						scours the internet for{" "}
						<span className="Bullet-Text-Emph">thousands</span> of
						tops, bottoms, and shoes daily
					</p>
					<p
						className="Step-One-Text"
						style={{ letterSpacing: ".4px" }}>
						{" "}
						<span className="Bullet-Span">&bull; </span>Those
						clothes build a dynamic wardrobe, with{" "}
						<span className="Bullet-Text-Emph">millions</span> of
						new combinations each day!
					</p>
				</div>
				<Wavify
					className="Wave-Panel-Interface-Two"
					strokeWidth="0"
					fill="#5d0b98"
					options={{ height: 20, amplitude: 35, speed: 0.25 }}
				/>
				<div className="Step-Two-Coloring-Panel">
					<p className="Step-Two-Header">
						{" "}
						<span className="Step-Span">Step #2: </span>Analyze our
						Clothes
					</p>
					<img
						className="Step-Two-Image"
						src={paintPalletSvg}
						alt="Step Two"></img>
					<p
						className="Step-Two-Text"
						style={{ letterSpacing: ".4px" }}>
						{" "}
						<span className="Bullet-Span-Two">&bull; </span>Before
						putting together any{" "}
						<span className="Bullet-Text-Emph-Two">outfits</span>,
						you have to understand the clothes you own{" "}
					</p>
					<p
						className="Step-Two-Text"
						style={{ letterSpacing: ".4px" }}>
						{" "}
						<span className="Bullet-Span-Two">&bull; </span>Our{" "}
						<span className="Bullet-Text-Emph-Two">
							image processing algorithm
						</span>{" "}
						finds and stores the most{" "}
						<span className="Bullet-Text-Emph-Two">
							prominent colors
						</span>{" "}
						from each item{" "}
					</p>
					<p
						className="Step-Two-Text"
						style={{ letterSpacing: ".4px" }}>
						{" "}
						<span className="Bullet-Span-Two">&bull; </span>Those
						colors allow our{" "}
						<span className="Bullet-Text-Emph-Two">algorithm</span>{" "}
						to make choices about which{" "}
						<span className="Bullet-Text-Emph-Two">
							clothes match eachother
						</span>
					</p>
					<img
						className="Spectrum-Bar"
						src={palletBar}
						alt="Bar"></img>
				</div>
			</div>
		</div>
	);
};
