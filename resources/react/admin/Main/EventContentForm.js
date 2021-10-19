import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";

import { CircleFullSpinner, FileUploader, ImagePreview } from '../../components';
import { TextInput, Button, RadioBox } from '../../components/form';
import { toast } from 'react-toastify';

import { validUrl, convertDateFormat, revertDateFormat } from '../../helpers/utils';
import { REQUIRED, INVALID } from '../../constants/validation';
import { PostEvent } from '../../store/main/api';

const defaultData = {
    title: '',
    desc: '',
    link: '',
    link_target: 'BLANK',
    image: '',
    category: '',
    start_date: '',
    end_date: ''
}

const EventContentForm = ({event, open, onClose, onSuccess}) => {
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState(defaultData);
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if(event){
            setData({
                ...event,
                start_date: revertDateFormat(event.start_date),
                end_date: revertDateFormat(event.end_date)
            })
        }
    }, [event]);

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
        formData.append('link_target', data.link_target);
        formData.append('category', data.category || '');
        if(data.start_date) formData.append('start_date', convertDateFormat(data.start_date));
        if(data.end_date) formData.append('end_date', convertDateFormat(data.end_date));
        if(imageFile) formData.append('file', imageFile.file);
        else formData.append('image', data.image);

        PostEvent(data.id, formData)
            .then(res => {
                setSubmitting(false);
                toast.success('EVENT가 성공적으로 등록되였습니다.');
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
                <h5 className="m-0">EVENT 콘텐츠</h5>
            </Modal.Title>

            <Modal.Body className="p-4">
                {submitting && <CircleFullSpinner size="full"/>}
                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">EVENT 타이틀*</div>
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
                    <div className="w-10-rem mt-2">EVENT 링크*</div>
                    <div className="flex-full">
                        <TextInput
                            id="link"
                            name="link"
                            className="light rounded"
                            value={data.link}
                            error={errors.link}
                            onChange={handleChangeField}/>
                        <div className="d-flex">
                            <RadioBox
                                label="새창 열기"
                                name="link_target"
                                className="font-14 mr-4"
                                value="BLANK"
                                checked={data.link_target === 'BLANK'}
                                onChange={(e) => setData({...data, link_target: 'BLANK'})}/>
                            <RadioBox
                                label="현재창 열기"
                                name="link_target"
                                className="font-14 mr-4"
                                value="SELF"
                                checked={data.link_target === 'SELF'}
                                onChange={(e) => setData({...data, link_target: 'SELF'})}/>
                        </div>
                    </div>
                </div>

                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">EVENT 구분</div>
                    <div className="flex-full">
                        <TextInput
                            id="category"
                            name="category"
                            className="light rounded"
                            value={data.category}
                            error={errors.category}
                            onChange={handleChangeField}/>
                    </div>
                </div>

                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">EVENT 기간</div>
                    <div className="flex-full">
                        <div className="d-flex align-items-center">
                            <DatePicker 
                                dateFormat="yyyy-MM-dd"
                                selected={data.start_date}
                                selectsStart
                                startDate={data.start_date}
                                endDate={data.end_date}
                                onChange={(date) => handleChangeField({target: {id: 'start_date', value: date}})}
                            />
                            <div className="mx-2">~</div>
                            <DatePicker 
                                dateFormat="yyyy-MM-dd"
                                selected={data.end_date}
                                selectsEnd
                                startDate={data.start_date}
                                endDate={data.end_date}
                                minDate={data.start_date}
                                onChange={(date) => handleChangeField({target: {id: 'end_date', value: date}})}
                            />
                        </div>
                    </div>
                </div>

                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">HOST</div>
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

export default EventContentForm;