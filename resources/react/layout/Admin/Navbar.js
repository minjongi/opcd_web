import React from 'react';
import { useSelector } from 'react-redux';

import PerfectScrollbar from 'react-perfect-scrollbar';

import SidebarContent from "./SidebarContent";

const Navbar = () => {
    const mobileMenuShow = useSelector((state) => state.Layout.mobileMenuShow);

    return (
        <React.Fragment>
            <div className={`vertical-menu ${mobileMenuShow ? 'mobile-menu-show' : ''}`}>
                <div data-simplebar className="h-100">
                    <PerfectScrollbar>
                        <SidebarContent />
                    </PerfectScrollbar> 
                </div>
            </div>
        </React.Fragment>
    );
}

export default Navbar;
