import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/form';
import { FormContentView } from '../../components/formBuilder';
import { GetApplicant } from '../../store/camp/api';

const WMMCampApplicantDetail = () => {
    const history = useHistory();
    const params = useParams();
    const [data, setData] = useState(null);
    const [formData, setFormData] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        if(params && params.id){
            GetApplicant(params.id).then(res => {
                const { applicant_content, user, campaign, ...rest } = res.data.data;
                setFormData(JSON.parse(applicant_content));
                setUser(user);
                setData(rest);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [params])

    return (
        <div className="pb-4">
            <h4 className="mb-5">신청내역</h4>

            <div>
                <p className="mb-1">신청번호: {data && data.applicant_id || ''}</p>
                <p className="mb-1">신청내역공개여부: {data && data.security === 'PUBLIC' ? '공개' : '비공개'}</p>
            </div>

            <div className="border-b mb-4 pb-4">
                <p className="font-14 mt-4 mb-2">신청자정보</p>
                <p className="mb-1">신청자명: {user.name || ''}</p>
                <p className="mb-1">이메일: {user.email || ''}</p>
                <p className="mb-1">휴대폰번호: {user.phone || ''}</p>
                <p className="mb-1">아티스트명: {user.artist_name || ''}</p>
            </div>
            
            <FormContentView data={formData}/>

            <div className="d-flex px-1 justify-content-center mt-5">
                <Button label={'돌아가기'} className="light px-5 mx-2" onClick={() => history.push('/admin/wmm_camp_applicants')}/>
            </div>
        </div>
    )
};

export default WMMCampApplicantDetail;