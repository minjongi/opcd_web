import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from './Icon';
import { decodeStr } from '../helpers/utils';

const SearchBar = ({value, onChange, className, fromUrl}) => {
    const location = useLocation();
    const [text, setText] = useState(value);

    useEffect(() => {
        if(fromUrl){
            setText(decodeStr(location.search.slice(6)));
        }
    }, [location.search]);

    const handleChangeField = (e) => {
        const { value : _value } = e.target;
        setText(_value);

        if(!_value && value){
            onChange && onChange(_value);
        }
    }

    const handleKeyDown = (e) => {
        const { keyCode } = e;
        if(keyCode !== 13) return;
        if(value && value === text) return;

        onChange && onChange(text);
    }

    return (
        <div className={`search-bar ${className || ''}`}>
            <input
                placeholder="검색어 입력"
                value={text || ''}
                onChange={handleChangeField}
                onKeyDown={handleKeyDown}
            />
            <Icon className="right-icon" name={'search'} onClick={() => onChange && onChange(text)}/>
        </div>
    )
}

export default SearchBar;