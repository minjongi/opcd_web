import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Slider from "react-slick";

import { CircleFullSpinner } from '../../components';
import RdaSelectBox from '../../components/RdaSelectBox';
import { fileExtension } from '../../helpers/utils';
import { defaultPositions } from '../../constants/defaults';

import { GetRdaOptions, PostRda, GetRdaCampaings, PostRdaCampaingRequest } from '../../store/rda/api'
import {CheckBox} from "../../components/form";

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
  position: '',
  position_etc: '',
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

    const [position, setPosition] = useState({'Vocal': false, 'Producer': false, 'Instrumentalist': false, 'Etc': false});

    const handleCheckField = (e) => {
        const {id, checked, value} = e.target;
        setPosition({...position, [id]: checked});
    }

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
      fdata.append('position', formData.position);
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
        toast.error('?????? ?????? ????????? ???????????????.');
        return false;
      }
      if(!formData.artist_name){
        toast.error('Artist Name??? ???????????????.');
        return false;
      }
      if(!formData.song_name){
        toast.error('Song Name??? ???????????????.');
        return false;
      }

      formData.position = '';
      for (const positionKey in position) {
        if (position[positionKey]) {
          if (positionKey === 'Etc') {
            if (!formData.position_etc) {
              toast.error('Position Etc??? ???????????????.');
              return false;
            }
            formData.position += ((formData.position) ? ',' : '') + formData.position_etc;
            continue;
          }
          formData.position += ((formData.position) ? ',' : '') + positionKey;
        }
      }
      if(!formData.position){
        toast.error('Position??? ???????????????.');
        return false;
      }
      if(!formData.genre){
        toast.error('Genre??? ???????????????.');
        return false;
      }
      if(!formData.email){
        toast.error('E-mail??? ???????????????.');
        return false;
      }
      if(!formData.phone){
        toast.error('????????? ????????? ???????????????.');
        return false;
      }
      if(!formData.url && !selectedFile){
        toast.error('????????? ???????????????.');
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        toast.error('??????????????? ??????????????????.');
        return;
      }

      PostRdaCampaingRequest({id: camp.id, code: camp.code}).then(res => {
        toast.success('??????????????? ?????????????????????.');
        _campaigns[index]['code'] = '';
        setCampaigns(_campaigns);
      }).catch(err => {
        toast.error('????????? ?????? ?????? ????????????, Submit track??? ????????? ????????? ??????????????? ?????? ???????????????.');
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
                  <p className="mb-4p color-400">Position</p>
                  <p className="mb-20p">{formData.position || " "}</p>
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
                    ?????????????????? ???????????????.<br/>
                    ????????? ????????? ?????? ????????? ???????????? ??? ????????????.<br/>
                    ?????? ????????? ???????????? ???????????????.
                  </p>
                  <div className="rda-section_divider mb-20p"></div>
                  <p className="rda-section_text_1 mb-40p">
                    <span className="mr-3 color-400">CODE</span>
                    <span>{formData.code}</span>
                  </p>
                </>
              }

              <div className="rda-modal_footer">
                {!completed && <div className="rda-modal_button text-kr-md font-12 mr-20p" onClick={handleSubmit}>????????????</div> }
                <div className="rda-modal_button  text-kr-md font-12" onClick={handleCloseModal}>????????????</div>
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
                  <label>Position</label>
                  {/*<input*/}
                  {/*    id="position"*/}
                  {/*    name="position"*/}
                  {/*    value={formData.position || ''}*/}
                  {/*    onChange={handleChangeField}/>*/}
                  <ul className="checkbox-ul">
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          id="Vocal"
                          value="Vocal"
                          checked={position['Vocal'] || false}
                          onChange={handleCheckField}/>
                          Vocal
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          id="Producer"
                          value="Producer"
                          checked={position['Producer'] || false}
                          onChange={handleCheckField}/>
                          Producer
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          id="Instrumentalist"
                          value="Instrumentalist"
                          checked={position['Instrumentalist'] || false}
                          onChange={handleCheckField}/>
                          Instrumentalist
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          id="Etc"
                          value="Etc"
                          checked={position['Etc'] || false}
                          onChange={handleCheckField}/>
                          Etc
                      </label>
                      <input
                        id="position_etc"
                        name="position_etc"
                        value={formData.position_etc || ''}
                        onChange={handleChangeField}/>
                    </li>
                  </ul>
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

                <h6 className="font-24 text-kr-bold text-bold mb-15p">?????? ?????? ??????</h6>
                <div className="rda-section_divider mb-40p"></div>
                <div className="policy_area op-perfect-scroller mb-40p">
                    <div style={{paddingRight: 22}}>
                        <p>1. ???????????? ?????? ??????</p>
                        <p style={{paddingLeft: 10}}>???????????? ????????? ?????? ?????? ??? ????????? ????????? ????????? ?????? ????????????, ?????? ?????? ????????? ???????????? ???????????? ????????????.</p>
                        <p style={{paddingLeft: 10}}>
                            ???. ?????????????????????? ??????<br/>
                            <span style={{paddingLeft: 10}}>- ?????? ??????????????? ????????????, ?????? ??? ??????????????? ?????? ?????? ????????? ????????? ??????</span><br/>
                            <span style={{paddingLeft: 10}}>- ????????? ????????? ??????</span><br/>
                            <span style={{paddingLeft: 10}}>- WMM2021 ??????????????? ??????, ????????? ????????? ?????? ?????? ????????? ????????? ??????</span>
                        </p>
                        <p style={{paddingLeft: 10}}>
                            ???. ???????????????????????????? ??????????????? ??????<br/>
                            <span style={{paddingLeft: 10}}>- ???????????????, ??????, ?????????, ?????????(?????????), ?????? ??????</span>
                        </p>
                        <p style={{paddingLeft: 10}}>
                            ???. ??????????????? ?????? ??? ????????????????????<br/>
                            <span style={{paddingLeft: 10}}>- ?????????????? ?????????????????? ??????????????? ??????????????????????? ????????? ?????????</span>
                        </p>
                        <p style={{paddingLeft: 10}}>
                            ???. ????????? ????????? ????????? ????????? ?????? ?????????<br/>
                            <span style={{paddingLeft: 10}}>- ?????? ????????? ?????? ??????????????? ????????? ????????? ????????? ????????? ???????????? ????????? ???????????? ??????</span><br/>
                            <span style={{paddingLeft: 10}}>- ????????? ?????? ????????? : WMM2021 ?????? ??????</span>
                        </p>
                        <p>2. ?????? ?????? ??????</p>
                        <p style={{paddingLeft: 10}}>?????? ???????????? ????????? ????????? ????????? ??????????????? ?????????, ???????????? ???????????? ????????? ??????/????????? ??? ????????????. OPCD??? ???????????? ????????? ????????? ??????????????? ???????????? ??????(??????, ??????, ??????, ??????)????????? 2?????? ????????? ?????? ?????? ????????? ?????? ??? ?????? ??????????????? ????????? ??????????????? ????????? ????????? ????????????.</p>
                    </div>
                </div>
                <div className="policy_checkbox mb-20p">
                    <span className="checkbox_text">??? ????????? ?????? ??????????????????, ?????? ????????? ???????????????.</span>
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
                                <a href={camp.url || ''} target="blank" className="rda-button w-8-rem mb-3">????????????</a>
                            </div>
                            <div className="content-inner">
                                <div>??????????????? ??????????????????.</div>
                                <div className="inline-group align-items-center">
                                    <div className="flex-1 mr-3" style={{border: '1px solid #000', padding: '7px 5px 4px'}}>
                                        <input style={{border: '0'}} value={camp.code || ''} onChange={(e) => handleChangeCode(index, e)}/>
                                    </div>
                                    <div className="rda-button" style={{width: '100px'}} onClick={() => handlePostRequest(index)}>????????????</div>
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
