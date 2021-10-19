import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

const MobileFooter = () => {
    return (
        <div className="footer-container mobile">
            <div className="section-container">
                <div className="section text-center">
                    <img className="logo mb-2" src="/logo.png" height="20"/>
                    <p className="mb-4">음악가들의 크리에티브 파트너</p>
                    <p className="color-400">@2021 opcd All rights reserved</p>
                </div>
                
            </div>
        </div>
    )
}

export default MobileFooter;