import React from 'react';
import { useHistory } from 'react-router-dom';
import { formattedDate, fetchTags, encodeStr } from '../../helpers/utils';

const FeatureGalleryCard = ({data, containerClassName}) => {
    const history = useHistory();
    const { id, title, image, tag, type, author, created_at } = data;

    return (
        <div className={`feature-gallery-card ${containerClassName || ''}`}>
            {image && 
                <div className="image-wrapper">
                    <img src={image} onClick={() => history.push(`/feature_detail/${id}`)}/>
                    {/* {type && type === 'MAGAZINE' && <div className="card-type feature">{type}</div>}
                    {type && type === 'BEATBOX' && <div className="card-type beatbox">{type}</div>}
                    {type && type === 'VINYL' && <div className="card-type vinyl">{type}</div>} */}
                </div>
            }
            <div className="content-wrapper">
                <p className="title two-line-truncate text-break">{title || ' '}</p>
                <div className="color-400 font-14">
                    {/* {author && <span>{author}</span>} */}
                    {/* {author && created_at && <span className="mx-2">ㅣ</span>} */}
                    {created_at && <span>{formattedDate(created_at)}</span>}
                </div>
                {tag &&  
                    <div className="mt-2 tag-container two-line-truncate">
                        {fetchTags(tag).map((t, index) =>
                            <span
                                key={index}
                                className="d-inline-block cursor-pointer back-primary text-white mr-2 mb-1 px-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    history.push(`/search?kword=${encodeStr(t)}`)
                                }}
                            >{t}</span>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}

export default FeatureGalleryCard;