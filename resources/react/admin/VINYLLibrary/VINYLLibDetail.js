import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { TextInput, Button, Select } from '../../components/form';
import { FileUploader, SmartEditor, TagItem, ImagePreview, CircleFullSpinner } from '../../components';
import { REQUIRED, INVALID } from '../../constants/validation';
import { validUrl, fetchTags } from '../../helpers/utils';
import { toast } from 'react-toastify';

import { GetCategorNames, PostContent, GetContent } from '../../store/lib/api';

const defaultData = {
    category_id: '',
    description: '',
    image: '',
    content: ''
}

const VINYLLibDetail = () => {
    const history = useHistory();
    const params = useParams();
    const [categories, setCategories] = useState([]);
    const [editor, setEditor] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState(defaultData);
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        GetCategorNames().then(res => {
            const { names } = res.data;
            setCategories(names);
        });
        if(params && params.id){
            GetContent(params.id).then(res => {
                const { created_at, ...rest } = res.data.data;
                setData(rest);
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
        if(!data.category_id){
            formData.append('category_id', categories[0].id);
        }else{
            formData.append('category_id', data.category_id || '');
        }
        formData.append('description', data.description || '');
        formData.append('content', getEditorData());
        if(imageFile) formData.append('file', imageFile.file);
        else formData.append('image', data.image || '');

        PostContent(data.id, formData)
            .then(res => {
                setSubmitting(false);
                toast.success('콘텐츠가 성공적으로 등록되였습니다.');
                history.push('/admin/vinyl_lib_list');
            }).catch(err => {
                setSubmitting(false);
            })
    }

    const validateFields = () => {
        let _errors = {};

        if(!data.description) _errors = {..._errors, description: '서브구문을 입력해주세요.'};
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
            <h4 className="mb-5">VINYL LIBRARY 콘텐츠</h4>

            <div className="inline-group md-block mb-3">
                <div className="w-10-rem mt-2">카테고리*</div>
                <div className="flex-full max-w-20">
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
                </div>
            </div>

            <div className="inline-group md-block mb-3">
                <div className="w-10-rem">
                    <div>콘텐츠 이미지*</div>
                    <span className="font-12">(*.jpg, *.png파일)</span>
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
                <div className="w-10-rem mt-2">서브구문*</div>
                <div className="flex-full max-w-20">
                    <TextInput
                        id="description"
                        name="description"
                        className="light rounded"
                        value={data.description}
                        rows={3}
                        onChange={handleChangeField}/>
                    {errors.description && <span className="d-block error-message">{errors.description}</span>}
                </div>
            </div>

            <div className="w-10-rem">콘텐츠</div>
            <div className="w-100">
                <SmartEditor
                    id="feature-content"
                    rows={8}
                    content={data.content}
                    onLoadEditor={(editor) => setEditor(editor)}
                />
            </div>

            <div className="d-flex px-1 justify-content-center mt-5">
                <Button label={data.id ? '업데이트' : '등록하기'} className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                <Button label="돌아가기" className="light px-5 mx-2" onClick={() => history.push('/admin/vinyl_lib_list')}/>
            </div>
        </div>
    )
};

export default VINYLLibDetail;