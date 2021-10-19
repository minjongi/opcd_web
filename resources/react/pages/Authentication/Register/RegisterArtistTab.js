import React, { useState } from 'react';
import { TextInput, CheckBox, Button } from "../../../components/form";

import { defaultPositions } from '../../../constants/defaults';
import { positionJoin } from '../../../helpers/utils';

const RegisterArtistTab = ({onSubmit}) => {
    const [artInfo, setArtInfo] = useState({});
    const [position, setPosition] = useState({});

    const [checkedOther, setCheckedOther] = useState(false);
    const [otherPosition, setOtherPosition] = useState('');
    
    const handleChangeField = (e) => {
        const {id, value} = e.target;

        setArtInfo({...artInfo, [id]: value});
    }

    const handleCheckField = (e) => {
        const {id, checked} = e.target;
        
        setPosition({...position, [id]: checked});
    }

    const handleSubmit = () => {
        onSubmit({...artInfo, position: positionJoin(position, checkedOther, otherPosition)});
    }

    return (
        <>
            <label>아티스트명</label>
            <TextInput
                id="artist_name"
                name="artist_name"
                type="text"
                value={artInfo.artist_name || ''}
                onChange={handleChangeField}
            />

            <label>포지션</label>
            <div className="d-flex flex-wrap">
                {defaultPositions.map((p, index) => 
                    <CheckBox
                        key={index}
                        id={p.key}
                        name={p.key}
                        label={p.value}
                        className="mr-4"
                        checked={position[p.key] || false}
                        onChange={handleCheckField}
                    />
                )}
            </div>
            <div>
                <CheckBox
                    id="other"
                    name="other"
                    label="기타"
                    className="mr-3"
                    checked={checkedOther}
                    onChange={(e) => setCheckedOther(e.target.checked)}
                />
                {checkedOther && 
                    <TextInput
                        id="otherPos"
                        name="otherPos"
                        type="text"
                        value={otherPosition}
                        onChange={(e) => setOtherPosition(e.target.value)}
                    />
                }
            </div>

            <div className="my-5">{' '}</div>

            <label>활동<span>SNS</span>정보</label>
            <TextInput
                id="social_1"
                name="social_1"
                type="text"
                placeholder="SoundCloud"
                value={artInfo.social_1}
                onChange={handleChangeField}
            />
            <TextInput
                id="social_2"
                name="social_2"
                type="text"
                placeholder="Instagram"
                value={artInfo.social_2}
                onChange={handleChangeField}
            />
            <TextInput
                id="social_3"
                name="social_3"
                type="text"
                placeholder="Facebook"
                value={artInfo.social_3}
                onChange={handleChangeField}
            />
            <TextInput
                id="social_4"
                name="social_4"
                type="text"
                placeholder="이 외 활동SNS"
                value={artInfo.social_4}
                onChange={handleChangeField}
            />

            <Button className="my-5 font-16 btn-color-purple" label={'가입 완료'} onClick={() => handleSubmit()}/>
        </>
    )
}

export default RegisterArtistTab;
