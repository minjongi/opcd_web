import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import { CircleFullSpinner, FileUploader, ImagePreview } from '../../components';
import { TextInput, Button, Select } from '../../components/form';
import { toast } from 'react-toastify';
import { validUrl } from '../../helpers/utils';
import { REQUIRED, INVALID } from '../../constants/validation';
import { PostContent } from '../../store/lib/api';

const defaultData = {
    category_id: '',
    description: '',
    image: ''
}

const VINYLLibForm = ({categories, content, open, onClose, onSuccess}) => {
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState(content || defaultData);
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if(categories && categories.length){
            setData({...data, category_id: categories[0].id});
        }
    }, []);

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
        formData.append('category_id', data.category_id);
        formData.append('description', data.description);
        if(imageFile) formData.append('file', imageFile.file);
        else formData.append('image', data.image);

        PostContent(data.id, formData)
            .then(res => {
                setSubmitting(false);
                toast.success('성공적으로 등록되였습니다.');
                onSuccess();
            }).catch(err => {
                setSubmitting(false);
            })
    }

    const validateFields = () => {
        let _errors = {};

        if(!data.category_id) _errors = {..._errors, category_id: "카테고리를 선택하세요"};
        if(!data.image && !imageFile) _errors = {..._errors, image: REQUIRED.image};
        
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
                <h5 className="m-0">Library 콘텐츠</h5>
            </Modal.Title>

            <Modal.Body className="p-4">
                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">카테고리*</div>
                    <div className="flex-full">
                        <Select
                            id="category_id"
                            name="category_id"
                            className="light rounded"
                            value={data.category_id}
                            onChange={handleChangeField}>
                            {categories && categories.map((cat, index) => 
                                <option key={index} value={cat.id}>{cat.name}</option>
                            )}
                        </Select>
                        {errors.category_id && <span className="d-block error-message">{errors.category_id}</span>}
                    </div>
                </div>
                

                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">Library 서브문구</div>
                    <div className="flex-full">
                        <TextInput
                            id="description"
                            name="description"
                            className="light rounded"
                            value={data.description}
                            rows={3}
                            onChange={handleChangeField}/>
                    </div>
                </div>

                <div className="d-flex flex-column align-items-center justify-content-center">
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
                        <FileUploader onChange={handleSelectFile} accept="image/*"/>
                    }
                    {errors.image && <span className="d-block error-message">{errors.image}</span>}
                </div>
                
                

                <div className="d-flex px-1 justify-content-center mt-5">
                    <Button label={data.id ? '업데이트': '등록하기'} className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                    <Button label={data.id ? '돌아가기': '취소하기'} className="light px-5 mx-2" onClick={onClose}/>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default VINYLLibForm;