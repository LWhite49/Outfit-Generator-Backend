import "./Home.css";
import { useContext, useRef } from "react";
import { FeedContext } from "../App";
import { Link } from "react-router-dom";
import { Carousel } from "../Carousel/Carousel.js";
import downArrowHome from "../images/downArrowHome.svg";
import wardrobeSvg from "../images/cabinetSvg.svg";
import hangerSvg from "../images/hangerSvg.svg";

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
				<div className="How-It-Works-Intro-Pannel">
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
				<div className="Step-One-Aggregation-Pannel" ref={targetRef}>
					<p className="Step-One-Header">
						<span className="Step-Span">Step #1: </span>Building a
						Wardrobe
					</p>
					<img
						className="Hanger-Image"
						src={hangerSvg}
						alt="Hangar"></img>
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
			</div>
		</div>
	);
};
