import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

import { CircleFullSpinner, SmartEditor } from '../../components';
import { TextInput, Button } from '../../components/form';
import { toast } from 'react-toastify';

import { PostAdminFaq } from '../../store/faq/api';

const defaultData = {
    question: '',
    answer: ''
}

const FaqForm = ({faq, open, onClose, onSuccess}) => {
    const [submitting, setSubmitting] = useState(false);
    const [editor, setEditor] = useState(null);
    const [data, setData] = useState(faq || defaultData);
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
            answer: getEditorData()
        };

        PostAdminFaq(data.id, _data)
            .then(res => {
                setSubmitting(false);
                toast.success('성공적으로 등록되였습니다.');
                onSuccess();
            }).catch(err => {
                setSubmitting(false);
            })
    }

    const validateFields = () => {
        if(!data.question) {
            setErrors({...errors, question: "질문을 입력해 주세요."});
            return false;
        };
        return true;
    }

    const getEditorData = () => {
        if(editor){
            editor.getById['answer-content'].exec("UPDATE_CONTENTS_FIELD", []);
            const content = document.getElementById('answer-content').value;
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
                <h5 className="m-0">FAQ 콘텐츠</h5>
            </Modal.Title>

            <Modal.Body className="p-4">
                {submitting && <CircleFullSpinner size="full"/>}
                <div className="inline-group md-block mb-3">
                    <div className="w-4-rem mt-2">질문*</div>
                    <div className="flex-full">
                        <TextInput
                            id="question"
                            name="question"
                            className="light rounded"
                            value={data.question}
                            error={errors.question}
                            onChange={handleChangeField}/>
                    </div>
                </div>

                <div>
                    <div className="mb-2">응답</div>
                    <SmartEditor
                        id="answer-content"
                        rows={8}
                        content={data.answer}
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

export default FaqForm;