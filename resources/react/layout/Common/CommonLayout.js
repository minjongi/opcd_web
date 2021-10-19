import React from 'react';

import Header from './Header';
import Footer from './Footer';
import MobileFooter from './MobileFooter';

const CommonLayout = ({mainTheme, ...props}) => {
    return (
        <div className="common-layout">
            <Header />

            <div className={`page-container ${mainTheme || ''}`}>
                <div className="content">
                    {props.children}
                </div>
                <Footer/>
                <MobileFooter />
            </div>
        </div>
    )
}

export default CommonLayout;