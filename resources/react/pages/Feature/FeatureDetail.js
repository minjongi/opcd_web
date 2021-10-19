import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PerfectScrollBar from 'react-perfect-scrollbar';

import { FeatureCard } from '../../components/cards';
import { FeatureGallery, Icon } from '../../components';
import { Button } from '../../components/form'
import { formattedDate, fetchTags, encodeStr } from '../../helpers/utils';
import { GetFeature, GetRelatedFeatures } from '../../store/feature/api';

const FeatureDetail = () => {
    const history = useHistory();
    const params = useParams();
    const [relatedData, setRelatedData] = useState([]);
    const [detail, setDetail] = useState({});
    const [openShareModal, setOpenShareModal] = useState(false);

    const [ended, setEnded] = useState(false);
    const [pageInfo, setPageInfo] = useState({
        perPage: 9,
        page: 1,
    });

    useEffect(() => {
        if(params.id){
            GetFeature(params.id).then(res => {
                const { data } = res.data;
                setDetail(data || {});
                loadRelatedData(pageInfo, data);
                window && window.scrollTo({ top: 0, behavior: 'smooth' });
            }).catch(err => {
                console.log(err);
            })
        }
    }, [params]);

    const loadRelatedData = (state, data = null) => {
        let _data = data || detail;
        if(ended || !_data.id) return;
        
        GetRelatedFeatures(_data.id, state).then(res => {
            const { related } = res.data;
            if(!related || !related.length) {
                setEnded(true);
            }else{
                setPageInfo(state);
                setRelatedData([...relatedData, ...related]);
            }
        });
    }

    const handleMore = () => {
        const _pageInfo = {...pageInfo, page: pageInfo.page + 1};
        loadRelatedData(_pageInfo);
    }

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
                <h2 className="text-center font-weight-bold text-ttnorm-bd mb-0">MAGAZINE</h2>
                <div className="feature-detail">
                    <div className="mb-5 py-3 px-2">
                        <div className="html-content" dangerouslySetInnerHTML={{__html: detail.content || ''}}></div>
                    </div>
                    <div className="color-disabled font-14 mb-20p">
                        <span>{formattedDate(detail.created_at, 'yy.mm.dd')}</span>
                    </div>
                    <div className="title-bar align-items-start">
                        <div className="title text-break">
                            {detail.title && <h5 className="mb-0">{detail.title}</h5>}
                        </div>
                        <div className="tool-bar sm-hide">
                            <img src="/images/icons/chatCircle.png" className="cursor-pointer" onClick={sendMessageToKakao}/>
                            <img src="/images/icons/noteCircle.png" className="cursor-pointer" onClick={handleCopyLink} />
                        </div>
                        <div className="tool-bar ml-1 d-none sm-flex">
                            <Icon name="dotH" className="cursor-pointer font-26" onClick={() => setOpenShareModal(true)}/>
                        </div>
                    </div>
                    <div className="color-disabled font-16 mb-20p">{detail.description}</div>
                    {detail.tag &&  
                        <div className="mt-2 tag-container two-line-truncate">
                            {fetchTags(detail.tag).map((t, index) =>
                                <span key={index} className="d-inline-block cursor-pointer mr-2 px-14 mb-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        history.push(`/search?kword=${encodeStr(t)}`)
                                    }}>{t}</span>
                            )}
                        </div>
                    }
                </div>

                <h4 className="font-weight-bold text-center mt-4 mb-40p">유사한 콘텐츠 추천</h4>
                {relatedData ?
                    <div>
                        <Row className="space-10">
                            {relatedData.map((d, index) => 
                                <Col key={index} xs={12} sm={4} className="col mb-40p">
                                    <FeatureCard data={d}/>
                                </Col>
                            )}
                        </Row>

                        <Button label="MORE" className="btn-outline hovered more_btn" onClick={handleMore}/>
                    </div>
                    :
                    <p className="color-400 text-center my-4">자료가 없습니다</p>
                }
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

export default FeatureDetail;
