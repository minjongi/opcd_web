import React from 'react';
import { useHistory } from 'react-router-dom';
import { highlightHtml } from './highlight';

const CampaignSection = ({title, type, data, search}) => {
    const history = useHistory();
    if(!data || !data.length) return null;

    const handleClicked = () => {
        if(type === "wmm"){
            history.push('/wmm_songcamp');
        }else if(type === "beatbox"){
            history.push('/beatbox_program');
        }else{
            history.push('/vinyl_program');
        }
    }

    return (
        <div className="section">
            {title && <h4 className="font-weight-bold text-ttnorm-bd mb-4">{title}</h4>}
            <div>
                {data.map((d, index) => 
                    <div key={index} className="html-content mb-3"  onClick={handleClicked} dangerouslySetInnerHTML={{__html: highlightHtml(d.description, search)}} />
                )}
            </div>
        </div>
    )
};

export default CampaignSection;