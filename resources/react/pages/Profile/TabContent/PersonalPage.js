import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button, TextInput, CheckBox } from '../../../components/form';
import { Avatar } from '../../../components';

import { defaultPositions } from '../../../constants/defaults';
import { REQUIRED, INVALID } from '../../../constants/validation';
import { positionSplit, positionJoin, validEmail } from '../../../helpers/utils';

import { clearAccessToken } from '../../../helpers/authority';
import { updateUser, deleteUser } from '../../../store/actions';

import { PostUserProfile, GetUserProfile, DeleteAccount } from '../../../store/auth/api';

const PersonalPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [userInfo, setUserInfo] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    
    const [position, setPosition] = useState({});
    const [checkedOther, setCheckedOther] = useState(false);
    const [otherPosition, setOtherPosition] = useState('');

    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        GetUserProfile().then(res => {
            const { user } = res.data;
            const { position, ...rest } = user;

            const splitedPostion = positionSplit(position);
            setPosition(splitedPostion.position);
            setCheckedOther(splitedPostion.hasCustom);
            setOtherPosition(splitedPostion.customPosition);

            setUserInfo(rest);

        }).catch(err => {
            console.log(err);
        });
    }, []);

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
        PostUserProfile(_formData).then(res => {
            setSubmitting(false);
            const { user } = res.data;
            dispatch(updateUser(user));
            toast.success('??????????????? ???????????? ???????????????.');
        }).catch(err => {
            setSubmitting(false);
            if(err.response && err.response.data.errors){
                const { email, phone } = err.response.data.errors;
                let _errors = {};
                if(email) _errors = {..._errors, email: INVALID.exist_email};
                if(phone) _errors = {..._errors, phone: INVALID.exist_phone};
                setErrors(_errors);
            }else{
                toast.error('???????????? ?????????????????????.');
            }
        });
    }

    const validateField = () => {
        let _errors = {};

        // if(!userInfo.name) _errors = {..._errors, name: REQUIRED.name};

        // if(!userInfo.birthday) _errors = {..._errors, birthday: REQUIRED.birthday};
        // else if(isNaN(userInfo.birthday) || userInfo.birthday.length > 8) _errors = {..._errors, birthday: INVALID.birthday};

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

    const handleDeleteAccount = () => {
        DeleteAccount().then(res => {
            clearAccessToken();
            dispatch(deleteUser());
            history.push('/main');
        }).catch(err => {
            console.log(err);
        });
    }

    if(!userInfo) return null;

    return (
        <div>
            <div>
                <div className="font-14">SNS ?????? ?????????</div>
                <div className="color-400 font-14 mb-2">????????? SNS???????????? ????????? ???????????????.</div>
                <div>
                    <a href={userInfo.google_id ? '' : `${process.env.MIX_API_URL}/login/google?id=${userInfo.id}`} className="text-decoration-none">
                        <Button
                            className="mb-2 font-16 btn-contain"
                            label={(
                                <div className="op-social-btn">
                                    <img src="/images/icons/google.png"/>
                                    <span>{userInfo.google_id ? "Google??? ????????????" : "Google??? ????????????"}</span>
                                </div>
                            )}
                        />
                    </a>

                    <a href={userInfo.naver_id ? '' : `${process.env.MIX_API_URL}/login/naver?id=${userInfo.id}`} className="text-decoration-none">
                        <Button
                            className="mb-2 font-16 btn-contain"
                            label={(
                                <div className="op-social-btn">
                                    <img src="/images/icons/naver.png"/>
                                    <span>{userInfo.naver_id ? "???????????? ????????????" : "???????????? ????????????"}</span>
                                </div>
                            )}
                        />
                    </a>

                    <a href={userInfo.kakao_id ? '' : `${process.env.MIX_API_URL}/login/kakao?id=${userInfo.id}`} className="text-decoration-none">
                        <Button
                            className="mb-2 font-16 btn-contain"
                            label={(
                                <div className="op-social-btn">
                                    <img src="/images/icons/kakaotalk.png"/>
                                    <span>{userInfo.kakao_id ? "???????????? ????????????" : "???????????? ????????????"}</span>
                                </div>
                            )}
                        />
                    </a>
                </div>
            </div>
            
            <div className="border-b my-5">{' '}</div>

            <div className="d-flex flex-column align-items-center mb-4">
                <Avatar
                    url={(imageFile && imageFile.preview) || userInfo.avatar || ''}
                    editable
                    onChange={(image) => setImageFile(image)}
                />
            </div>

            <div className="font-14">
                <label>???????????? ??????</label>
                <TextInput
                    id="password"
                    name="password"
                    type="text"
                    value={userInfo.password || ''}
                    onChange={handleChangeField}
                />
                <TextInput
                    id="password_confirm"
                    name="password_confirm"
                    type="text"
                    placeholder="?????? ??? ??????"
                    value={userInfo.password_confirm || ''}
                    onChange={handleChangeField}
                />
                {errors.password && <div className="error-message mb-1 mt--8">{errors.password}</div>}


                <label className="mt-5">??????</label>
                <TextInput
                    id="name"
                    name="name"
                    type="text"
                    readOnly
                    value={userInfo.name || ''}
                    onChange={handleChangeField}
                />

                <label className="mt-2">????????????</label>
                <TextInput
                    id="birthday"
                    name="birthday"
                    type="text"
                    readOnly
                    value={userInfo.birthday || ''}
                    onChange={handleChangeField}
                />

                <label className="mt-2">????????? ??????</label>
                <TextInput
                    id="phone"
                    name="phone"
                    type="text"
                    value={userInfo.phone || ''}
                    onChange={handleChangeField}
                />
                {errors.phone && <div className="error-message mb-1 mt--8">{errors.phone}</div>}

                <label className="mt-2">???????????????</label>
                <TextInput
                    id="email"
                    name="email"
                    type="text"
                    value={userInfo.email || ''}
                    onChange={handleChangeField}
                />
                {errors.email && <div className="error-message mb-1 mt--8">{errors.email}</div>}

                <label className="mt-2">??????</label>
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
                    value={userInfo.address_detail || ''}
                    onChange={handleChangeField}
                />
                {errors.address && <div className="error-message mb-1 mt--8">{errors.address}</div>}

                <label className="border-b mt-5 w-100 mb-4">???????????? ?????? ??????</label>

                <label>???????????????</label>
                <TextInput
                    id="artist_name"
                    name="artist_name"
                    type="text"
                    value={userInfo.artist_name || ''}
                    onChange={handleChangeField}
                />

                <label className="mt-2">?????????</label>
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
                        label="??????"
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

                <label className="mt-2">???????????? <span>SNS</span>????????????</label>
                <TextInput
                    id="social_1"
                    name="social_1"
                    type="text"
                    placeholder="SoundCloud"
                    value={userInfo.social_1 || ''}
                    onChange={handleChangeField}
                />
                <TextInput
                    id="social_2"
                    name="social_2"
                    type="text"
                    placeholder="Instagram"
                    value={userInfo.social_2 || ''}
                    onChange={handleChangeField}
                />
                <TextInput
                    id="social_3"
                    name="social_3"
                    type="text"
                    placeholder="Facebook"
                    value={userInfo.social_3 || ''}
                    onChange={handleChangeField}
                />
                <TextInput
                    id="social_4"
                    name="social_4"
                    type="text"
                    placeholder="??? ??? ??????SNS"
                    value={userInfo.social_4 || ''}
                    onChange={handleChangeField}
                />

                <label className="border-b mt-5 w-100 mb-4">????????? ?????? ?????? ??? ?????? ??????</label>
                <div className="d-flex flex-wrap">
                    <CheckBox
                        id="market_message"
                        name="market_message"
                        label="???????????????"
                        className="mr-4 color-400"
                        checked={userInfo.market_message}
                        onChange={handleCheckMarket}
                    />
                    <CheckBox
                        id="market_mail"
                        name="market_mail"
                        label="?????????"
                        className="mr-4 color-400"
                        checked={userInfo.market_mail}
                        onChange={handleCheckMarket}
                    />
                </div>
                <div>
                    <p className="m-0 color-400 font-12">OPCD??? ??????/????????? ????????? ??? ???????????? ???????????? ?????? ?????????.</p>
                    <p className="m-0 color-400 font-12">???, ???????????? ?????? ?????? ????????? ??? ?????? ????????? ???????????? ?????? ?????????.</p>
                </div>

                <Button className="my-5 font-16 btn-color-purple" label={'??????'} onClick={() => handleSubmit()}/>

                <div className="text-center mb-5 color-400" onClick={handleDeleteAccount}>
                    <span className="d-block cursor-pointer">????????????</span>
                </div>
            </div>
        </div>
    )
}

export default PersonalPage;