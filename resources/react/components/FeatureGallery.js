import React from 'react';
import Masonry from 'react-masonry-component';
import { FeatureGalleryCard } from './cards';


const FeatureGallery = ({data}) => {
    if(!data || !data.length) return null;
    
    return (
        <div className={`feature-gallery-container`}>
            <Masonry
                className="feature-gallery"
                options={{transitionDuration: 0}}//, fitWidth: true, columnWidth: 280}}
            >
                {data.map((d, index) => 
                    <div key={index} className="feature-gallery__item">
                        {/* <div className="feature-gallery-card"> */}
                            <FeatureGalleryCard data={d} containerClassName="m-auto"/>
                        {/* </div> */}
                    </div>
                )}
            </Masonry>
        </div>
    )
}

export default FeatureGallery;