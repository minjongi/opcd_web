import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

import { TextInput, Button } from '../../components/form';
import { toast } from 'react-toastify';

import { PostRdaCampaign } from '../../store/rda/api';

const defaultData = {
    title: '',
    description: '',
    url: ''
}

const RdaCampaignForm = ({campInfo, open, onClose, onSuccess}) => {
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState(campInfo || defaultData);
    const [errors, setErrors] = useState({});

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        setErrors({...errors, [id]: ''});
        setData({...data, [id]: value});
    }

    const handleSubmit = () => {
        if(!validateFields() || submitting) return;
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description || '');
        formData.append('url', data.url);

        PostRdaCampaign(data.id, formData)
            .then(res => {
                setSubmitting(false);
                toast.success('캠페인이 성공적으로 등록되였습니다.');
                onSuccess();
            }).catch(err => {
                setSubmitting(false);
            })
    }

    const validateFields = () => {
        let _errors = {};

        if(!data.title) _errors = {..._errors, title: '캠페인명을 입력 하세요.'};
        if(!data.url) _errors = {..._errors, url: '상세보기 경로를 입력 하세요.'};
        
        setErrors(_errors);

        if(!Object.keys(_errors).length) return true;
        return false;
    }

    return (
        <Modal
            show={open}
            centered
            size="lg"
            onHide={onClose}
        >
            <Modal.Title className="p-4 back-primary">
                <h5 className="m-0">{data.id ? '캠페인 업데이트' : '캠페인 등록'}</h5>
            </Modal.Title>

            <Modal.Body className="p-4">
                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">캠페인명*</div>
                    <div className="flex-full">
                        <TextInput
                            id="title"
                            name="title"
                            className="light rounded"
                            value={data.title}
                            error={errors.title}
                            onChange={handleChangeField}/>
                    </div>
                </div>
                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">상세보기 경로*</div>
                    <div className="flex-full">
                        <TextInput
                            id="url"
                            name="url"
                            className="light rounded"
                            value={data.url}
                            error={errors.url}
                            onChange={handleChangeField}/>
                    </div>
                </div>
                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">캠페인 상세</div>
                    <div className="flex-full">
                        <TextInput
                            id="description"
                            name="description"
                            className="light rounded"
                            value={data.description}
                            rows={5}
                            onChange={handleChangeField}/>
                    </div>
                </div>

                

                <div className="d-flex px-1 justify-content-center mt-5">
                    <Button label={data.id ? '업데이트': '등록하기'} className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                    <Button label={data.id ? '돌아가기': '취소하기'} className="light px-5 mx-2" onClick={onClose}/>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default RdaCampaignForm;