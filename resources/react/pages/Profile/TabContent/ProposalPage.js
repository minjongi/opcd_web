import React, { useEffect, useState } from 'react';

import { Button } from '../../../components/form';

import { GetMyApplicants } from '../../../store/camp/user_api';

const ProposalPage = ({onSelect}) => {
    const [wmmApplicants, setWmmApplicants] = useState([]);
    const [beatboxApplicants, setBeatboxApplicants] = useState([]);
    const [vinylApplicants, setVinylApplicants] = useState([]);

    useEffect(() => {
        GetMyApplicants().then(res => {
            const { wmm_applicants, beatbox_applicants, vinyl_applicants } = res.data;
            setWmmApplicants(wmm_applicants);
            setBeatboxApplicants(beatbox_applicants);
            setVinylApplicants(vinyl_applicants);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    return (
        <div className="font-14 mb-5">
            <div className="border-b mb-3 pb-2">WMM</div>
            {wmmApplicants.map((item, index) => 
                <Button
                    key={index}
                    label={item.campaign && item.campaign.name || ''}
                    className="btn-outline mb-2 text-left right-arrow"
                    onClick={() => onSelect(item)}/>
            )}

            {/*<div className="border-b mb-3 mt-5 pb-2">BEATBOX</div>*/}
            {/*{beatboxApplicants.map((item, index) => */}
            {/*    <Button*/}
            {/*        key={index}*/}
            {/*        label={item.campaign && item.campaign.name || ''}*/}
            {/*        className="btn-outline mb-2 text-left right-arrow"*/}
            {/*        onClick={() => onSelect(item)}/>*/}
            {/*)}*/}

            <div className="border-b mb-3 mt-5 pb-2">VINYL</div>
            {vinylApplicants.map((item, index) => 
                <Button
                    key={index}
                    label={item.campaign && item.campaign.name || ''}
                    className="btn-outline mb-2 text-left right-arrow"
                    onClick={() => onSelect(item)}/>
            )}
        </div>
    )
}

export default ProposalPage;