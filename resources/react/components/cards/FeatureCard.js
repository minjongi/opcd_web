import React from 'react';
import { useHistory } from 'react-router-dom';

import TagContainer from '../tag/TagContainer';
import { formattedDate, fetchTags, encodeStr } from '../../helpers/utils';

const FeatureCard = ({data, fullView}) => {
    const history = useHistory();
    const { id, title, image, author, created_at, tag, type, description } = data;

    return (
        <div className="event-card">
            <div className="card-image cursor-pointer"
                style={{backgroundImage: `url(${image})`}}
                onClick={() => {
                    history.push(`/feature_detail/${id}`)
                }}
            >
                {/* {type && type === 'MAGAZINE' && <div className="card-type feature">{type}</div>}
                {type && type === 'BEATBOX' && <div className="card-type beatbox">{type}</div>}
                {type && type === 'VINYL' && <div className="card-type vinyl">{type}</div>} */}
            </div>
            <div className="content-wrapper feature">
                <p className="label text-ttnorm-md">{formattedDate(created_at, 'yy.mm.dd')}</p>
                <p className="content two-line-truncate h-two-line">{title || ' '}</p>

                <div className="description two-line-truncate h-two-line">{description}</div>

                <div className="mt-2 tag-container truncate">
                    <TagContainer tags={fetchTags(tag)}/>
                    {/* {fetchTags(tag).map((t, index) =>
                        <span
                            key={index}
                            className="d-inline-block cursor-pointer back-primary mr-2 mb-1 px-1"
                            onClick={(e) => {
                                e.preventDefault();
                                history.push(`/search?kword=${encodeStr(t)}`)
                            }}
                        >{t}</span>
                    )} */}
                </div>
            </div>
        </div>
    )
}

export default FeatureCard;