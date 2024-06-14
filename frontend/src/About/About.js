import "./About.css";
import aboutUs from "../images/aboutUs.svg";
import HTMLTagSvg from "../images/HTMLTag.svg";
import LWImg from "../images/LWImg.jpg";
import PAImg from "../images/PAImg.jpg";
import JLImg from "../images/JLImg.jpg";
import LinkedInImg from "../images/LinkedInImg.svg";
import GithubImg from "../images/GithubImg.svg";
import EmailImg from "../images/EmailImg.svg";
export const About = () => {
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
		</div>
	);
};
