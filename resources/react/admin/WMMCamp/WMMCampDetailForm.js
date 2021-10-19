import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

import { SmartEditor } from '../../components';
import { TextInput, Button } from '../../components/form';
import { toast } from 'react-toastify';

import { PostCamp } from '../../store/camp/api';

const defaultData = {
    name: '',
    type: '',
    description: ''
}

const WMMCampDetailForm = ({campInfo, open, onClose, onSuccess}) => {
    const type = 'WMM';
    const [editor, setEditor] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState(campInfo || defaultData);
    const [imageFile, setImageFile] = useState(null);
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
        formData.append('type', type);
        formData.append('name', data.name);
        formData.append('description', getEditorData());

        PostCamp(data.id, formData)
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

        if(!data.name) _errors = {..._errors, title: '캠페인명을 입력 하세요.'};
        
        setErrors(_errors);

        if(!Object.keys(_errors).length) return true;
        return false;
    }

    const getEditorData = () => {
        if(editor){
            editor.getById['wmm-camp-content'].exec("UPDATE_CONTENTS_FIELD", []);
            const content = document.getElementById('wmm-camp-content').value;
            return content;
        }
        return '';
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
                            id="name"
                            name="name"
                            className="light rounded"
                            value={data.name}
                            error={errors.name}
                            onChange={handleChangeField}/>
                    </div>
                </div>

                <div>
                    <div className="mb-2">콘텐츠</div>
                    <SmartEditor
                        id="wmm-camp-content"
                        rows={8}
                        content={data.description}
                        onLoadEditor={(editor) => setEditor(editor)}
                    />
                </div>

                <div className="d-flex px-1 justify-content-center mt-5">
                    <Button label={data.id ? '업데이트': '등록하기'} className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                    <Button label={data.id ? '돌아가기': '취소하기'} className="light px-5 mx-2" onClick={onClose}/>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default WMMCampDetailForm;