import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { TextInput, Button, Select } from '../../components/form';
import { FileUploader, SmartEditor, TagItem, ImagePreview, CircleFullSpinner } from '../../components';
import { REQUIRED, INVALID } from '../../constants/validation';
import { validUrl, fetchTags } from '../../helpers/utils';
import { toast } from 'react-toastify';

import { PostFeatureContent, GetFeatureContent } from '../../store/feature/api';

const defaultData = {
    title: '',
    tag: '',
    description: '',
    content: '',
    type: 'NEWS'
}

const FeatureContentDetail = () => {
    const history = useHistory();
    const params = useParams();
    const [editor, setEditor] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState(defaultData);
    const [tags, setTags] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if(params && params.id){
            GetFeatureContent(params.id).then(res => {
                const { tag, author, created_at, ...rest } = res.data.data;
                setData(rest);
                if(tag) setTags(fetchTags(tag));
            }).catch(err => {
                console.log(err);
            })
        }
    }, [params])

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        setErrors({...errors, [id]: ''});
        setData({...data, [id]: value});
    }

    const handleAddTag = (e) => {
        const { keyCode } = e;
        const { tag } = data;
        if(keyCode !== 13 || !tag || tags.includes(tag)) return;

        setTags([...tags, tag]);
        setData({...data, tag: ''});
    }

    const handleDeleteTag = (index) => {
        let _tags = [...tags];
        _tags.splice(index, 1);
        setTags(_tags);
    }

    const handleSelectFile = (files) => {
        setErrors({...errors, image: ''});
        setImageFile({
            file: files[0],
            preview: URL.createObjectURL(files[0])
        });
    }

    const handleDeleteImage = () => {
        if(data.image) setData({...data, image: ''});
        if(imageFile) setImageFile(null);
    }

    const handleSubmit = () => {
        if(!validateFields() || submitting) return;
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description || '');
        formData.append('tag', tags.length ? tags.join(',') : '');
        formData.append('content', getEditorData());
        if(data.type) formData.append('type', data.type);
        if(imageFile) formData.append('file', imageFile.file);
        else formData.append('image', data.image || '');

        PostFeatureContent(data.id, formData)
            .then(res => {
                setSubmitting(false);
                toast.success('???????????? ??????????????? ?????????????????????.');
                history.goBack();
            }).catch(err => {
                setSubmitting(false);
            })
    }

    const validateFields = () => {
        let _errors = {};

        if(!data.title) _errors = {..._errors, title: REQUIRED.title};
        if(!data.image && !imageFile) _errors = {..._errors, image: REQUIRED.image};
        
        setErrors(_errors);

        if(!Object.keys(_errors).length) return true;
        return false;
    }

    const getEditorData = () => {
        if(editor){
            editor.getById['feature-content'].exec("UPDATE_CONTENTS_FIELD", []);
            const content = document.getElementById('feature-content').value;
            return content;
        }
        return '';
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">MAGAZINE ?????????</h4>

            <div className="inline-group md-block mb-3">
                <div className="w-10-rem mt-2">????????? ?????????*</div>
                <div className="flex-full max-w-20">
                    <TextInput
                        id="title"
                        name="title"
                        className="light rounded"
                        value={data.title || ''}
                        error={errors.title}
                        onChange={handleChangeField}/>
                </div>
            </div>

            <div className="inline-group md-block mb-3">
                <div className="w-10-rem mt-2">????????? ??????*</div>
                <div className="flex-full max-w-20">
                    <Select
                        id="type"
                        name="type"
                        className="light rounded"
                        value={data.type}
                        onChange={handleChangeField}>
                        <option value="NEWS">NEWS</option>
                        <option value="INTERVIEW">INTERVIEW</option>
                        <option value="FEATURE">FEATURE</option>
                        {/* <option value="MUSIC">MUSIC</option>
                        <option value="TUTORIAL">TUTORIAL</option>
                        <option value="LIFESTYLE">LIFESTYLE</option> */}
                    </Select>
                </div>
            </div>

            <div className="inline-group md-block mb-3">
                <div className="w-10-rem">
                    <div>????????? ?????????*</div>
                    <span className="font-12">(*.jpg, *.png??????)</span>
                </div>
                <div className="flex-full">
                    {data.image || imageFile ?
                        <div className="max-w-300">
                            <ImagePreview url={data.image || imageFile.preview} deletable onDelete={handleDeleteImage}/>
                        </div>
                        :
                        <FileUploader onChange={handleSelectFile} accept=".jpg,.png"/>
                    }
                    {errors.image && <span className="d-block error-message">{errors.image}</span>}
                </div>
            </div>

            <div className="inline-group md-block mb-3">
                <div className="w-10-rem mt-2">????????? ??????</div>
                <div className="flex-full">
                    {!!tags.length &&
                        <div className="d-flex max-w-500 flex-wrap">
                            {tags.map((tag, index) => 
                                <TagItem key={index} label={tag} deletable={true} className="mr-2" onDelete={() => handleDeleteTag(index)}/>
                            )}
                        </div>
                    }
                    <TextInput
                        id="tag"
                        name="tag"
                        className="light rounded max-w-20"
                        value={data.tag || ''}
                        onChange={handleChangeField}
                        onKeyDown={handleAddTag}/>
                </div>
            </div>

            <div className="inline-group md-block mb-3">
                <div className="w-10-rem mt-2">????????????</div>
                <div className="flex-full max-w-20">
                    <TextInput
                        id="description"
                        name="description"
                        className="light rounded"
                        value={data.description}
                        rows={3}
                        onChange={handleChangeField}/>
                </div>
            </div>

            <div className="w-10-rem">?????????</div>
            <div className="w-100">
                <SmartEditor
                    id="feature-content"
                    rows={8}
                    content={data.content}
                    onLoadEditor={(editor) => setEditor(editor)}
                />
            </div>

            <div className="d-flex px-1 justify-content-center mt-5">
                <Button label={data.id ? '????????????' : '????????????'} className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                <Button label="????????????" className="light px-5 mx-2" onClick={() => history.goBack()}/>
            </div>
        </div>
    )
};

export default FeatureContentDetail;