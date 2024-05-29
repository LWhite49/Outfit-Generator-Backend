import "./Home.css";
import { useContext } from "react";
import { FeedContext } from "../App";
import { Link } from "react-router-dom";
import { Carousel } from "../Carousel/Carousel.js";
import downArrowHome from "../images/downArrowHome.svg";

export const Home = () => {
	const { images, setSubPage } = useContext(FeedContext);
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
					<p className="How-It-Works-Header">How It Works</p>
					<img
						className="Down-Arrow-Home"
						src={downArrowHome}
						alt="Down Arrow"></img>
				</div>
			</div>
		</div>
	);
};
