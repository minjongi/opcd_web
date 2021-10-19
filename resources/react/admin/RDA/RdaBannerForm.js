import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import { CircleFullSpinner, FileUploader, ImagePreview } from '../../components';
import { TextInput, Button, RadioBox } from '../../components/form';
import { toast } from 'react-toastify';

import { validUrl, fileExtension } from '../../helpers/utils';
import { REQUIRED, INVALID } from '../../constants/validation';
import { PostRdaBanner } from '../../store/rda/api';

const defaultData = {
    link: '',
    image: ''
}

const RdaBannerForm = ({banner, open, onClose, onSuccess}) => {
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
        setData({...data, [id]: value});
    }

    const handleSubmit = () => {
        if(!validateFields() || submitting) return;
        setSubmitting(true);

        const formData = new FormData();
        formData.append('link', data.link);
        if(imageFile) formData.append('file', imageFile.file);
        else formData.append('image', data.image);

        PostRdaBanner(data.id, formData)
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
                <h5 className="m-0">{data.id ? 'RDA 배너 업데이트' : 'RDA 배너 추가'}</h5>
            </Modal.Title>

            <Modal.Body className="p-4">
                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">배너 링크</div>
                    <div className="flex-full">
                        <TextInput
                            id="link"
                            name="link"
                            className="light rounded"
                            value={data.link || ''}
                            error={errors.link}
                            onChange={handleChangeField}/>
                    </div>
                    
                </div>

                <div className="d-flex justify-content-center">
                    {data.image || imageFile ?
                        <ImagePreview
                            url={data.image || imageFile.preview}
                            format={fileExtension(data.image || imageFile.file?.name)}
                            className="h-auto w-100 max-w-1200"
                            deletable onDelete={() => {
                                setData({...data, image: ''});
                                setImageFile(null);
                            }}/>
                        :
                        <FileUploader onChange={handleSelectFile} fluid accept=".jpg,.png,.gif,.mp4"/>
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

export default RdaBannerForm;