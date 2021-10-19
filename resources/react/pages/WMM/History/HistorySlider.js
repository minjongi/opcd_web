import React from 'react';
import Slider from "react-slick";
import { Icon } from '../../../components';



const NextArrow = ({ className, onClick }) => {
    return (
        <div className={`custom ${className}`} onClick={onClick}>
            <Icon name="rightArrow" />
        </div>
    );
}

const PrevArrow = ({ className, onClick }) => {
    return (
        <div className={`custom ${className}`} onClick={onClick}>
            <Icon name="leftArrow" />
        </div>
    );
}

const SliderItem = ({title, desc, image, link}) => {
    return (
        <a href={link || ''} target="_blank" className="history-slider__link">
            <div className="history-slider__item">
                <div className="slider-content">
                    <div className="title">{title}</div>
                    {desc && <p>{desc}</p>}
                </div>
                <div className="slider-image">
                    <div className="image" style={{backgroundImage: `url(${image})`}}/>
                </div>
            </div>
        </a>
    )
}

const HistorySlider = ({data}) => {
    if(!data || !data.length) return null;

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };

    return (
        <div className="history-slider">
            <Slider {...settings}>
                {data.map((d, index) => 
                    <SliderItem key={index} {...d}/>
                )}
            </Slider>
        </div>
    )
}

export default HistorySlider;