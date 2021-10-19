import { defaultPositions, noticeTypes } from '../constants/defaults';
const API_URL = process.env.MIX_API_URL;

export const validEmail = (email) => {
    if(!email) return false;
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
        return (true)
    }
    return (false)
}

export const validUrl = (url) => {
    if(!url) return false;

    let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(url)){
        return true;
    }
    return false;
}

export const validDateFormat = (date, format = 'YYYY/MM/DD') => {
    if(!date) return false;
    if(!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(date)) return false;

    if(isNaN(Date.parse(date))) return false;
    
    return true;
}

export const formattedDate = (date, format = 'yyyy/mm/dd') => {
    if(!date) return '';
    if(format === 'yy.mm.dd'){
        return date.slice(2, 4) + '.' + date.slice(5, 7) + '.' + date.slice(8, 10);
    }else{
        return date.slice(0,10).replace(/-/g, '/');
    }
}

export const fetchTags = (tagList) => {
    if(!tagList || !tagList.length) return [];
    let tags = tagList.map(t => {
        return t.tag;
    });

    return tags;
}

export const buildQuray = (data) => {
    if(typeof data !== 'object') return '';

    let query = '';
    Object.keys(data).forEach(key => {
        if(query) query += '&';
        else query += '?';

        if(data[key]) query += `${key}=${data[key]}`;
        else query += `${key}=`;
    });

    return query;
}

export const positionJoin = (position, hasCustom, customPosition) => {
    if(!position && (!hasCustom || !customPosition)) return '';

    let _position = defaultPositions.map(dp => {
        if(position[dp.key]) return dp.value;
        else return '';
    }).filter(p => !!p);

    if(hasCustom && customPosition) _position = [..._position, customPosition];

    if(_position.length) _position = _position.join(',');
    else _position = '';

    return _position;
}

export const positionSplit = (strPosition) => {
    let hasCustom = false;
    let customPosition = [];
    let position = {};

    if(strPosition){
        let _position = strPosition.split(',');

        _position.forEach((p) => {
            const _p = defaultPositions.find(d => d.value === p);
            if(_p){
                position[_p.key] = true;
            }else{
                customPosition.push(p);
            }
        });
    }

    if(customPosition.length){
        hasCustom = true;
        customPosition = customPosition.join(',');
    }

    return {position, hasCustom, customPosition};
}

export const getNoticeType = (key) => {
    let _notice = noticeTypes.find(t => t.key === key);
    if(_notice) return _notice.value;
    return '';
}

export const encodeStr = (text) => {
    return encodeURIComponent(encodeURIComponent(text));
}

export const decodeStr = (encode) => {
    return decodeURIComponent(decodeURIComponent(encode));
}

export const findSearchParam = (key, str) => {
    if(!key || !str) return '';
    let _str = str.slice(0, 1) === '?' ? str.slice(1) : str;
    let _arr = _str.split('&');
    
    let val = _arr.find(a => a.slice(0, key.length) === key);
    return val ? val.slice(key.length + 1) : '';
}

export const url = (link) => {
    return `${API_URL}/${link}`;
}

export const mapToForm = (data, files) => {
    let formData = new FormData();

    Object.keys(data).forEach(key => {
        if(data[key] && data[key] != null) formData.append(key, data[key]);
    });

    if(files.length){
        files.forEach(f => {
            if(f.type && f.type === 'Video') formData.append('video[]', f.file);
            else formData.append('image[]', f.file);
        })
    }

    return formData;
}

export const mapToKeyValue = (data, key, value) => {
    let _data = {};
    if(!data || !data.length) return _data;

    data.forEach(el => {
        _data[el[key]] = el[value];
    });

    return _data;
}

export const convertDateFormat = (date) => {
    try{
        let _date = new Date(date);
        return `${_date.getFullYear()}-${toFixedNumber(_date.getMonth() + 1, 2)}-${toFixedNumber(_date.getDate(), 2)}`;
    }catch(err){
        return '';
    }
}

export const convertDateTimeFormat = (date) => {
    
    try{
        let _date = Number(date);

        if(!_date) return '???';

        _date = new Date(_date);
        return `${_date.getFullYear()}-${toFixedNumber(_date.getMonth() + 1, 2)}-${toFixedNumber(_date.getDate(), 2)} 
                ${toFixedNumber(_date.getHours(), 2)}:${toFixedNumber(_date.getMinutes(), 2)}:${toFixedNumber(_date.getSeconds(), 2)}`;

    }catch(err){
        return '';
    }
}

export const revertDateFormat = (date) => {
    if(!date) return null;

    try{
        return new Date(date);
    }catch(err){
        return null;
    }
}

export const fileExtension = (str) => {
    if(!str || typeof str !== 'string') return '';
    let extension = str.toLowerCase().split('.').slice(-1);
    return extension?.[0] || '';
}

const toFixedNumber = (num, count) => {
    let prefix = '0000000000';
    num = prefix + num.toString();
    return num.slice(-count);
}
