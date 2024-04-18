import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Carousel.css';
import _ from 'lodash'

export const Carousel = ({images}) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        draggable: false,
    };
    
    return (
        <div className="carousel">
            <Slider {...settings}>
                {_.shuffle(images).map((image, index) => {
                return (
                    <div key={index} >
                        <img src={image} alt="Hero Image" className="SlideImage" />
                    </div>
                )
                })}
            </Slider>
        </div>
    )
}