import './About.css'

export const About = () => {
    return (
        <div className="About">
            <div className="Project-Scale-Pannel">
                <div className="Home-Header-Wrap">
                    <p className="Project-Scale-Header"> Project Scale </p>
                </div>
                <p className="Project-Scale-Text"> <span style={{color:"#5D0B98", fontWeight:"800", marginRight: "16px"}}> &bull; </span> Created by a team of <span className="Project-Scale-Text-Emph">3 web developers</span> at University of South Florida to demonstrate their technical skill</p>
                <p className="Project-Scale-Text"> <span style={{color:"#5D0B98", fontWeight:"800", marginRight: "16px"}}> &bull; </span> Utilizes <span className="Project-Scale-Text-Emph">noSQL databases</span>, image processing with <span className="Project-Scale-Text-Emph">machine learning</span>, and a REST API for <span className="Project-Scale-Text-Emph">fullstack development</span></p>
                <p className="Project-Scale-Text"> <span style={{color:"#5D0B98", fontWeight:"800", marginRight: "16px"}}> &bull; </span> Wardrobe updates daily so new outfits are generated every time you visit</p>
            </div>
        </div>
    )

}