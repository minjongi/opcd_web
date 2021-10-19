import React from 'react';

const EmptyView = () => {
    return (
        <div className="text-center">
            <img src="/images/icons/search.png" style={{width: 80}}/>
            <h5 className="mt-4">검색결과가 없습니다.</h5>
        </div>
    )
};

export default EmptyView;