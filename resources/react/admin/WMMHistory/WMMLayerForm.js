import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

import { SmartEditor } from '../../components';
import { TextInput, Button } from '../../components/form';
import { REQUIRED } from '../../constants/validation';
import { convertDateFormat, revertDateFormat } from '../../helpers/utils';

const defaultData = {
    content_num: '',
    date: '',
    title: '',
    content: ''
}

const WMMLayerForm = ({layerContent, open, onClose, onSuccess}) => {
    const [data, setData] = useState(layerContent || defaultData);
    const [editor, setEditor] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        setErrors({...errors, [id]: ''});
        setData({...data, [id]: value});
    }

    const handleSave = () => {
        if(!validateFields()) return;

        onSuccess({
            ...data,
            content: getEditorData()
        });
    }

    const validateFields = () => {
        let _errors = {};

        if(!data.title) _errors = {..._errors, title: REQUIRED.title};
        if(!data.content_num) _errors = {..._errors, content_num: REQUIRED.number};
        // if(!data.date) _errors = {..._errors, date: REQUIRED.date};
        
        setErrors(_errors);

        if(!Object.keys(_errors).length) return true;
        return false;
    }

    const getEditorData = () => {
        if(editor){
            editor.getById['layer-content'].exec("UPDATE_CONTENTS_FIELD", []);
            const content = document.getElementById('layer-content').value;
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
                <h5 className="m-0">레이어 콘텐츠</h5>
            </Modal.Title>

            <Modal.Body className="p-4">
                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">번호*</div>
                    <div className="flex-full">
                        <TextInput
                            id="content_num"
                            name="content_num"
                            className="light rounded"
                            value={data.content_num}
                            error={errors.content_num}
                            onChange={handleChangeField}/>
                    </div>
                </div>

                <div className="inline-group md-block mb-3">
                    <div className="w-10-rem mt-2">타이틀*</div>
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
                    <div className="w-10-rem mt-2">일자</div>
                    <div className="flex-full">
                        <TextInput
                            id="date"
                            name="date"
                            className="light rounded"
                            value={data.date}
                            error={errors.date}
                            onChange={handleChangeField}/>
                    </div>
                </div>

                <div className="w-100">
                    <SmartEditor
                        id="layer-content"
                        rows={6}
                        content={data.content}
                        onLoadEditor={(editor) => setEditor(editor)}
                    />
                </div>

                <div className="d-flex px-1 justify-content-center mt-5">
                    <Button label="등록" className="btn-contain light px-5 mx-2" onClick={handleSave}/>
                    <Button label="취소" className="light px-5 mx-2" onClick={onClose}/>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default WMMLayerForm;