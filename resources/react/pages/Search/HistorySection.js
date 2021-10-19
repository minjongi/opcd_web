import React from 'react';
import { useHistory } from 'react-router-dom';
import { highlightText } from './highlight';

const HistorySection = ({title, data, search}) => {
    const history = useHistory();
    if(!data || !data.length) return null;

    const highlightedData = () => {
        if(!search) return data;

        const _data = data.map(d => {
            return {
                ...d,
                title: highlightText(d.title, search),
                desc: highlightText(d.desc, search)
            }
        });
        return _data;
    }

    return (
        <div className="section">
            {title && <h4 className="font-weight-bold text-ttnorm-bd mb-4">{title}</h4>}
            {highlightedData().map((d, index) => 
                <div key={index} className="mb-3" onClick={() => history.push('/wmm_history')}>
                    <div className="font-18">{d.title}</div>
                    <div>{d.desc}</div>
                </div>
            )}
        </div>
    )
};

export default HistorySection;