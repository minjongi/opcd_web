import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextInput, CheckBox, Button } from "../../../components/form";
import { REQUIRED, INVALID } from '../../../constants/validation';

import { validEmail } from "../../../helpers/utils";
import { CheckRegisterInfo } from '../../../store/auth/api';

const defaultUserInfo = {
    email: '',
    confirm_email: '',
    password: '',
    confirm_password: '',
    name: '',
    birthday: '',
    phone: '',
    address: '',
    address_detail: ''
}

const RegisterUserTab = ({onSubmit}) => {
    const [userInfo, setUserInfo] = useState(defaultUserInfo);
    const [submitting, setSubmitting] = useState(false);
    const [agree, setAgree] = useState({use_privacy: false, personal_privacy: false, market_privacy: false});
    const [errors, setErrors] = useState({});

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        setErrors({...errors, [id]: ''});
        setUserInfo({...userInfo, [id]: value});
    }

    const handleCheckField = (e) => {
        const {id, checked} = e.target;
        setErrors({...errors, agree: ''});
        setAgree({...agree, [id]: checked});
    }

    const handleSubmit = () => {
        if(!validateField() || submitting) return;
        setSubmitting(true);

        CheckRegisterInfo(userInfo).then(res => {
            setSubmitting(false);
            onSubmit(userInfo);
        }).catch(err => {
            setSubmitting(false);
            if(err.response && err.response.data.errors){
                const { email, phone } = err.response.data.errors;
                let _errors = {};
                if(email) _errors = {..._errors, email: INVALID.exist_email};
                if(phone) _errors = {..._errors, phone: INVALID.exist_phone};
                setErrors(_errors);
            }else{
                console.log(err);
            }
        })
    }

    const validateField = () => {
        let _errors = {};

        if(!userInfo.email) _errors = {..._errors, email: REQUIRED.email};
        else if(!validEmail(userInfo.email) || userInfo.email !== userInfo.confirm_email) _errors = {..._errors, email: INVALID.email};

        if(!userInfo.password) _errors = {..._errors, password: REQUIRED.password};
        else if(userInfo.password !== userInfo.confirm_password) _errors = {..._errors, password: INVALID.password};

        if(!userInfo.name) _errors = {..._errors, name: REQUIRED.name};

        if(!userInfo.birthday) _errors = {..._errors, birthday: REQUIRED.birthday};
        else if(isNaN(userInfo.birthday) || userInfo.birthday.length > 8) _errors = {..._errors, birthday: INVALID.birthday};

        if(!userInfo.phone) _errors = {..._errors, phone: REQUIRED.phone};
        else if(isNaN(userInfo.phone)) _errors = {..._errors, phone: INVALID.phone};

        if(!userInfo.address) _errors = {..._errors, address: REQUIRED.address};

        if(!agree.use_privacy || !agree.personal_privacy) _errors = {..._errors, agree: INVALID.agree};

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
                    // ???????????? ????????? ????????? ???????????? ??????
                    addr = data.roadAddress;
                } else {
                    // ???????????? ?????? ????????? ???????????? ??????(J)
                    addr = data.jibunAddress;
                }

                if(data.userSelectedType === 'R'){
                    // ??????????????? ?????? ?????? ????????????. (???????????? ??????)
                    // ???????????? ?????? ????????? ????????? "???/???/???"??? ?????????.
                    if(data.bname !== '' && /[???|???|???]$/g.test(data.bname)){
                        extraAddr += data.bname;
                    }
                    // ???????????? ??????, ??????????????? ?????? ????????????.
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                }

                setUserInfo({...userInfo, address: addr, address_detail: extraAddr});
            }
        }).open();
    }

    return (
        <>
            <label className="d-flex justify-content-between">
                <span>????????? ??????<span className="color-purple">*</span></span>
                <span className="color-400"><span className="color-purple">*</span>??? ?????? ?????????????????????.</span>
            </label>
            <TextInput
                id="email"
                name="email"
                type="text"
                value={userInfo.email}
                onChange={handleChangeField}
            />
            <TextInput
                id="confirm_email"
                name="confirm_email"
                type="text"
                placeholder="????????? ?????? ?????? ??? ??????"
                value={userInfo.confirm_email}
                onChange={handleChangeField}
            />
            {errors.email && <div className="error-message mb-1 mt--8">{errors.email}</div>}

            <label className="mt-2">????????????<span className="color-purple">*</span></label>
            <TextInput
                id="password"
                name="password"
                type="password"
                value={userInfo.password}
                onChange={handleChangeField}
            />
            <TextInput
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="???????????? ?????? ??? ??????"
                value={userInfo.confirm_password}
                onChange={handleChangeField}
            />
            {errors.password && <div className="error-message mb-1 mt--8">{errors.password}</div>}

            <label className="mt-2">??????<span className="color-purple">*</span></label>
            <TextInput
                id="name"
                name="name"
                type="text"
                value={userInfo.name}
                onChange={handleChangeField}
            />
            {errors.name && <div className="error-message mb-1 mt--8">{errors.name}</div>}
            
            <label className="mt-2">???????????? 8?????? (??? 19830604)<span className="color-purple">*</span></label>
            <TextInput
                id="birthday"
                name="birthday"
                type="text"
                value={userInfo.birthday}
                onChange={handleChangeField}
            />
            {errors.birthday && <div className="error-message mb-1 mt--8">{errors.birthday}</div>}

            <label className="mt-2">????????? ?????? (????????? ??????)<span className="color-purple">*</span></label>
            <TextInput
                id="phone"
                name="phone"
                type="text"
                value={userInfo.phone}
                onChange={handleChangeField}
            />
            {errors.phone && <div className="error-message mb-1 mt--8">{errors.phone}</div>}

            <label className="mt-2">??????<span className="color-purple">*</span></label>
            <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                    <TextInput
                        id="address"
                        name="address"
                        type="text"
                        value={userInfo.address || ''}
                        onChange={handleChangeField}
                    />
                </div>
                <Button
                    className="btn-outline btn-append"
                    style={{marginBottom: 10, padding: '6px 20px'}}
                    label={'??????'}
                    onClick={handelSearchAddress}/>
            </div>
            <TextInput
                id="address_detail"
                name="address_detail"
                type="text"
                placeholder="??????????????????"
                value={userInfo.address_detail}
                onChange={handleChangeField}
            />
            {errors.address && <div className="error-message mb-1 mt--8">{errors.address}</div>}

            <h6 className="font-weight-bold mt-5 mb-3 pb-2 border-b">???????????? ??? ???????????? ????????????</h6>

            <CheckBox
                id="use_privacy"
                name="use_privacy"
                label="[??????] ???????????? ??????"
                append={<Link to="/privacy_policy?type=use" target="_blank" className="ml-2 link dark">??????</Link>}
                checked={agree.use_privacy}
                onChange={handleCheckField}
            />
            <CheckBox
                id="personal_privacy"
                name="personal_privacy"
                label="[??????] ???????????? ???????????? ??????"
                append={<Link to="/privacy_policy?type=personal" target="_blank" className="ml-2 link dark">??????</Link>}
                checked={agree.personal_privacy}
                onChange={handleCheckField}
            />
            <CheckBox
                id="market_privacy"
                name="market_privacy"
                label="[??????] ????????? ?????? ?????? ??? ????????? ?????? ??????"
                checked={agree.market_privacy}
                onChange={handleCheckField}
            />
            {errors.agree && <div className="error-message mb-1">{errors.agree}</div>}

            <Button className="my-5 btn-color-purple font-16" label={'??????'} onClick={() => handleSubmit()}/>
        </>
                            
    )
}

export default RegisterUserTab;
