import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Icon } from '../../components';
import { formattedDate } from '../../helpers/utils';
import { GetContent } from '../../store/lib/user_api';

const LpLibraryDetail = () => {
    const history = useHistory();
    const params = useParams();
    const [detail, setDetail] = useState({});
    const [openShareModal, setOpenShareModal] = useState(false);

    useEffect(() => {
        if(params.id){
            GetContent(params.id).then(res => {
                const { data } = res.data;
                setDetail(data || {});
            }).catch(err => {
                console.log(err);
            })
        }
    }, [params]);

    const sendMessageToKakao = () => {
        if(Kakao){
            Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                  title: 'MAGAZINE',
                  description: detail.title,
                  imageUrl: detail.image,
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
        <div id="page-feature" className="pt-5 mb-50p">
            <div className="section-container">
                <h2 className="text-center font-weight-bold text-ttnorm-bd mb-0">LP LIBRARY</h2>
                <div className="feature-detail">
                    <div className="mb-5 py-3 px-2">
                        <div className="html-content" dangerouslySetInnerHTML={{__html: detail.content || ''}}></div>
                    </div>
                    <div className="color-disabled font-14 mb-20p">
                        <span>{formattedDate(detail.created_at, 'yy.mm.dd')}</span>
                    </div>
                    <div className="title-bar align-items-start">
                        <div className="d-flex align-items-center title text-break mb-0">
                            {detail.image && <img src={detail.image} style={{maxHeight: 36, marginRight: 16}}/>}
                            {detail.description && <h5 className="mb-0">{detail.description}</h5>}
                        </div>
                        <div className="tool-bar sm-hide">
                            <img src="/images/icons/chatCircle.png" className="cursor-pointer" onClick={sendMessageToKakao}/>
                            <img src="/images/icons/noteCircle.png" className="cursor-pointer" onClick={handleCopyLink} />
                        </div>
                        <div className="tool-bar ml-1 d-none sm-flex">
                            <Icon name="dotH" className="cursor-pointer font-26" onClick={() => setOpenShareModal(true)}/>
                        </div>
                    </div>
                </div>
            </div>

            {openShareModal && 
                <Modal 
                    show={openShareModal}
                    centered
                    size="sm"
                    onHide={() => setOpenShareModal(false)}
                    contentClassName="back-primary"
                    >
                    <Modal.Body>
                        <div className="d-flex justify-content-between font-18 mb-4">
                            <h4>공유하기</h4>
                            <Icon name="close" className="cursor-pointer" onClick={() => setOpenShareModal(false)}/>
                        </div>
                        <div className="m-auto" style={{width: 190}}>
                            <div className="mb-3 cursor-pointer" onClick={sendMessageToKakao}>
                                <img src="/images/icons/chatCircle.png" className="w-2-rem mr-2"/>
                                <span>카카오톡으로 보내기</span>
                            </div>
                            <div className="cursor-pointer" onClick={handleCopyLink}>
                                <img src="/images/icons/noteCircle.png" className="w-2-rem mr-2"/>
                                <span>링크 복사하기</span>
                            </div>
                        </div>     
                    </Modal.Body>
                </Modal>
            }
        </div>
    )
}

export default LpLibraryDetail;
