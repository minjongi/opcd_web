import React from 'react';
import Icon from '../Icon';

const FileView = ({label, files}) => {
    const _files = files.filter(f => !!f.fileName);
    if(!_files.length) return null;

    return (
        <>
            <p className="font-14 mt-4 mb-2">{label}</p>
            {files && !!files.length && files.map((f, index) => {
                if(!f.fileName) return null;
                return (
                    <a key={index} href={f.value} className="text-decoration-underline cursor-pointer" download>
                        {f.fileName}
                        <Icon name="download" color="#606060" className="ml-4"/>
                    </a>
                        
                )
            })}
        </>
    )
}

const FormContentView = ({data}) => {
    if(!data) return null;

    console.log(data);

    const paramsToStr = (params) => {
        if(!params || !params.length) return '';
        const param = params.reduce((reducer, val) => {
            if(val.value) return reducer ? reducer + ', ' + val.text : val.text;
            return reducer;
        }, '');
        return param;
    }

    return (
        <>
            {data.map((f, index) => {
                if(f.type === 'input'){
                    return <p className="mb-1" key={index}>{f.label}: {f.value || ''}</p>
                }else if(f.type === 'checkbox' || f.type === 'radio'){
                    return <p className="mb-1" key={index}>{f.label}: {paramsToStr(f.params)}</p>
                }else if(f.type === 'label'){
                    return <p className="mt-3 mb-1 font-weight-bold" key={index}>{f.label}</p>
                }else if(f.type === 'file'){
                    return <FileView key={index} label={f.label} files={f.params}/>
                }
            })}
        </>
    )
}

export default FormContentView;