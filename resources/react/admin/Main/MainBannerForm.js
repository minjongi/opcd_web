import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import { CircleFullSpinner, FileUploader, ImagePreview } from '../../components';
import { TextInput, Button, RadioBox } from '../../components/form';
import { toast } from 'react-toastify';

import { validUrl } from '../../helpers/utils';
import { REQUIRED, INVALID } from '../../constants/validation';
import { PostBanner } from '../../store/main/api';

const defaultData = {
    title: '',
    description: '',
    link: '',
    link_target: 'BLANK',
    type: '',
    image: ''
}

const MainBannerForm = ({banner, open, onClose, onSuccess}) => {
    const type = 'MAIN';
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState(banner || defaultData);
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
        if(id === 'title' && value.length > 42) return;
        if(id === 'description' && value.length > 66) return;
        setData({...data, [id]: value});
    }

    const handleSubmit = () => {
        if(!validateFields() || submitting) return;
        setSubmitting(true);

        const formData = new FormData();
        formData.append('type', type);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('link', data.link);
        formData.append('link_target', data.link_target);
        if(imageFile) formData.append('file', imageFile.file);
        else formData.append('image', data.image);

        PostBanner(data.id, formData)
            .then(res => {
                setSubmitting(false);
                toast.success('????????? ??????????????? ?????????????????????.');
                onSuccess();
            }).catch(err => {
                setSubmitting(false);
            })
    }

    const validateFields = () => {
        let _errors = {};

        if(!data.title) _errors = {..._errors, title: REQUIRED.title};
        if(!data.image && !imageFile) _errors = {..._errors, image: REQUIRED.image};
        if(data.link && !validUrl(data.link)) _errors = {..._errors, link: INVALID.link};
        
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
                <h5 className="m-0">{data.id ? '?????? ????????? ?????? ????????????' : '?????? ????????? ?????? ??????'}</h5>
            </Modal.Title>

            <Modal.Body className="p-4">
                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">?????? ?????????*</div>
                    <div className="flex-full">
                        <TextInput
                            id="title"
                            name="title"
                            className="light rounded"
                            value={data.title || ''}
                            error={errors.title}
                            onChange={handleChangeField}/>
                        {!errors.title && <span className="d-block helper-message mt--8">???????????? ??????42??? ??????</span>}
                    </div>
                </div>

                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">?????? ??????</div>
                    <div className="flex-full">
                        <TextInput
                            id="link"
                            name="link"
                            className="light rounded"
                            value={data.link || ''}
                            error={errors.link}
                            onChange={handleChangeField}/>
                        <div className="d-flex">
                            <RadioBox
                                label="?????? ??????"
                                name="link_target"
                                className="font-14 mr-4"
                                value="BLANK"
                                checked={data.link_target === 'BLANK'}
                                onChange={(e) => setData({...data, link_target: 'BLANK'})}/>
                            <RadioBox
                                label="????????? ??????"
                                name="link_target"
                                className="font-14 mr-4"
                                value="SELF"
                                checked={data.link_target === 'SELF'}
                                onChange={(e) => setData({...data, link_target: 'SELF'})}/>
                        </div>
                        
                    </div>
                    
                </div>

                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">?????? ????????????</div>
                    <div className="flex-full">
                        <TextInput
                            id="description"
                            name="description"
                            className="light rounded"
                            value={data.description || ''}
                            rows={3}
                            onChange={handleChangeField}/>
                        {!errors.description && <span className="d-block helper-message mt--8">???????????? ??????66??? ??????</span>}
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    {data.image || imageFile ?
                        <ImagePreview
                            url={data.image || imageFile.preview}
                            className="h-auto w-100 max-w-1200"
                            deletable onDelete={() => {
                                setData({...data, image: ''});
                                setImageFile(null);
                            }}/>
                        :
                        <FileUploader onChange={handleSelectFile} fluid accept=".jpg,.png"/>
                    }
                </div>
                
                {errors.image && <span className="d-block error-message">{errors.image}</span>}

                <div className="d-flex px-1 justify-content-center mt-5">
                    <Button label={data.id ? '????????????': '????????????'} className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                    <Button label={data.id ? '????????????': '????????????'} className="light px-5 mx-2" onClick={onClose}/>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default MainBannerForm;