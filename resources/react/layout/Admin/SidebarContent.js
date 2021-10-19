import React, { Component, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';

// MetisMenu
import MetisMenu from "metismenujs";
import { 
    admin_menus,
    member_menus,
    main_menus,
    feature_menus,
    wmm_menus,
    beatbox_menus,
    vinyl_menus
} from "../../routes/navigations";


const SidebarContent = () =>  {
    const user = useSelector((state) => state.userState);

    const location = useLocation();

    useEffect(() => {
        initMenu();
    }, [location]);

    const initMenu = () => {
        new MetisMenu("#side-menu");
    
        var matchingMenuItem = null;
        var ul = document.getElementById("side-menu");
        var items = ul.getElementsByTagName("a");
        
        for (var i = 0; i < items.length; ++i) {
            if (location.pathname === items[i].pathname) {
                matchingMenuItem = items[i];
                break;
            }
        }

        if (matchingMenuItem) {
            activateParentDropdown(matchingMenuItem);
        }
        
    }

    const activateParentDropdown = (item) => {

        item.classList.add('mm-active');
        const parent = item.parentElement;

        if (parent) {
            parent.classList.add('mm-active'); // li 
            const parent2 = parent.parentElement;

            if (parent2) {
                parent2.classList.add("mm-show");
              
                const parent3 = parent2.parentElement;

                if (parent3) {
                    parent3.classList.add('mm-active'); // li
                    parent3.childNodes[0].classList.add('mm-active'); //a
                    const parent4 = parent3.parentElement;
                    if (parent4) {
                        parent4.classList.add('mm-active');
                    }
                }
            }
            return false;
        }
        return false;
    }

    const selectMenues = () => {
        if(!user || !user.role) return [];
        // MEMBER, MAIN, MAGAZINE, WMM, BEATBOX, VINYL
        if(user.role === 'ADMIN') return admin_menus;
        if(user.role === 'MEMBER') return member_menus;
        if(user.role === 'MAIN') return main_menus;
        if(user.role === 'MAGAZINE') return feature_menus;
        if(user.role === 'WMM') return wmm_menus;
        if(user.role === 'BEATBOX') return beatbox_menus;
        if(user.role === 'VINYL') return vinyl_menus;

        return [];
    }
    
    return (
        <React.Fragment>
            <div id="sidebar-menu">
                <ul className="metismenu list-unstyled" id="side-menu">
                    { selectMenues().map((navigate, index) => {
                        
                        if(navigate.type === 'title')
                            return ( <li key={`title_${index}`} className="menu-title">{navigate.label}</li> );

                        return (
                            <li key={`menu_${index}`}>
                                <Link to={navigate.link} className={`${!!navigate.submenu && 'has-arrow'} waves-effect`}>
                                    <span>{navigate.label}</span>
                                </Link>

                                { !!navigate.submenu && 
                                    <ul className="sub-menu" aria-expanded="false">
                                        {navigate.submenu.map((submenu, i) => 
                                            <li key={`submenu_${i}`}><Link to={submenu.link}>{submenu.label}</Link></li>
                                        )}
                                    </ul>
                                }
                            </li>
                        )
                    })}
                </ul>
            </div>
        </React.Fragment>
    );
}

// const mapStatetoProps = state => {
//     const { is_toggle, leftSideBarType, layoutType, leftSideBarTheme, layoutWidth, topbarTheme, isPreloader } = state.Layout;
//     return {  is_toggle, leftSideBarType, layoutType, leftSideBarTheme, layoutWidth, topbarTheme, isPreloader };
// }

export default SidebarContent;
