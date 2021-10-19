import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import { TextInput, Button, RadioBox, CheckBox } from '../../components/form';
import { FileUploader, SmartEditor, TagItem, ImagePreview, CircleFullSpinner } from '../../components';
import { REQUIRED, INVALID } from '../../constants/validation';
import { validUrl, fetchTags } from '../../helpers/utils';
import { toast } from 'react-toastify';



import { FormFactory } from '../../components/formBuilder';

import { PostApplicant, GetApplicant } from '../../store/camp/api';

const defaultData = {
    title: '',
    link: '',
    tag: ''
}

const BBCampApplicant = () => {
    const history = useHistory();
    const params = useParams();
    const [submitting, setSubmitting] = useState(false);
    const [security, setSecurity] = useState('PUBLIC');
    const [data, setData] = useState(defaultData);
    const [formData, setFormData] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        if(params && params.id){
            GetApplicant(params.id).then(res => {
                const { created_at, applicant_content, security, user, campaign, ...rest } = res.data.data;
                setSecurity(security);
                setFormData(JSON.parse(applicant_content));
                setUser(user);
                setData(rest);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [params])

    const handleSubmit = () => {
        if(submitting) return;
        setSubmitting(true);

        const _data = {
            ...data,
            security,
            applicant_content: JSON.stringify(formData)
        };

        PostApplicant(data.id, _data)
            .then(res => {
                setSubmitting(false);
                toast.success('신청내역이 업데이트 되였습니다.');
                history.push('/admin/beatbox_camp_applicants');
            }).catch(err => {
                setSubmitting(false);
            })
    }

    const handleChangeForm = (index, field) => {
        let _data = [...formData];
        _data.splice(index, 1, field);
        setFormData(_data);
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">신청내역</h4>

            <div className="inline-group md-block mb-3">
                <div className="w-10-rem mt-2">신청번호*</div>
                <div className="flex-full max-w-20">{data.applicant_id}</div>
            </div>

            <form>
                <div className="d-flex align-items-center mt-4">
                    <label className="font-14 mr-5">신청내역공개여부</label>
                    <RadioBox
                        label="공개"
                        id="public"
                        name="security"
                        className="font-14 mr-4"
                         value="PUBLIC"
                         checked={security === 'PUBLIC'}
                         onChange={(e) => setSecurity('PUBLIC')}/>
                    <RadioBox
                        label="비공개"
                        id="private"
                        className="font-14 mr-4"
                        name="security"
                        value="PRIVATE"
                        checked={security === 'PRIVATE'}
                        onChange={(e) => setSecurity('PRIVATE')}/>
                </div>

                <label className="font-14 mt-4">신청자정보</label>
                <Row>
                    <Col sm={6}>
                        <TextInput className="light readonly" id="email" name="email" value={user && user.email} readOnly/>
                    </Col>
                    <Col sm={6}>
                        <TextInput className="light readonly" id="phone" name="phone" value={user && user.phone} readOnly/>
                    </Col>
                    <Col sm={6}>
                        <TextInput className="light readonly" id="name" name="name" value={user && user.name} readOnly/>
                    </Col>
                    <Col sm={6}>
                        <TextInput className="light readonly" id="surname" name="surname" value={user && user.artist_name} readOnly/>
                    </Col>
                </Row>

                
                {formData && formData.map((f, index) =>
                    <FormFactory
                        key={index}
                        id={`item_${index}`}
                        field={f}
                        className="light"
                        onFieldChange={(field) => handleChangeForm(index, field)}
                    />
                )}
            </form>

            <div className="d-flex px-1 justify-content-center mt-5">
                <Button label={data.id ? '업데이트' : '등록하기'} className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                <Button label={data.id ? '돌아가기' : '취소하기'} className="light px-5 mx-2" onClick={() => history.push('/admin/beatbox_camp_applicants')}/>
            </div>
        </div>
    )
};

export default BBCampApplicant;