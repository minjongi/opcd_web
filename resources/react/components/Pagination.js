import React from 'react';

import { Button } from '../components/form';

const Pagination = ({total, current = 1, className, variant, onChangePage}) => {
    const per = 10;

    const handlePrev = () => {
        if(current <= 1) return;
        onChangePage(current - 1);
    }

    const handleNext = () => {
        if(current >= total) return;
        onChangePage(current + 1);
    }

    const groupOffset = (num) => {
        return Math.floor((num - 1)/per) * per + 1;
    }

    const groupList = (num) => {
        let offset = groupOffset(num);
        return Array.from(Array(per).keys(), x => x + offset );
    }

    return (
        <div className={`op-pagination ${className} ${variant || ''}`}>
            <Button
                label="이전"
                className={`px-3 mr-1 font-14 page-button ${variant || ''}`}
                onClick={handlePrev}
            />
                {groupList(current || 1).map((d) => {
                    if(d > total) return null;
                    
                    return (
                        <span
                            key={d}
                            className={`page-item ${current === d ? 'selected' : ''}`}
                            onClick={() => onChangePage(d)}
                        >
                            {d}
                        </span>
                    )
                })}
            <Button
                label="다음"
                className={`px-3 ml-1 font-14 page-button ${variant || ''}`}
                onClick={handleNext}
            /> 
        </div>
    )
}

export default Pagination;