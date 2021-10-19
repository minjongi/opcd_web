import React, {useEffect, useState} from 'react';
import { Row, Col } from 'react-bootstrap';

import { FormFactory } from '../../../components/formBuilder';
import { Button, RadioBox, TextInput, CheckBox } from '../../../components/form';

const SongCampSubmit = ({tab, userInfo, campaign, onSubmit}) => {
    const [data, setData] = useState(null);
    const [security, setSecurity] = useState('PUBLIC');

    useEffect(() => {
        setData(null);
        if(campaign && campaign.form && campaign.form.applicant_form){
            let _data = JSON.parse(campaign.form.applicant_form);
            setData(_data);
        }
    }, [campaign.id]);

    if(!userInfo || userInfo.role !== 'USER') return null;
    
    const handleChangeForm = (index, field) => {
        let _data = [...data];
        _data.splice(index, 1, field);
        setData(_data);
    }

    const handleSubmitPropose = () => {
        const _data = {
            campaign_id: campaign.id,
            security,
            applicant_content: JSON.stringify(data),
            type: 'WMM'
        };

        onSubmit && onSubmit('SUBMIT', _data);
    }

    return (
        <div className="songcamp-sumit">
            <h3 className="text-center border-b-2-white py-3">{`[${campaign.name}] 참가신청`}</h3>

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
                        <TextInput className="dark readonly" id="email" name="email" value={userInfo.email} readOnly/>
                    </Col>
                    <Col sm={6}>
                        <TextInput className="dark readonly" id="phone" name="phone" value={userInfo.phone} readOnly/>
                    </Col>
                    <Col sm={6}>
                        <TextInput className="dark readonly" id="name" name="name" value={userInfo.name} readOnly/>
                    </Col>
                    <Col sm={6}>
                        <TextInput className="dark readonly" id="surname" name="surname" value={userInfo.artist_name} readOnly/>
                    </Col>
                </Row>

                
                {data && data.map((f, index) =>
                    <FormFactory
                        key={index}
                        id={`item_${index}`}
                        field={f}
                        onFieldChange={(field) => handleChangeForm(index, field)}
                    />
                )}
            </form>

            <Row className="mt-4">
                <Col sm={6} className="py-2">
                    <Button label="취소하기"
                        className="btn-color-gray flex-grow-1"
                        onClick={() => onSubmit('CANCEL')}
                    />
                </Col>
                <Col sm={6} className="py-2">
                    <Button label="제출하기"
                        className="btn-color-purple flex-grow-2"
                        onClick={handleSubmitPropose}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default SongCampSubmit;