import React, { useState } from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';

import { nav_menus } from '../../routes/navigations';

const NavMenu = () => {
    const { path } = useRouteMatch();
    const history = useHistory();
    const [selected, setSelected] = useState(null);

    const handleClickedMenu = (menu) => {
        setSelected(selected === menu.headingLink ? null : menu.headingLink);
        if(menu.linkable){
            history.push(menu.headingLink);
        }
    }

    const handleClickedSubMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <ul className="nav-menu">
            {nav_menus.map((menu, index) => 
                <React.Fragment key={index}>
                    <li 
                        className={`
                            menu-item text-ttnorm-bd 
                            ${menu.headingLink && path && path.slice(0, menu.headingLink.length) === menu.headingLink ? 'selected' : ''} 
                            ${selected === menu.headingLink ? 'active' : '' }
                        `}
                        onClick={() => handleClickedMenu(menu)}
                    >
                        {menu.heading}
                        <div className="sub-menu" onClick={handleClickedSubMenu}>
                            <ul>
                                {menu.submenus.map((submenu, iindex) => 
                                    <li key={`item_${iindex}`} className="sub-menu-item">
                                        <Link to={submenu.link}>{submenu.title}</Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </li>
                    {nav_menus.length > index + 1 && <li className="divider"></li>}
                </React.Fragment>
            )}
        </ul>
    )
}

export default NavMenu;