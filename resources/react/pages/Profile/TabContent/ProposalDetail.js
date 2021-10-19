import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { Button, RadioBox, TextInput, CheckBox } from '../../../components/form';
import { FormFactory } from '../../../components/formBuilder';

import { GetApplicant } from '../../../store/camp/user_api';

const ProposalDetail = ({userState, applicant, onCancel}) => {
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        GetApplicant(applicant.id).then(res => {
            const { applicant } = res.data;
            if(!applicant || !applicant.applicant_content) onReturn();
            else setFormData(JSON.parse(applicant.applicant_content));
        }).catch(err => {
            console.log(err);
        })
    }, [applicant.id]);

    return (
        <>
            <h3 className={`text-center py-3 mt-5 border-b-2-white`}>{`[${applicant.campaign.name}] 참가신청`}</h3>
            <form>
                <label className="font-14 mt-4">접수번호</label>
                <TextInput className="dark readOnly" id="date" name="date" value={applicant.applicant_id} readOnly/>

                <label className="font-14 mt-4">신청내역공개여부</label>
                <RadioBox label={applicant.security === "PUBLIC" ? "공개" : "비공개"} className="font-14 mr-4" name="security" checked={true}/>

                <label className="font-14 mt-4">신청자정보</label>
                <Row>
                    <Col sm={6}>
                        <TextInput className="dark readOnly" id="email" name="email" value={userState.email} readOnly/>
                    </Col>
                    <Col sm={6}>
                        <TextInput className="dark readOnly" id="phone" name="phone" value={userState.phone} readOnly/>
                    </Col>
                    <Col sm={6}>
                        <TextInput className="dark readOnly" id="name" name="name" value={userState.name} readOnly/>
                    </Col>
                    <Col sm={6}>
                        <TextInput className="dark readOnly" id="surname" name="surname" value={userState.artist_name} readOnly/>
                    </Col>
                </Row>

                {formData && formData.map((f, index) =>
                    <FormFactory
                        key={index}
                        id={`item_${index}`}
                        field={f}
                        disabled
                    />
                )}
            </form>

            <Row className="mx-0 my-5 d-flex justify-content-center">
                <Col sm={6} className="pl-0 pr-2">
                    <Button label="돌아가기"
                        className="btn-color-gray flex-grow-1"
                        onClick={onCancel}
                    />
                </Col>
            </Row>
        </>
    )
}

export default ProposalDetail;