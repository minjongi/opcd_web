import React from 'react';

import { TextInput, CheckBox } from '../form';

const PropertyPanel = ({property, onChange}) => {

    if(!property) return null;

    const handleChangeField = (e) => {
        const { id, value } = e.target;
        const _property = {...property, [id]: value};
        onChange(_property);
    }

    const handleChangeCheck = (e) => {
        const { id, checked } = e.target;
        const _property = {...property, [id]: checked};
        onChange(_property);
    }

    const handleChangeCount = (e) => {
        const {id, value} = e.target;
        if(value <= 0) return;

        let _params = property.params.slice(0, value);
        if(_params.length < value){
            for(let i = 0; i < (value - _params.length) ; i++){
                _params = [..._params, {...property.defaultParam}];
            }
        }

        onChange({...property, params: _params});
    }

    const handleChangeParam = (e, index) => {
        const { value } = e.target;
        let params = [...property.params];
        if(property.type === 'file'){
            params[index].placeholder = value;
        }else{
            params[index].text = value;
        }

        onChange({...property, params});
    }

    return (
        <div>
            <div className="font-weight-bold">라벨</div>
            <hr className="my-1"/>
            <CheckBox id="bold" label="볼드체" checked={!!property.bold} onChange={handleChangeCheck}/>
            <TextInput id="label" className="light sm" value={property.label} onChange={handleChangeField}/>

            <div className="font-weight-bold mt-4">콘텐츠</div>
            <hr className="my-1"/>
            {property.params &&
                <div>
                    <TextInput id="count" type="number" className="light sm" value={property.params.length} onChange={handleChangeCount}/>
                </div>
            }

            {property.params && !!property.params.length && property.params.map((p, index) => 
                <TextInput
                    key={index}
                    className="light sm"
                    value={p.text || p.placeholder || ''}
                    onChange={(e) => handleChangeParam(e, index)}
                    placeholder={property.defaultText ? property.defaultText + '-' + index : property.defaultPlaceholder}/>
            )}

            {property.type === 'input' &&
                <TextInput
                    id="placeholder"
                    className="light sm"
                    value={property.placeholder || ''}
                    onChange={handleChangeField}/>
            }
        </div>
    )
}

export default PropertyPanel;