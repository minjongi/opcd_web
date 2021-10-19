import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

import { CircleFullSpinner, SmartEditor } from '../../components';
import { TextInput, Button, Select } from '../../components/form';
import { toast } from 'react-toastify';

import { noticeTypes } from '../../constants/defaults';
import { PostAdminNotice } from '../../store/notice/api';

const defaultData = {
    title: '',
    content: '',
    type: 'NOTICE'
}

const NoticeForm = ({notice, open, onClose, onSuccess}) => {
    const [submitting, setSubmitting] = useState(false);
    const [editor, setEditor] = useState(null);
    const [data, setData] = useState(notice || defaultData);
    const [errors, setErrors] = useState({});

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        setErrors({...errors, [id]: ''});
        setData({...data, [id]: value});
    }

    const handleSubmit = () => {
        if(!validateFields() || submitting) return;
        setSubmitting(true);

        const _data = {
            ...data,
            content: getEditorData()
        };

        PostAdminNotice(data.id, _data)
            .then(res => {
                setSubmitting(false);
                toast.success('성공적으로 등록되였습니다.');
                onSuccess();
            }).catch(err => {
                setSubmitting(false);
            })
    }

    const validateFields = () => {
        if(!data.title) {
            setErrors({...errors, title: "타이틀을 입력해 주세요."});
            return false;
        };
        return true;
    }

    const getEditorData = () => {
        if(editor){
            editor.getById['content-content'].exec("UPDATE_CONTENTS_FIELD", []);
            const content = document.getElementById('content-content').value;
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
                <h5 className="m-0">공지사항</h5>
            </Modal.Title>

            <Modal.Body className="p-4">
                {submitting && <CircleFullSpinner size="full"/>}
                <div className="inline-group md-block mb-3">
                    <div className="w-4-rem mt-2">타이틀*</div>
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
                    <div className="w-4-rem mt-2">구분*</div>
                    <div className="flex-full">
                        <Select
                            id="type"
                            name="type"
                            className="light rounded"
                            value={data.type}
                            onChange={handleChangeField}>
                                {noticeTypes.map((n, index) => 
                                    <option key={index} value={n.key}>{n.value}</option>    
                                )}
                        </Select>
                    </div>
                </div>

                <div>
                    <div className="mb-2">콘텐츠</div>
                    <SmartEditor
                        id="content-content"
                        rows={8}
                        content={data.content}
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

export default NoticeForm;