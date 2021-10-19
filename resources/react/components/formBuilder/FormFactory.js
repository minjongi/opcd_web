import React, { useState } from 'react';

import { TextInput, CheckBox, RadioBox, Button } from '../form';
import Icon from '../Icon';

import { PostProposeFile } from '../../store/camp/user_api';

const FormLabel = ({id, field, className}) => {
    return (
        <div>
            {field.label && <label className={`font-14 mt-4 text-white ${className || ''} ${field.bold ? 'font-weight-bold' : ''}`}>{field.label}</label>}
        </div>
    )
}

const FormInput = ({id, field, disabled, onFieldChange, className}) => {

    const handleChange = (e) => {
        if(!onFieldChange) return;

        const { value } = e.target;
        onFieldChange({...field, value: value});
    }

    return (
        <div>
            {field.label && <label className={`font-14 mt-4 text-white ${className || ''} ${field.bold ? 'font-weight-bold' : ''}`}>{field.label}</label>}
            <TextInput className={className || ''} id={id} placeholder={field.placeholder} disabled={disabled} value={field.value} onChange={handleChange}/>
        </div>
    )
}

const FormCheckBox = ({id, field, disabled, onFieldChange, className}) => {
    
    const handleChange = (index, value) => {
        const { params } = field;
        if(!params.length || !onFieldChange) return;

        let _params = [...params];
        _params[index].value = value;

        onFieldChange({...field, params: _params});
    }

    return (
        <div>
            {field.label && <label className={`font-14 mt-4 text-white ${className || ''} ${field.bold ? 'font-weight-bold' : ''}`}>{field.label}</label>}
            <div className="d-flex flex-wrap">
                {field.params && field.params.map((c, index) => 
                    <CheckBox
                        key={index}
                        id={`checkbox_${id}_${index}`}
                        name={`checkbox_${id}_${index}`}
                        label={c.text || field.defaultText + '-' + index}
                        className={`font-14 mr-3 ${className || ''}`}
                        checked={c.value}
                        readOnly={disabled}
                        onChange={(e) => handleChange(index, e.target.checked)}
                    />
                )}
            </div>
        </div>
    )
}

const FormRadio = ({id, field, disabled, onFieldChange, className}) => {

    const handleChange = (index, value) => {
        const { params } = field;
        if(!params.length || !onFieldChange) return;

        const _params = params.map((p, i) => {
            if(i === index) return {...p, value: true};
            else return {...p, value: false};
        });

        onFieldChange({...field, params: _params});
    }

    return (
        <div>
            {field.label && <label className={`font-14 mt-4 text-white ${className || ''} ${field.bold ? 'font-weight-bold' : ''}`}>{field.label}</label>}
            <div className="d-flex flex-wrap">
                {field.params.map((c, index) => 
                    <RadioBox
                        key={index}
                        id={`radio_${id}_${index}`}
                        name={id}
                        label={c.text || field.defaultText + '-' + index}
                        className={`font-14 mr-3 ${className || ''}`}
                        checked={c.value}
                        readOnly={disabled}
                        onChange={(e) => handleChange(index, e.target.checked)}
                    />
                )}
            </div>
        </div>
    )
}

const FormFile = ({id, field, disabled, onFieldChange, className}) => {
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (index, e) => {
        const { params } = field;
        if(!params.length || !onFieldChange || submitting) return;
        setSubmitting(true);

        const { files } = e.target;
        if(!files.length) return;

        const file = files[0];

        let _params = [...params];
        _params[index].fileName = file.name;

        let formData = new FormData();
        formData.append('file', file);

        PostProposeFile(formData).then(res => {
            setSubmitting(false);
            const { path } = res.data;
            _params[index].value = path;
            onFieldChange({...field, params: _params});
        }).catch(err => {
            setSubmitting(false);
            console.log(err);
        });
    }

    return (
        <div>
            {field.label && <label className={`font-14 mt-4 text-white ${className || ''} ${field.bold ? 'font-weight-bold' : ''}`}>{field.label}</label>}
            {field.params.map((f, index) => 
                <div key={index} className="d-flex align-items-center">
                    <div className="flex-grow-1">
                        <TextInput className={className || ''} placeholder={f.placeholder} value={f.value && f.fileName ? f.fileName : ''} readOnly/>
                    </div>
                    <label>
                        {(!submitting && !disabled) &&
                            <input id={`file_${id}_${index}`} name={`file_${id}_${index}`} type="file" hidden onChange={(e) => handleChange(index, e)}/>
                        }
                        <Button label={f.btn} className={`btn-outline btn-append ${className || ''}`}/>
                    </label>
                </div>
            )}
        </div>
    )
}

const FormFactory = ({
    id,
    field,
    editable,
    disabled,
    selected,
    className,
    onEdit,
    onDelete,
    onFieldChange
}) => {
    let Field;
    switch(field.type){
        case 'label':
            Field = FormLabel;
            break;
        case 'input':
            Field = FormInput;
            break;
        case 'checkbox':
            Field = FormCheckBox;
            break;
        case 'radio':
            Field = FormRadio;
            break;
        case 'file':
            Field = FormFile;
            break;
        default:
            break;
    }

    if(!Field) return null;

    return (
        <div className={`color-400 form-field cursor-pointer ${selected ? 'active' : ''}`} onClick={onEdit}>
            <Field
                id={id}
                field={field}
                className={className}
                disabled={editable || disabled}
                onFieldChange={onFieldChange}
            />
            {editable &&
                <div className="edit-overlay">
                    <Icon name="remove" color="#ff4646" className="cursor-pointer" onClick={onDelete}/>
                </div>
            }
        </div>
    )
}

export default FormFactory;