import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Avatar } from '../../components';
import { GetArtistProfile } from '../../store/auth/api';

const Profile = () => {
    const params = useParams();
    const history = useHistory();
    const [profile, setProfile] = useState({});

    useEffect(() => {
        if(params.id){
          GetArtistProfile(params.id).then(res => {
              const { profile } = res.data;
              setProfile(profile);
          }).catch(err => {
              history.push('/main');
          });
        }else{
            history.push('/main');
        }
    }, [params]);

    const sendMessageToKakao = () => {
        if(Kakao){
            Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                  title: 'PROFILE',
                  description: profile.artist_name || '',
                  imageUrl: profile.avatar || '/images/icons/profile_avatar.png',
                  link: {
                    mobileWebUrl: 'https://developers.kakao.com',
                    androidExecParams: 'test',
                  },
                },
                buttons: [
                  {
                    title: '웹으로 이동',
                    link: {
                      mobileWebUrl: 'https://developers.kakao.com',
                    },
                  },
                  {
                    title: '앱으로 이동',
                    link: {
                      mobileWebUrl: 'https://developers.kakao.com',
                    },
                  },
                ]
              });
        }
    }

    const handleCopyLink = () => {
        const el = document.createElement('textarea');
        el.value = window.location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        toast.success('복사되였습니다. 원하시는 곳에 "Ctrl+V" 하세요.');
    }

    return (
        <div className="login-page-content">
            <div className="section-container">
                <div  className="max-w-500 m-auto">
                    <div className="heading">
                        <h2 className="text-ttnorm-bd text-center border-b-3 my-5 pt-3 pb-4 font-weight-bold">Profile</h2>
                    </div>
                    
                    <div className="d-flex flex-column align-items-center mt-4">
                        <Avatar url={profile.avatar || ''}/>
                        <div className="font-weight-bold mt-1">{profile.artist_name || ''}</div>
                        <div className="font-12 text-center max-w-300">{profile.position}</div>
                    </div>

                    <div className="text-center mt-4">
                        <img src="/images/icons/chatCircle.png" className="cursor-pointer w-2-rem mx-1" onClick={sendMessageToKakao}/>
                        <img src="/images/icons/noteCircle.png" className="cursor-pointer w-2-rem mx-1" onClick={handleCopyLink} />
                    </div>

                    <div className="my-5">
                        <p>활동중인 SNS</p>
                        {profile.social_1 && <div className="mb-1"><a href={profile.social_1} target="_blank" className="text-white">{profile.social_1}</a></div>}
                        {profile.social_2 && <div className="mb-1"><a href={profile.social_2} target="_blank" className="text-white">{profile.social_2}</a></div>}
                        {profile.social_3 && <div className="mb-1"><a href={profile.social_3} target="_blank" className="text-white">{profile.social_3}</a></div>}
                        {profile.social_4 && <div className="mb-1"><a href={profile.social_4} target="_blank" className="text-white">{profile.social_4}</a></div>}
                    </div>
                </div>
            </div>
        </div>   
    )
}

export default Profile;




