import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';

import { Icon } from '../../components';
import UserMenu from './UserMenu';
import NavMenu from './NavMenu';

import { encodeStr, decodeStr, findSearchParam } from '../../helpers/utils';

const Header = () => {
    const history = useHistory();
    const location = useLocation();
    const [keyword, setKeyword] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        let _keyword = findSearchParam('kword', location.search);
        if(_keyword){
            setKeyword(decodeStr(_keyword));
        }
    }, [location]);

    const handleSearch = (e) => {
        const { value } = e.target;
        setKeyword(value);
    }

    const handleKeyPress = (e) => {
        if(e.charCode === 13) searchData();
    }

    const searchData = () => {
        if(!keyword) return;
        history.push(`/search?kword=${encodeStr(keyword)}`);
    }

    return (
        <div className="header">
            <div className="section-container">
                <div className="heading-section">
                    <Link to="/" >
                        <img className="logo" src="/logo.png" height="20"/>
                    </Link>
                    
                    <div className="user-menu">
                        <UserMenu showSearch={showSearch} toggleSearch={() => setShowSearch(!showSearch)}/>

                        <div className={`${showSearch ? 'active' : ''} header-search-box`}>
                            <input type="text" placeholder="검색어 입력" value={keyword} onChange={handleSearch} onKeyPress={handleKeyPress}/>
                            <span className="search-icon" onClick={searchData}>
                                <Icon className="right-icon" name={'search'}/>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="navigation-section">
                    <NavMenu />
                </div>
            </div>
        </div>
    );
}

export default Header;