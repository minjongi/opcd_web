import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Slider from "react-slick";

import { CircleFullSpinner } from '../../components';
import RdaSelectBox from '../../components/RdaSelectBox';
import { fileExtension } from '../../helpers/utils';

import { GetRdaOptions, PostRda, GetRdaCampaings, PostRdaCampaingRequest } from '../../store/rda/api'

const settings = {
  dots: true,
  infinite: true,
  autoplay: true,
  // speed: 2000,
  autoplaySpeed: 3000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const defaultData = {
  artist_name: '',
  song_name: '',
  genre: '',
  email: '',
  phone: '',
  code: ''
}

const RDA = () => {
    const history = useHistory();
    const [submitting, setSubmitting] = useState(true);
    const [formData, setFormData] = useState(defaultData);
    const [data, setData] = useState({});
    const [logo, setLogo] = useState('');
    const [setting, setSetting] = useState({});
    const [banners, setBanners] = useState([]);
    const [contents, setContents] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [policyAgree, setPolicyAgree] = useState(true);
    const [campaigns, setCampaigns] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
      GetRdaOptions().then(res => {
        const {settings, contents, banners, ...rest} = res.data;

        let _settings = settings.reduce((reducer, s) => {return {...reducer, [s.type]: s.content}}, {});
        if(_settings.rda_setting) setSetting(JSON.parse(_settings.rda_setting));
        if(_settings.rda_logo) setLogo(_settings.rda_logo);

        let _contents = contents.reduce((reducer, c) => {return {...reducer, [c.type]: c}}, {});
        setContents(_contents);
        setBanners(banners || []);

        setData(rest);
        setSubmitting(false);
      });
      GetRdaCampaings().then(res => {
        const { campaigns } = res.data;
        setCampaigns(campaigns);
      })
    }, []);

    const handleSubmit = () => {
      if(submitting) return;
      if(!data.artist_name)

      setSubmitting(true);

      let fdata = new FormData();
      fdata.append('artist_name', formData.artist_name);
      fdata.append('song_name', formData.song_name);
      fdata.append('genre', formData.genre);
      fdata.append('email', formData.email);
      fdata.append('phone', formData.phone);
      if(selectedFile) fdata.append('file', selectedFile);

      PostRda(fdata).then(res => {
        setFormData(res.data.data);
        setCompleted(true);
        setSubmitting(false);
      }).catch(err => {
        setSubmitting(false);
      });
    }

    const validateForm = () => {
      if(!policyAgree){
        toast.error('음원 제공 동의를 첵크하세요.');
        return false;
      }
      if(!formData.artist_name){
        toast.error('Artist Name을 입력하세요.');
        return false;
      }
      if(!formData.song_name){
        toast.error('Song Name을 입력하세요.');
        return false;
      }
      if(!formData.genre){
        toast.error('Genre을 선택하세요.');
        return false;
      }
      if(!formData.email){
        toast.error('E-mail을 입력하세요.');
        return false;
      }
      if(!formData.phone){
        toast.error('핸드폰 번호를 입력하세요.');
        return false;
      }
      if(!formData.url && !selectedFile){
        toast.error('파일을 선택하세요.');
        return false;
      }

      return true;
    }

    const handleChangeField = (e) => {
      const {id, value} = e.target;
      setErrors({...errors, [id]: ''});
      setFormData({...formData, [id]: value});
    }

    const handleChangeFile = (e) => {
      const { files } = e.target;
      if(!files || !files.length) return;
      setSelectedFile(files[0]);
    }

    const handleOpenModal = () => {
      if(!validateForm()) return;
      window.scrollTo(0, 0);
      setOpenModal(true);
    }

    const handleCloseModal = () => {
      setOpenModal(false);
      if(completed){
        setFormData(defaultData);
        setSelectedFile(null);
        setCompleted(false);
      }
    }

    const getCategory = () => {
      if(!formData.genre || !data.categories) return '';
      let _category = data.categories.find(s => s.value == formData.genre);
      return _category ? _category.label : '';
    }

    const handleGoback = () => {
      history.goBack();
    }

    const handleChangeCode = (index, e) => {
      const { value } = e.target;
      let _campaign = [...campaigns];
      _campaign[index]['code'] = value;
      setCampaigns(_campaign);
    }

    const handlePostRequest = (index) => {
      let _campaigns = [...campaigns];
      let camp = _campaigns[index];
      if(!camp.code) {
        toast.error('음원코드를 입력해주세요.');
        return;
      }

      PostRdaCampaingRequest({id: camp.id, code: camp.code}).then(res => {
        toast.success('참가신청이 접수되였습니다.');
        _campaigns[index]['code'] = '';
        setCampaigns(_campaigns);
      }).catch(err => {
        toast.error('코드를 다시 입력 해주세요, Submit track에 등록된 코드는 이메일에서 확인 가능합니다.');
      });
    }

    return (
      <div id="page-rda">
        {submitting && <CircleFullSpinner size="full"/>}
        {openModal ?
          <div className="rda-modal">
            <div className="rda-modal_wrapper">
              <img className="rda_logo mb-20p" src="/images/rda/wmm2021_logo.png" />

              <div className="rda-section_divider mb-40p"></div>
              <Row className="rda-section_text_1">
                <Col xs={6}>
                  <p className="mb-4p color-400">Artist name</p>
                  <p className="mb-20p">{formData.artist_name || " "}</p>
                </Col>
                <Col xs={6}>
                  <p className="mb-4p color-400">E-mail</p>
                  <p className="mb-20p">{formData.email || " "}</p>
                </Col>
                <Col xs={6}>
                  <p className="mb-4p color-400">HP</p>
                  <p className="mb-20p">{formData.phone || " "}</p>
                </Col>
                <Col xs={6}>
                  <p className="mb-4p color-400">Song name</p>
                  <p className="mb-20p">{formData.song_name || " "}</p>
                </Col>
                <Col xs={6}>
                  <p className="mb-4p color-400">Genre</p>
                  <p className="mb-40p">{getCategory()}</p>
                </Col>
              </Row>

              {completed &&
                <>
                  <div className="rda-section_divider mb-40p"></div>
                  <p className="text-kr-md font-16 mb-40p">
                    등록해주셔서 감사합니다.<br/>
                    아래의 코드를 통해 행사에 신청하실 수 있습니다.<br/>
                    해당 내용은 이메일로 전송됩니다.
                  </p>
                  <div className="rda-section_divider mb-20p"></div>
                  <p className="rda-section_text_1 mb-40p">
                    <span className="mr-3 color-400">CODE</span>
                    <span>{formData.code}</span>
                  </p>
                </>
              }

              <div className="rda-modal_footer">
                {!completed && <div className="rda-modal_button text-kr-md font-12 mr-20p" onClick={handleSubmit}>등록하기</div> }
                <div className="rda-modal_button  text-kr-md font-12" onClick={handleCloseModal}>돌아가기</div>
              </div>
            </div>
          </div>
          :
          <div>
            {/* <span className="back-btn" onClick={handleGoback}>
              <img src="/images/arrow.svg" />
            </span> */}
            <div className="rda-header" style={{backgroundColor: setting?.main?.background || '', color: setting?.main?.text || 'inherit'}}>
              <div className="rda-section">
                
                {logo &&
                  <div className="rda_logo mb-80p">
                    <img src={logo} />
                  </div>
                }

                {banners?.length > 0 &&
                  <div id="main-banner" className="mb-60p">
                    <Slider {...settings}>
                      {banners.map((banner, index) => (
                        <React.Fragment key={index}>
                          {banner.link ?
                            <a href={banner.link || ''} target="_blank" className="d-block w-full cursor-pointer">
                              {fileExtension(banner.image) === 'mp4' ? 
                                <video style={{width: '100%',backgroundColor: '#000'}} autoPlay loop muted>
                                    <source src={banner.image} type="video/mp4"/>
                                </video>
                                :
                                <img src={banner.image} style={{width: '100%', objectFit: 'cover'}}/>
                              }
                            </a>
                            :
                            <div className="w-full">
                              {fileExtension(banner.image) === 'mp4' ? 
                                <video style={{width: '100%',backgroundColor: '#000'}} autoPlay loop muted>
                                    <source src={banner.image} type="video/mp4"/>
                                </video>
                                :
                                <img src={banner.image} style={{width: '100%', objectFit: 'cover'}}/>
                              }
                            </div>
                          }
                        </React.Fragment>
                      ))}
                    </Slider>
                  </div>
                }
                
                {contents.main?.content && 
                  <div dangerouslySetInnerHTML={{__html: contents.main.content}}></div>
                }
              </div>
            </div>

            {/* <div className="rda-introduction" style={{backgroundColor: setting?.uncut?.background || '', color: setting?.uncut?.text || 'inherit'}}>
              <div className="rda-section">
                <h2 className="rda-section_title mb-60p"
                  style={{color: setting?.uncut?.title || 'inherit', borderColor: setting?.uncut?.title || 'inherit'}}
                >UNCUT GEMS</h2>
                {contents.uncut_gems?.content && 
                  <p className="rda-section_text mb-80p">{contents.uncut_gems.content}</p>
                }
                {contents.uncut_gems?.image && 
                  <img src={contents.uncut_gems.image} />
                }
              </div>
            </div> */}
              
            <div className="rda-contents" style={{backgroundColor: setting?.content?.background || '', color: setting?.content?.text || 'inherit'}}>
              <div className="rda-section">
                {/*<h2 className="rda-section_title mb-60p"*/}
                {/*  style={{color: setting?.content?.title || 'inherit', borderColor: setting?.content?.title || 'inherit'}}*/}
                {/*>CONTENTS LIST</h2>*/}
                {contents.content_list?.content &&
                  <div dangerouslySetInnerHTML={{__html: contents.content_list.content}}></div>
                }
              </div>
            </div>
            
            <div className="rda-submition" style={{backgroundColor: setting?.submit?.background || '', color: setting?.submit?.text || 'inherit'}}>
              <div className="rda-section">
                <h2 className="rda-section_title mb-40p"
                  style={{color: setting?.submit?.title || 'inherit', borderColor: setting?.submit?.title || 'inherit'}}
                >Submit track</h2>

                <div className="inline-group align-items-center mb-40p">
                  <label>Artist Name</label>
                  <input
                    id="artist_name"
                    name="artist_name"
                    value={formData.artist_name || ''}
                    onChange={handleChangeField}/>
                </div>

                <div className="inline-group align-items-center mb-40p">
                  <label>Song Name</label>
                  <input
                    id="song_name"
                    name="song_name"
                    value={formData.song_name || ''}
                    onChange={handleChangeField}/>
                </div>

                <div className="inline-group align-items-center mb-40p">
                  <label>Genre</label>
                  <RdaSelectBox
                    id="genre"
                    value={formData.genre}
                    selections={data.categories || []}
                    onChange={handleChangeField}
                  />
                </div>

                <div className="inline-group align-items-center mb-40p">
                  <label>E-mail</label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChangeField}/>
                </div>

                <div className="inline-group align-items-center mb-40p">
                  <label>HP</label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChangeField}/>
                </div>

                {selectedFile && <p>{selectedFile.name}</p>}

                <label htmlFor="file" className="rda-button uploadable mb-15p">
                  <input type="file" id="file" name="file" hidden accept=".mp3,.wav" onChange={handleChangeFile}/>
                  <span>File upload</span>
                </label>
              
                <div className="rda-section_divider mb-60p"></div>

                <h6 className="font-24 text-kr-bold text-bold mb-15p">음원 제공 동의</h6>
                <div className="rda-section_divider mb-40p"></div>
                <div className="policy_area op-perfect-scroller mb-40p">
                    <div style={{paddingRight: 22}}>
                        <p>1. 개인정보 제공 동의</p>
                        <p style={{paddingLeft: 10}}>이용자가 제공한 모든 정보 및 음원은 다음의 목적을 위해 활용하며, 하기 목적 이외의 용도로는 사용되지 않습니다.</p>
                        <p style={{paddingLeft: 10}}>
                            가. 수집·이용·제공 목적<br/>
                            <span style={{paddingLeft: 10}}>- 음원 아카이브의 음원등록, 관리 및 코드발급을 위한 최소 정보의 수집과 이용</span><br/>
                            <span style={{paddingLeft: 10}}>- 음원을 이용한 영상</span><br/>
                            <span style={{paddingLeft: 10}}>- WMM2021 참가자와의 연락, 참가자 선발을 위한 최소 정보의 수집과 이용</span>
                        </p>
                        <p style={{paddingLeft: 10}}>
                            나. 수집·이용·제공하는 개인정보의 항목<br/>
                            <span style={{paddingLeft: 10}}>- 아티스트명, 곡명, 이메일, 연락처(휴대폰), 음원 파일</span>
                        </p>
                        <p style={{paddingLeft: 10}}>
                            다. 개인정보의 보유 및 이용·제공기간<br/>
                            <span style={{paddingLeft: 10}}>- 수집·이용 동의일로부터 개인정보의 수집·이용목적을 달성할 때까지</span>
                        </p>
                        <p style={{paddingLeft: 10}}>
                            라. 동의를 거부할 권리와 거부에 따른 불이익<br/>
                            <span style={{paddingLeft: 10}}>- 상기 본인은 상기 개인정보의 수집에 대하여 거부할 권리를 보유하고 있음을 인지하고 있음</span><br/>
                            <span style={{paddingLeft: 10}}>- 거부에 따른 불이익 : WMM2021 참여 불가</span>
                        </p>
                        <p>2. 음원 제공 동의</p>
                        <p style={{paddingLeft: 10}}>모든 저작권의 권리는 음원을 등록한 제작자에게 있으며, 언제든지 아카이브 등록을 취소/수정할 수 있습니다. OPCD는 이용자가 제공한 음원을 비영리적인 목적으로 활용(전체, 인용, 발췌, 편집)하거나 2차적 제작물 또는 편집 제작물 작성 등 관련 지적재산권 일체를 포괄적으로 이용할 권리를 갖습니다.</p>
                    </div>
                </div>
                <div className="policy_checkbox mb-20p">
                    <span className="checkbox_text">위 내용을 모두 숙지하였으며, 음원 등록에 동의합니다.</span>
                    <span className={`checkbox_icon ${policyAgree ? 'checked' : ''}`} onClick={() => setPolicyAgree(!policyAgree)}></span>
                </div>
                <div className="rda-section_divider mb-60p"></div>

                <div className="rda-button" onClick={handleOpenModal}>Submit</div>

                {!!campaigns?.length && 
                  <div className="rda_campaign_section">
                    <div className="rda-section_divider mt-60p mb-60p"></div>
                    {campaigns.map((camp, index) => 
                      <div key={index} className="rda_campaign_item">
                        <p className="font-18">{camp.title}</p>
                        <div className="content">
                            <div className="content-inner">
                                {camp.description && <p className="description font-16">{camp.description}</p> }
                                <a href={camp.url || ''} target="blank" className="rda-button w-8-rem mb-3">상세보기</a>
                            </div>
                            <div className="content-inner">
                                <div>음원코드를 입력해주세요.</div>
                                <div className="inline-group align-items-center">
                                    <div className="flex-1 mr-3" style={{border: '1px solid #000', padding: '7px 5px 4px'}}>
                                        <input style={{border: '0'}} value={camp.code || ''} onChange={(e) => handleChangeCode(index, e)}/>
                                    </div>
                                    <div className="rda-button" style={{width: '100px'}} onClick={() => handlePostRequest(index)}>참가신청</div>
                                </div>
                            </div>
                        </div>
                      </div>
                    )}
                  </div>
                }
              </div>
            </div>

            <div className="rda-faq" style={{backgroundColor: setting?.faq?.background || '', color: setting?.faq?.text || 'inherit'}}>
              <div className="rda-section">
                {/* <h2 className="rda-section_title mb-40p"
                  style={{color: setting?.faq?.title || 'inherit', borderColor: setting?.faq?.title || 'inherit'}}
                >Digger</h2> */}
                <Row className="logos-wrapper m-0">
                  {data && data.logos && data.logos.map((l, index) => 
                    <Col key={index} xs={3} className="p-0 mb-50p">
                      <img src={l.url}/>
                    </Col>
                  )}
                </Row>

                <Row className="musics-wrapper mb-100p">
                  {data && data.musics && data.musics.map((m, index) => 
                    <Col key={index} xs={6} md={4}  className="col">
                      <div>
                        <span>{m.name}</span>
                      </div>
                    </Col>
                  )}
                </Row>

                <h2 className="rda-section_title mb-40p"
                  style={{color: setting?.faq?.title || 'inherit', borderColor: setting?.faq?.title || 'inherit'}}
                >FAQ</h2>
                {!!data?.faqs?.length && data.faqs.map((f, index) => 
                  <div key={index} className="break-all">
                    <h6 className="text-kr-bd text-bold font-24 mb-20p aapl-32p">
                      <span className="aa-ml-32p mr-8p">{index + 1})</span>
                      <span>{f.question || ''}</span>
                    </h6>
                    <p className="text-kr-md font-18 mb-40p">{f.answer || ''}</p>
                  </div>
                )}
              </div>
            </div>
            
            {logo && 
              <div className="rda-footer">
                <div className="rda-section">
                  <div className="rda_logo">
                    <img src={logo} />
                  </div>
                </div>
              </div>
            }
      
          </div>
        }
        </div>
    )
}

export default RDA;
