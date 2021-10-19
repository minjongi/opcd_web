import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import PerfectScrollBar from 'react-perfect-scrollbar';

import Banner from '../../layout/Banner';
import { EventCard, FeatureCard } from '../../components/cards';
import { FeatureGallery, CircleFullSpinner } from '../../components';

import EventSection from '../Search/EventSection';
import FeatureSection from '../Search/FeatureSection';
import VideoSection from '../Search/VideoSection';

import { GetMainData, GetMainBanners } from '../../store/main/user_api';

const Main = () => {
    const [loading, setLoading] = useState(true);
    const [mainBanners, setMainBanners] = useState([]);
    const [homeData, setHomeData] = useState(null);

    useEffect(() => {
        updateMainBanner();
        updateHomeData();
    }, []);

    const updateMainBanner = () => {
        GetMainBanners().then(res => {
            setLoading(false);
            const { main_banners } = res.data;
            setMainBanners(main_banners);
        }).catch(err => {
            setLoading(false);
        });
    }

    const updateHomeData = () => {
        GetMainData().then(res => {
            const {status, ...data} = res.data;
            setHomeData(data);            
        });
    }

    return (
        <div id="main-page-content" className="mb-50p">
            
            {loading && <CircleFullSpinner size="full"/>}

            <Banner data={mainBanners}/>

            {/* {!!homeData?.events?.length &&
                <div className="section-container">
                    <h2 className="section-title text-ttnorm-bd">EVENT</h2>
                    <EventSection data={homeData.events} />
                </div>
            } */}

            {homeData && homeData.medium_banner && 
                <div className="section-container main-medium-banner">
                    <a href={homeData.medium_banner.link} target="_blank">
                        <img src={homeData.medium_banner.image} />
                    </a>
                </div>
            }
            
            {!!homeData?.features?.length &&
                <div className="section-container">
                    <h2 className="section-title text-ttnorm-bd">MAGAZINE</h2>
                    <FeatureSection data={homeData.features} />
                </div>
            }
            {!!homeData?.videos?.length && 
                <div className="section-container">
                    <h2 className="section-title text-ttnorm-bd">VIDEO</h2>
                    <VideoSection data={homeData.videos}/>
                </div>
            }
            
            {/* <div className="py-4"></div> */}
            {/* {homeData && homeData.bottom_banner &&
                <div className="section-container">
                    <a href={homeData.bottom_banner.link}>
                        <img className="main-bottom-banner" src={homeData.bottom_banner.image} />
                    </a>
                </div>
            } */}
        </div>
    )
}

export default Main;
