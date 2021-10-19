import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Avatar, CircleFullSpinner } from '../../components';
import { TextInput, Button, RadioBox, CheckBox } from '../../components/form';
import { defaultPositions } from '../../constants/defaults';
import { REQUIRED, INVALID } from '../../constants/validation';
import { positionSplit, positionJoin, validEmail } from '../../helpers/utils';

import { PostMember, GetMember } from '../../store/member/api';

const MemberForm = () => {
    const history = useHistory();
    const params = useParams();
    const [submitting, setSubmitting] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [errors, setErrors] = useState({});
    
    const [position, setPosition] = useState({});
    const [checkedOther, setCheckedOther] = useState(false);
    const [otherPosition, setOtherPosition] = useState('');

    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if(params && params.id){
            GetMember(params.id).then(res => {
                const { position, ...rest } = res.data.data;

                const splitedPostion = positionSplit(position);
                setPosition(splitedPostion.position);
                setCheckedOther(splitedPostion.hasCustom);
                setOtherPosition(splitedPostion.customPosition);

                setUserInfo(rest);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [params])

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        setErrors({...errors, [id]: ''});
        setUserInfo({...userInfo, [id]: value});
    }

    const handleCheckMarket = (e) => {
        const {id, checked} = e.target;
        setUserInfo({...userInfo, [id]: checked});
    }

    const handleCheckField = (e) => {
        const {id, checked} = e.target;
        setPosition({...position, [id]: checked});
    }

    const handleSubmit = () => {
        if(!validateField() || submitting) return;
        
        let _formData = new FormData();
        _formData.append('phone', userInfo.phone);
        _formData.append('email', userInfo.email);
        _formData.append('address', userInfo.address);
        _formData.append('address_detail', userInfo.address_detail || '');
        _formData.append('artist_name', userInfo.artist_name || '');
        _formData.append('position', positionJoin(position, checkedOther, otherPosition));
        _formData.append('social_1', userInfo.social_1 || '');
        _formData.append('social_2', userInfo.social_2 || '');
        _formData.append('social_3', userInfo.social_3 || '');
        _formData.append('social_4', userInfo.social_4 || '');
        _formData.append('market_message', userInfo.market_message ? 1 : 0);
        _formData.append('market_mail', userInfo.market_mail ? 1 : 0);
        if(imageFile) _formData.append('file', imageFile.file);
        if(userInfo.password) _formData.append('password', userInfo.password);

        setSubmitting(true);
        PostMember(params.id, _formData).then(res => {
            setSubmitting(false);
            toast.success('성공적으로 업데이트 되였습니다.');
        }).catch(err => {
            setSubmitting(false);
            if(err.response && err.response.data.errors){
                const { email, phone } = err.response.data.errors;
                let _errors = {};
                if(email) _errors = {..._errors, email: INVALID.exist_email};
                if(phone) _errors = {..._errors, phone: INVALID.exist_phone};
                setErrors(_errors);
            }else{
                toast.error('업데이트 실패하였습니다.');
            }
        });
    }

    const validateField = () => {
        let _errors = {};

        // if(!userInfo.name) _errors = {..._errors, name: REQUIRED.name};

        if(!userInfo.birthday) _errors = {..._errors, birthday: REQUIRED.birthday};
        else if(isNaN(userInfo.birthday) || userInfo.birthday.length > 8) _errors = {..._errors, birthday: INVALID.birthday};

        if(userInfo.password && userInfo.password !== userInfo.password_confirm) _errors = {..._errors, password: INVALID.password};

        if(!userInfo.phone) _errors = {..._errors, phone: REQUIRED.phone};
        else if(isNaN(userInfo.phone)) _errors = {..._errors, phone: INVALID.phone};

        if(!userInfo.email) _errors = {..._errors, email: REQUIRED.email};
        else if(!validEmail(userInfo.email)) _errors = {..._errors, email: INVALID.email};

        if(!userInfo.address) _errors = {..._errors, address: REQUIRED.address};

        setErrors(_errors);

        if(!Object.keys(_errors).length) return true;
        return false;
    }

    const handelSearchAddress = () => {
        if(!daum) return;

        new daum.Postcode({
            onComplete: function(data){
                let addr = '', extraAddr = '';

                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress;
                } else {
                    addr = data.jibunAddress;
                }

                if(data.userSelectedType === 'R'){
                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraAddr += data.bname;
                    }
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                }

                setUserInfo({...userInfo, address: addr, address_detail: extraAddr});
            }
        }).open();
    }

    if(!userInfo) return null;

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">회원정보</h4>

            <div className="font-14 max-w-768 m-auto">
                <div className="d-flex flex-column align-items-center mb-4">
                    <Avatar
                        url={(imageFile && imageFile.preview) || userInfo.avatar || ''}
                        editable
                        onChange={(image) => setImageFile(image)}
                    />
                </div>

                <label>비밀번호 변경</label>
                <TextInput
                    id="password"
                    name="password"
                    type="text"
                    className="light"
                    value={userInfo.password || ''}
                    onChange={handleChangeField}
                />
                <TextInput
                    id="password_confirm"
                    name="password_confirm"
                    type="text"
                    className="light"
                    placeholder="한번 더 입력"
                    value={userInfo.password_confirm || ''}
                    onChange={handleChangeField}
                />
                {errors.password && <div className="error-message mb-1 mt--8">{errors.password}</div>}

                <label className="mt-5">이름</label>
                <TextInput
                    id="name"
                    name="name"
                    type="text"
                    readOnly
                    className="light"
                    value={userInfo.name || ''}
                    onChange={handleChangeField}
                />

                <label className="mt-2">생년월일</label>
                <TextInput
                    id="birthday"
                    name="birthday"
                    type="text"
                    className="light"
                    value={userInfo.birthday || ''}
                    onChange={handleChangeField}
                />

                <label className="mt-2">휴대폰 번호</label>
                <TextInput
                    id="phone"
                    name="phone"
                    type="text"
                    className="light"
                    value={userInfo.phone || ''}
                    onChange={handleChangeField}
                />
                {errors.phone && <div className="error-message mb-1 mt--8">{errors.phone}</div>}

                <label className="mt-2">이메일주소</label>
                <TextInput
                    id="email"
                    name="email"
                    type="text"
                    className="light"
                    value={userInfo.email || ''}
                    onChange={handleChangeField}
                />
                {errors.email && <div className="error-message mb-1 mt--8">{errors.email}</div>}

                <label className="mt-2">주소</label>
                <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                        <TextInput
                            id="address"
                            name="address"
                            type="text"
                            className="light"
                            value={userInfo.address || ''}
                            onChange={handleChangeField}
                        />
                    </div>
                    <Button
                        className="btn-outline btn-append light"
                        style={{marginBottom: 10, padding: '6px 20px'}}
                        label={'변경'}
                        onClick={handelSearchAddress}/>
                </div>
                
                <TextInput
                    id="address_detail"
                    name="address_detail"
                    type="text"
                    className="light"
                    value={userInfo.address_detail || ''}
                    onChange={handleChangeField}
                />
                {errors.address && <div className="error-message mb-1 mt--8">{errors.address}</div>}

                <label className="border-b mt-5 w-100 mb-4">아티스트 옵션 정보</label>

                <label>아티스트명</label>
                <TextInput
                    id="artist_name"
                    name="artist_name"
                    type="text"
                    className="light"
                    value={userInfo.artist_name || ''}
                    onChange={handleChangeField}
                />

                <label className="mt-2">포지션</label>
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
                            className="light"
                            value={otherPosition}
                            onChange={(e) => setOtherPosition(e.target.value)}
                        />
                    }
                </div>

                <label className="mt-2">활동중인 <span>SNS</span>정보입력</label>
                <TextInput
                    id="social_1"
                    name="social_1"
                    type="text"
                    placeholder="SoundCloud"
                    className="light"
                    value={userInfo.social_1 || ''}
                    onChange={handleChangeField}
                />
                <TextInput
                    id="social_2"
                    name="social_2"
                    type="text"
                    placeholder="Instagram"
                    className="light"
                    value={userInfo.social_2 || ''}
                    onChange={handleChangeField}
                />
                <TextInput
                    id="social_3"
                    name="social_3"
                    type="text"
                    placeholder="Facebook"
                    className="light"
                    value={userInfo.social_3 || ''}
                    onChange={handleChangeField}
                />
                <TextInput
                    id="social_4"
                    name="social_4"
                    type="text"
                    placeholder="이 외 활동SNS"
                    className="light"
                    value={userInfo.social_4 || ''}
                    onChange={handleChangeField}
                />

                <label className="border-b mt-5 w-100 mb-4">마케팅 정보 수신 및 활용 동의</label>
                <div className="d-flex flex-wrap">
                    <CheckBox
                        id="market_message"
                        name="market_message"
                        label="문자메세지"
                        className="mr-4 color-400"
                        checked={userInfo.market_message}
                        onChange={handleCheckMarket}
                    />
                    <CheckBox
                        id="market_mail"
                        name="market_mail"
                        label="이메일"
                        className="mr-4 color-400"
                        checked={userInfo.market_mail}
                        onChange={handleCheckMarket}
                    />
                </div>
            </div>

            <div className="d-flex px-1 justify-content-center mt-5">
                <Button label="업데이트" className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                <Button label="돌아가기" className="light px-5 mx-2" onClick={() => history.push('/admin/members')}/>
            </div>
        </div>
    )
};

export default MemberForm;