import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { CircleFullSpinner, SmartEditor } from '../../components';
import { Button } from '../../components/form';

import { PostPolicy, GetPolicy } from '../../store/policy/api';

const PersonalInfoPolicy = () => {
    const type = "PERSONAL_POLICY";
    const [submitting, setSubmitting] = useState(false);
    const [editor, setEditor] = useState(null);
    const [content, setContent] = useState('');

    useEffect(() => {
        GetPolicy({type}).then(res => {
            const { policies } = res.data;
            if(policies){
                setContent(policies.content);
            }
        });
    }, []);

    const handleSubmit = () => {
        if(submitting) return;
        setSubmitting(true);

        const _content = getEditorData();

        PostPolicy({content: _content, type}).then(res => {
            setSubmitting(false);
            toast.success('개인정보취급방침 업데이트 되였습니다.');
        }).catch(err => {
            setSubmitting(false);
            toast.error('개인정보취급방침 업데이트 할수 없습니다.');
        });
    }

    const getEditorData = () => {
        if(editor){
            editor.getById['personal_info'].exec("UPDATE_CONTENTS_FIELD", []);
            const content = document.getElementById('personal_info').value;
            return content;
        }
        return '';
    }

    return (
        <div>
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">개인정보취급방침</h4>

            <div>
                <SmartEditor
                    id="personal_info"
                    rows={16}
                    content={content}
                    onLoadEditor={(editor) => setEditor(editor)}
                />
            </div>

            <div className="d-flex px-1 justify-content-center mt-5">
                <Button label="업데이트" className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
            </div>
        </div>
    )
};

export default PersonalInfoPolicy;