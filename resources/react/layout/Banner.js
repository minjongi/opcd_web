import React from 'react';
import Slider from "react-slick";

import { Button } from '../components/form';
import { Icon } from '../components';

const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    // speed: 2000,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const Banner = ({data}) => {
    return (
        <div id="main-banner">
            <Slider {...settings}>
                {data.map((d, index) => 
                    <div key={index}>
                        <div className="banner-item" style={{backgroundImage: `url(${d.image || '/images/banner.jpg'})`}}>
                            <div className="banner-overlay">
                                <div className="section-container">
                                    <div className="section-block">
                                        <div className="content-wrapper">
                                            <div className="content">
                                                <a href={d.link || ''} target="_blank" className="text-white text-decoration-none">
                                                    <div className="title">{d.title}</div>
                                                    {d.description && <p className="description">{d.description}</p>}
                                                </a>
                                            </div>
                                            <div className="more-button-wrapper d-none d-sm-block">
                                                <a href={d.link || ''} target="_blank" className="text-decoration-none">
                                                    <Button
                                                        className="more-view-btn"
                                                        label={<span>MORE</span>}
                                                    />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="banner-dots">
                                            {data.map((dd, iindex) => 
                                                <span key={iindex} className={index === iindex ? 'active' : ''}></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Slider>
        </div>
    )
}

export default Banner;