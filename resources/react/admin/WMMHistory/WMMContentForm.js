import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import { CircleFullSpinner, FileUploader, ImagePreview } from '../../components';
import { TextInput, Button, Select } from '../../components/form';
import { toast } from 'react-toastify';

import { validUrl } from '../../helpers/utils';
import { REQUIRED, INVALID } from '../../constants/validation';
import { PostContent } from '../../store/wmm/api';

const defaultData = {
    title: '',
    desc: '',
    link: '',
    type: 'PACK',
    image: ''
}

const WMMContentForm = ({content, open, onClose, onSuccess}) => {
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState(content || defaultData);
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSelectFile = (files) => {
        setErrors({...errors, image: ''});
        setImageFile({
            file: files[0],
            preview: URL.createObjectURL(files[0])
        });
    }

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
        formData.append('desc', data.desc || '');
        formData.append('link', data.link);
        formData.append('type', data.type);
        if(imageFile) formData.append('file', imageFile.file);
        else formData.append('image', data.image);

        PostContent(data.id, formData)
            .then(res => {
                setSubmitting(false);
                toast.success('배너가 성공적으로 등록되였습니다.');
                onSuccess();
            }).catch(err => {
                setSubmitting(false);
            })
    }

    const validateFields = () => {
        let _errors = {};

        if(!data.title) _errors = {..._errors, title: REQUIRED.title};
        if(!data.image && !imageFile) _errors = {..._errors, image: REQUIRED.image};
        if(!data.link) _errors = {..._errors, link: REQUIRED.link};
        else if( !validUrl(data.link)) _errors = {..._errors, link: INVALID.link};
        
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
                <h5 className="m-0">{data.id ? '배너 업데이트' : '배너 추가'}</h5>
            </Modal.Title>

            <Modal.Body className="p-4">
                {submitting && <CircleFullSpinner size="full"/>}
                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">배너 타이틀*</div>
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
                    <div className="w-10-rem mt-2">배너 타입*</div>
                    <div className="flex-full">
                        <Select
                            id="type"
                            name="type"
                            className="light rounded"
                            value={data.type}
                            onChange={handleChangeField}
                        >
                            <option value="PACK">SAMPLE PACK</option>
                            <option value="CONTEST">CONTEST</option>
                            <option value="CONTENT">CONTENT</option>
                        </Select>
                    </div>
                </div>

                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">배너 링크*</div>
                    <div className="flex-full">
                        <TextInput
                            id="link"
                            name="link"
                            className="light rounded"
                            value={data.link}
                            error={errors.link}
                            onChange={handleChangeField}/>
                    </div>
                </div>

                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">배너 서브문구</div>
                    <div className="flex-full">
                        <TextInput
                            id="desc"
                            name="desc"
                            className="light rounded"
                            value={data.desc}
                            rows={3}
                            onChange={handleChangeField}/>
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    {data.image || imageFile ?
                        <div className="max-w-300">
                            <ImagePreview
                                url={data.image || imageFile.preview}
                                deletable onDelete={() => {
                                    setData({...data, image: ''});
                                    setImageFile(null);
                                }}/>
                        </div>
                        :
                        <FileUploader onChange={handleSelectFile} accept=".jpg,.png"/>
                    }
                </div>
                
                {errors.image && <span className="d-block error-message">{errors.image}</span>}

                <div className="d-flex px-1 justify-content-center mt-5">
                    <Button label={data.id ? '업데이트': '등록하기'} className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                    <Button label={data.id ? '돌아가기': '취소하기'} className="light px-5 mx-2" onClick={onClose}/>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default WMMContentForm;