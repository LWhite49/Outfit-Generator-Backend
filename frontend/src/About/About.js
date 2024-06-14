import "./About.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { FeedContext } from "../AppMain.js";
import aboutUs from "../images/aboutUs.svg";
import HTMLTagSvg from "../images/HTMLTag.svg";
import LWImg from "../images/LWImg.jpg";
import PAImg from "../images/PAImg.jpg";
import JLImg from "../images/JLImg.jpg";
import LinkedInImg from "../images/LinkedInImg.svg";
import GithubImg from "../images/GithubImg.svg";
import EmailImg from "../images/EmailImg.svg";
import mongoDBSvg from "../images/mongoDBSvg.svg";
import nodeJSSvg from "../images/nodeJSSvg.svg";
import imageProcessingSvg from "../images/imageProcessingSvg.svg";
import reactSvg from "../images/reactSvg.svg";

export const About = () => {
	// Source setSubpage from FeedContext
	const { setSubPage } = useContext(FeedContext);

	// Create a function that opens the video documentation in a new tab
	const openVideoDocumentation = () => {
		window.open(
			"https://youtu.be/od_PmtmMDV0?si=qvfHOexXgZe4G8vI",
			"_blank",
			"noopener,noreferrer"
		);
	};

	return (
		<div className="About">
			<div className="About-Intro-Panel">
				<img className="About-Image" src={aboutUs} alt="About Us" />
				<p className="About-Header">About Us</p>
			</div>
			<div className="About-Memo-Wrap">
				<div className="About-Memo-Panel">
					<p className="About-Memo">
						&bull; Outfit Generator was created by a team of{" "}
						<span className="About-Memo-Highlight">
							three undergraduate students
						</span>{" "}
						located in{" "}
						<span className="About-Memo-Highlight">
							Tampa, Florida
						</span>{" "}
						that got together and built a large-scale project to
						showcase our technical skills in{" "}
						<span className="About-Memo-Highlight">
							web development, database management, and data
							science
						</span>
					</p>
					<p className="About-Memo">
						&bull; Our vision for Outfit Generator is a way of{" "}
						<span className="About-Memo-Highlight">
							making fashion accessible
						</span>{" "}
						for everyone, while{" "}
						<span className="About-Memo-Highlight">
							promoting shopping secondhand
						</span>{" "}
						to combat the dangerous and wasteful trends of fast
						fashion flooding retail stores today{" "}
					</p>
					<p className="About-Memo">
						&bull; Thank you so much for using our website! If
						you're interested in how everything works on a technical
						level, please check out our comprehensive video
						documentation:{" "}
						<span
							className="Video-Documentation-Link"
							onClick={openVideoDocumentation}>
							Here
						</span>
					</p>
				</div>
			</div>
			<div className="Meet-The-Team-Panel">
				<p className="About-Header-Devs">Our Developers</p>
				<img
					className="About-Image-HTML"
					src={HTMLTagSvg}
					alt="HTML Tag"
				/>
				<div className="Dev-Display-Div">
					<div className="Dev-Display-Card">
						<img
							className="Dev-Display-Image"
							src={LWImg}
							alt="Developer"
						/>
						<p className="Dev-Display-Name">Logan White</p>
						<p className="Dev-Display-Role">
							Fullstack Development
						</p>
						<p className="Dev-Display-Role">Project Manager</p>
						<div className="Dev-Display-Links">
							<img
								onClick={() => {
									window.open(
										"https://www.linkedin.com/in/lwhite49",
										"_blank",
										"noopener,noreferrer"
									);
								}}
								className="Dev-Display-Link"
								src={LinkedInImg}
								alt="LinkedIn"
							/>
							<img
								onClick={() => {
									window.open(
										"https://github.com/LWhite49",
										"_blank",
										"noopener,noreferrer"
									);
								}}
								className="Dev-Display-Link"
								src={GithubImg}
								alt="Github"
							/>
							<img
								onClick={() => {
									window.open(
										"mailto:lwhite4965@outlook.com",
										"_blank",
										"noopener,noreferrer"
									);
								}}
								className="Dev-Display-Link"
								src={EmailImg}
								alt="Email"
							/>
						</div>
					</div>
					<div className="Dev-Display-Card">
						<img
							className="Dev-Display-Image"
							src={PAImg}
							alt="Developer"
						/>
						<p className="Dev-Display-Name">Patrick Aabram</p>
						<p className="Dev-Display-Role">Python Development</p>
						<p className="Dev-Display-Role">Machine Learning</p>
						<div className="Dev-Display-Links">
							<img
								onClick={() => {
									window.open(
										"https://www.linkedin.com/in/patrick-aabram/",
										"_blank",
										"noopener,noreferrer"
									);
								}}
								className="Dev-Display-Link"
								src={LinkedInImg}
								alt="LinkedIn"
							/>
							<img
								onClick={() => {
									window.open(
										"https://github.com/paabram",
										"_blank",
										"noopener,noreferrer"
									);
								}}
								className="Dev-Display-Link"
								src={GithubImg}
								alt="Github"
							/>
							<img
								onClick={() => {
									// window.open(
									// 	"mailto:lwhite4965@outlook.com",
									// 	"_blank",
									// 	"noopener,noreferrer"
									// );
								}}
								className="Dev-Display-Link"
								src={EmailImg}
								alt="Email"
							/>
						</div>
					</div>
					<div className="Dev-Display-Card">
						<img
							className="Dev-Display-Image"
							src={JLImg}
							alt="Developer"
						/>
						<p className="Dev-Display-Name-Long">Luke Lacsamana</p>
						<p className="Dev-Display-Role">Image Processing</p>
						<p className="Dev-Display-Role">
							Project Documentation
						</p>
						<div className="Dev-Display-Links">
							<img
								onClick={() => {
									window.open(
										"https://www.linkedin.com/in/luke-lacsamana/",
										"_blank",
										"noopener,noreferrer"
									);
								}}
								className="Dev-Display-Link"
								src={LinkedInImg}
								alt="LinkedIn"
							/>
							<img
								onClick={() => {
									window.open(
										"https://github.com/Ynot400",
										"_blank",
										"noopener,noreferrer"
									);
								}}
								className="Dev-Display-Link"
								src={GithubImg}
								alt="Github"
							/>
							<img
								onClick={() => {
									// window.open(
									// 	"mailto:lwhite4965@outlook.com",
									// 	"_blank",
									// 	"noopener,noreferrer"
									// );
								}}
								className="Dev-Display-Link"
								src={EmailImg}
								alt="Email"
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="Tech-Stack-Panel">
				<p className="About-Header-Devs">Tech Stack</p>
				<div
					className="Tech-Stack-Node"
					style={{ backgroundColor: "#FFDD99" }}>
					<p
						className="Tech-Stack-Node-Header"
						style={{ left: "-140px" }}>
						Database Management
					</p>
					<div className="Tech-Stack-Node-Text-Wrapper">
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							Our Database is populated with a Web Scraper that
							utilizes the Puppeteer NodeJS Library, sourcing
							around 300 articles per minute when active{" "}
						</p>
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							NoSQL Database is hosted on MongoDB for its flexible
							collection structure, as well as compatability with
							Mongoose and PyMongo{" "}
						</p>
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							Time to Live Indexes are used to automatically
							delete articles after two weeks, keeping the
							database fresh and up-to-date{" "}
						</p>
					</div>
					<img
						className="Tech-Stack-Node-Image"
						src={mongoDBSvg}
						alt="MongoDB"
					/>
				</div>
				<div
					className="Tech-Stack-Node"
					style={{ backgroundColor: "#BDE08F" }}>
					<p
						className="Tech-Stack-Node-Header"
						style={{ left: "-136px" }}>
						Backend Development
					</p>
					<div className="Tech-Stack-Node-Text-Wrapper">
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							Our Backend Server is built with the Express NodeJS
							Library, modeled as a RestAPI to handle real time
							data requests to serve the Outfit Feed{" "}
						</p>
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							All Image Processing and Machine Learning processes
							are handled in Python, utilizing the Child Process
							NodeJS Library to communicate between the two
							languages{" "}
						</p>
					</div>
					<img
						className="Tech-Stack-Node-Image"
						src={nodeJSSvg}
						alt="NodeJS"
					/>
				</div>
				<div
					className="Tech-Stack-Node"
					style={{ backgroundColor: "#80DBCD" }}>
					<p
						className="Tech-Stack-Node-Header"
						style={{ left: "-96px" }}>
						Image Processing
					</p>
					<div className="Tech-Stack-Node-Text-Wrapper">
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							Patrick Save me I don't know how this works{" "}
						</p>
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							Maybe it uses like Pandas or some shit? Maybe name
							drop some theorems used to apply the colors idk{" "}
						</p>
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							Why did we choose those Libraries man idfk{" "}
						</p>
					</div>
					<img
						className="Tech-Stack-Node-Image"
						src={imageProcessingSvg}
						alt="Processing"
					/>
				</div>
				<div
					className="Tech-Stack-Node"
					style={{ backgroundColor: "#BAA0B5" }}>
					<p
						className="Tech-Stack-Node-Header"
						style={{ left: "-96px" }}>
						Machine Learning
					</p>
					<div className="Tech-Stack-Node-Text-Wrapper">
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							Patrick Save me I don't know how this works{" "}
						</p>
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							What Libraries and Algos did we use{" "}
						</p>
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							Why did we use them and how do they work{" "}
						</p>
					</div>
					<img
						className="Tech-Stack-Node-Image"
						src={imageProcessingSvg}
						alt="Processing"
					/>
				</div>
				<div
					className="Tech-Stack-Node"
					style={{ backgroundColor: "#D08A90", height: "700px" }}>
					<p
						className="Tech-Stack-Node-Header"
						style={{ left: "-140px" }}>
						Frontend Development
					</p>
					<div className="Tech-Stack-Node-Text-Wrapper">
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							Our Website is built with ReactJS in order to
							utilize its component structuring, as well as the
							vast library of tools for both functionality and
							visual presentation{" "}
						</p>
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							The Frontend utilizes several industry standard
							Libraries like React Query and Axios to handle API
							Requests, and React Router DOM to handle App Routing{" "}
						</p>
						<p className="Tech-Stack-Node-Text">
							<span className="Tech-Stack-Bullet">&bull;</span>
							Open Source Styling Components like Wavify and Image
							Sliders are used in combination with traditional CSS
							Styling to achieve the desired UI/UX{" "}
						</p>
					</div>
					<img
						className="Tech-Stack-Node-Image"
						src={reactSvg}
						alt="Processing"
					/>
					<Link
						to="/generator"
						onClick={() => {
							window.scrollTo(0, 0);
							setSubPage("/generator");
						}}>
						<button className="Bottom-Call-To-Action">
							Back to Generator
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
