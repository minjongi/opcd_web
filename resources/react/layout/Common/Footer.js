import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { GetRecentNotices } from '../../store/notice/user_api';

const Footer = () => {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        checkRecentNotice();
		const timer = setInterval(() => checkRecentNotice(), 10000);
		return () => clearInterval(timer);
	}, []);

    const checkRecentNotice = () => {
        GetRecentNotices().then(res => {
            const { notices } = res.data;
            setNotices(notices);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className="footer-container desktop">
            <div className="section-container">
                <div className="section">
                    <div className="mb-10p">
                        <img className="logo" src="/logo.png" height="20"/>
                    </div>
                    <Row className="d-flex mb-50p">
                        <Col sm={4}>
                            <p className="mb-40p">음악가들의 크리에티브 파트너</p>
                            
                            <p className="footer-title mb-10p">오픈창동</p>
                            <p className="mb-40p">개인정보관리책임자 : 김호영</p>

                            <p className="mb-20p">주소 : 서울특별시 도봉구 마들로11길 74 1층 오픈창동</p>
                            <p>전화 : 02-994-7525~6 | 메일 : support@opcd.co.kr</p>
                        </Col>
                        <Col sm={4}>
                            <Row>
                                <Col>
                                    <Link to="/privacy_policy?type=use" className="mb-40p text-decoration-none">
                                        <p className="">이용약관</p>
                                    </Link>
                                    <Link to="/privacy_policy?type=personal" className="mb-40p text-decoration-none">
                                        <p className="">개인정보취급방침</p>
                                    </Link>
                                    <Link to="/faq" className="mb-40p text-decoration-none">
                                        <p className="">FAQ</p>
                                    </Link>            
                                </Col>
                                <Col>
                                    <p className="mb-30p">SNS 최신 소식</p>
                                    <div className="social-links">
                                        <a href="https://www.youtube.com/channel/UC2DD_CttcVgk9tf8-A4lkbw" target="_blank" className="mr-2">
                                            <img src="/images/sns/youtube_1.png" />
                                        </a>
                                        <a href="https://www.instagram.com/opcd.official" target="_blank" className="mr-2">
                                            <img src="/images/sns/instagram_1.png" />
                                        </a>
                                        <a href="https://www.facebook.com/openchangdong" target="_blank">
                                            <img src="/images/sns/facebook_1.png" />
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={4}>
                            <div className="d-flex justify-content-between align-items-center mb-36p">
                                <p className="mb-0">공지사항</p>
                                <Link to="/notices" className="more-notice">
                                    <p className="mb-0">더보기</p>
                                </Link>
                            </div>
                            <div className="notice-content">
                                <ul>
                                    {notices.map((notice, index) => 
                                        <li key={index} className={notice.type === 'NOTICE'? 'active' : ''}>
                                            <Link to={`/notice/${notice.id}`} className="notice-text">{notice.title}</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </Col>
                    </Row>
                    <p className="text-ttnorm-md text-center font-14 color-400">@2021 OPCD All rights reserved</p>
                </div>
            </div>
        </div>
    )
}

export default Footer;