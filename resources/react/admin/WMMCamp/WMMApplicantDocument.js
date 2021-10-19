import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';

import { TextInput, Button, Select } from '../../components/form';
import { FileUploader, SmartEditor, TagItem, ImagePreview, CircleFullSpinner, Icon } from '../../components';
import { REQUIRED, INVALID } from '../../constants/validation';
import { validUrl, fetchTags } from '../../helpers/utils';
import { toast } from 'react-toastify';

import { schema } from '../../constants/formSchema';
import { FormFactory, PropertyPanel } from '../../components/formBuilder';

import { PostCampForm, GetCampForm, GetCampNameList } from '../../store/camp/api';

const defaultData = {
    form_name: '',
    campaign_id: '',
    applicant_form: ''
}

const WMMApplicantDocument = () => {
    const history = useHistory();
    const params = useParams();
    const type = "WMM";
    const [submitting, setSubmitting] = useState(false);
    const [campNames, setCampNames] = useState([]);
    const [data, setData] = useState(defaultData);
    const [errors, setErrors] = useState({});

    const [toolbarKey, setToolbarKey] = useState('option');
    const [fields, setFields] = useState([]); 
    const [editItem, setEditItem] = useState(-1);

    useEffect(() => {
        if(params && params.id){
            GetCampForm(params.id).then(res => {
                const { created_at, applicant_form, ...rest } = res.data.data;
                setData(rest);
                if(applicant_form) setFields(JSON.parse(applicant_form));
            }).catch(err => {
                console.log(err);
            })
        }

        GetCampNameList({type}).then(res => {
            const { names } = res.data;
            if(names.length){
                setCampNames(names);
            }else{
                toast.error('캠페인이 발견되지 않았습니다. 먼저 캠페인을 등록 해주세요.');
            }
        }).catch(err => {
            console.log(err);
        });
    }, [params])

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        setErrors({...errors, [id]: ''});
        setData({...data, [id]: value});
    }

    const handleSubmit = () => {
        if(!validateFields() || submitting) return;
        setSubmitting(true);

        const formData = {
            ...data,
            campaign_id: data.campaign_id ? data.campaign_id : campNames[0].id,
            type,
            applicant_form: JSON.stringify(fields)
        };
        

        PostCampForm(data.id, formData)
            .then(res => {
                setSubmitting(false);
                toast.success('신청양식이 성공적으로 등록되였습니다.');
                history.push('/admin/wmm_camp_documents');
            }).catch(err => {
                setSubmitting(false);
            })
    }

    const validateFields = () => {
        if(!campNames.length) {
            toast.error("캠페인을 등록 해주세요.");
            return false;
        }

        let _errors = {};

        if(!data.form_name) _errors = {..._errors, form_name: "양식명을 입력 하세요."};
        if(!fields.length) _errors = {..._errors, form: "폼을 작성하세요."};
        
        setErrors(_errors);

        if(!Object.keys(_errors).length) return true;
        return false;
    }

    const handleAddItem = (item) => {
        let _item = JSON.parse(JSON.stringify(item));
        if(editItem > -1 && editItem < fields.length - 1){
            setFields([...fields.slice(0, editItem + 1), _item, ...fields.slice(editItem + 1)]);
        }else{
            setFields([...fields, _item]);
        }
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">신청양식</h4>

            <div className="inline-group md-block mb-3">
                <div className="w-10-rem mt-2">신청양식명*</div>
                <div className="flex-full max-w-20">
                    <TextInput
                        id="form_name"
                        name="form_name"
                        className="light rounded"
                        value={data.form_name}
                        error={errors.form_name}
                        onChange={handleChangeField}/>
                </div>
            </div>

            <div className="inline-group md-block mb-3">
                <div className="w-10-rem mt-2">캠페인*</div>
                <div className="flex-full max-w-20">
                    <Select id="campaign_id" name="campaign_id" value={data.campaign_id} className="light rounded" onChange={handleChangeField}>
                        {!!campNames.length && campNames.map((n, index) => 
                            <option key={index} value={n.id}>{n.name}</option>
                        )}
                    </Select>
                </div>
            </div>
            
            {errors.form && <span className="error-message">{errors.form}</span>}
            <div className="form-builder">
                <div className="form-container">
                    <div className="form">
                        {!!fields.length && fields.map((field, index) => 
                            <FormFactory
                                key={index}
                                id={`item_${index}`}
                                field={field}
                                editable
                                selected={editItem === index}
                                onEdit={() => {
                                    if(editItem > -1 && editItem === index) {
                                        setEditItem(-1);
                                        setToolbarKey('option');
                                    }else{
                                        setEditItem(index);
                                        setToolbarKey('property');
                                    }
                                }}
                                onDelete={() => {
                                    let _fields = [...fields];
                                    _fields.splice(index, 1);
                                    setFields([..._fields]);
                                }}
                                />
                        )}
                    </div>
                </div>
                <div className="tool-bar">
                    <Tabs
                        activeKey={toolbarKey}
                        onSelect={(key) => setToolbarKey(key)}
                        className="toolbar-tabs"
                    >
                        <Tab eventKey="option" title="옵션">
                            {schema.map((s, index) => 
                                <div key={index} className="option-item" onClick={() => handleAddItem(s.property)}>
                                    <span><Icon name={s.icon} color="primary"/>&nbsp;&nbsp;{s.name}</span>
                                </div>
                            )}
                        </Tab>
                        <Tab eventKey="property" title="속성">
                            <PropertyPanel
                                property={editItem > -1 ? fields[editItem] : null}
                                onChange={(item) => {
                                    let _fields = [...fields];
                                    _fields.splice(editItem, 1, item);
                                    setFields([..._fields]);
                                }}
                            />
                        </Tab>
                    </Tabs>
                </div>
            </div>

            <div className="d-flex px-1 justify-content-center mt-5">
                {data.id ?
                    <Button label="업데이트" className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                    :
                    <Button label="등록하기" className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                }
                
                <Button label="돌아가기" className="light px-5 mx-2" onClick={() => history.push('/admin/wmm_camp_documents')}/>
            </div>
        </div>
    )
};

export default WMMApplicantDocument;