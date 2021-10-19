import React, {useEffect, useState} from 'react'
import { TextInput, Button } from '../../components/form';
import { FileUploader, ImagePreview, CircleFullSpinner } from '../../components';
import { GetSetting, UpdateRDASetting } from '../../store/settingsApi'
import { toast } from 'react-toastify';

const ColourPicker = ({label, value, onChange}) => {
  return (
    <div className="inline-group">
      <div className="w-8-rem mt-2">{label}</div>
      <div className="flex-full max-w-12">
        <TextInput
          className="light rounded"
          value={value || ''}
          onChange={onChange}/>
      </div>
      <div className="ml-2 rounded border" style={{width: 38, height: 38, backgroundColor: value || ''}}></div>
    </div>
  )
}

const defaultSettings = {
  main: {background: '#ffffff', title: '#000000', text: '#404040'},
  uncut: {background: '#ffffff', title: '#000000', text: '#404040'},
  content: {background: '#ffffff', title: '#000000', text: '#404040'},
  submit: {background: '#ffffff', title: '#000000', text: '#404040'},
  faq: {background: '#ffffff', title: '#000000', text: '#404040'}
};

const RdaSettings = () => {
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState(defaultSettings);
  const [logo, setLogo] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    GetSetting({type: 'rda_setting,rda_logo'}).then(res => {
      const { settings } = res.data;
      if(settings && settings.length) {
        let _setting = settings.reduce((reducer, s) => { return {...reducer, [s.type]: s.content} }, {});
        if(_setting.rda_logo) setLogo(_setting.rda_logo);
        if(_setting.rda_setting) setData(JSON.parse(_setting.rda_setting));
      }
    });
  }, []);

  const handleSelectFile = (files) => {
    setImageFile({
        file: files[0],
        preview: URL.createObjectURL(files[0])
    });
  }

  const handleDeleteImage = () => {
    setLogo('');
    if(imageFile) setImageFile(null);
  }

  const handleChangeColor = (section, type, e) => {
    const { value } = e.target;
    let _value = value && value.slice(0, 1) !== "#" ? '#' + value : value;
    setData({...data, [section]: {...data[section], [type]: _value.slice(0, 9)}});
  }

  const handleSubmit = () => {
    if(submitting) return;
    setSubmitting(true);

    let formdata = new FormData();
    formdata.append('rda_setting', JSON.stringify(data));
    if(imageFile) formdata.append('file', imageFile.file);
    else formdata.append('rda_logo', logo || '');

    UpdateRDASetting(formdata).then(res => {
      toast.success('설정이 성공적으로 업데이트 되였습니다.');
    }).catch(err => {
      console.log(err);
    }).then(() => {
      setSubmitting(false);
    });
  }

  return (
    <div className="pb-4">
      {submitting && <CircleFullSpinner size="full"/>}
      <h4 className="mb-5">RDA 환경설정</h4>

      <div className="inline-group md-block mb-3">
        <div className="w-10-rem">
            <div className="font-weight-bold">RDA 로고</div>
            <span className="font-12">(*.jpg, *.png파일)</span>
        </div>
        <div className="flex-full">
          {logo || imageFile ?
            <div className="max-w-300">
              <ImagePreview url={imageFile?.preview || logo} deletable onDelete={handleDeleteImage}/>
            </div>
            :
            <FileUploader onChange={handleSelectFile} accept=".jpg,.png"/>
          }
        </div>
      </div>
      
      <h6 className="font-weight-bold">메인</h6>
      <div className="d-flex mb-2">
        <div>
          <ColourPicker label="배경 색상" value={data.main?.background} onChange={(e) => handleChangeColor('main', 'background', e)} />
          <ColourPicker label="타이틀 색상" value={data.main?.title} onChange={(e) => handleChangeColor('main', 'title', e)} />
          <ColourPicker label="텍스트 색상" value={data.main?.text} onChange={(e) => handleChangeColor('main', 'text', e)} />
        </div>
        <div className="flex-1 d-none d-md-block ml-5 mb-2 p-3" style={{backgroundColor: data.main?.background || ''}}>
          <h4 style={{color: data.main?.title}}>TITLE</h4>
          <p style={{color: data.main?.text}}>텍스트 색상을 변경하세요.</p>
        </div>
      </div>

      {/* <h6 className="font-weight-bold">UNCUT GEMS</h6>
      <div className="d-flex mb-2">
        <div>
          <ColourPicker label="배경 색상" value={data.uncut?.background} onChange={(e) => handleChangeColor('uncut', 'background', e)} />
          <ColourPicker label="타이틀 색상" value={data.uncut?.title} onChange={(e) => handleChangeColor('uncut', 'title', e)} />
          <ColourPicker label="텍스트 색상" value={data.uncut?.text} onChange={(e) => handleChangeColor('uncut', 'text', e)} />
        </div>
        <div className="flex-1 d-none d-md-block ml-5 mb-2 p-3" style={{backgroundColor: data.uncut?.background || ''}}>
          <h4 style={{color: data.uncut?.title}}>TITLE</h4>
          <p style={{color: data.uncut?.text}}>텍스트 색상을 변경하세요.</p>
        </div>
      </div> */}

      <h6 className="font-weight-bold">CONTENTS LIST</h6>
      <div className="d-flex mb-2">
        <div>
          <ColourPicker label="배경 색상" value={data.content?.background} onChange={(e) => handleChangeColor('content', 'background', e)} />
          <ColourPicker label="타이틀 색상" value={data.content?.title} onChange={(e) => handleChangeColor('content', 'title', e)} />
          <ColourPicker label="텍스트 색상" value={data.content?.text} onChange={(e) => handleChangeColor('content', 'text', e)} />
        </div>
        <div className="flex-1 d-none d-md-block ml-5 mb-2 p-3" style={{backgroundColor: data.content?.background || ''}}>
          <h4 style={{color: data.content?.title}}>TITLE</h4>
          <p style={{color: data.content?.text}}>텍스트 색상을 변경하세요.</p>
        </div>
      </div>

      <h6 className="font-weight-bold">Submit track</h6>
      <div className="d-flex mb-2">
        <div>
          <ColourPicker label="배경 색상" value={data.submit?.background} onChange={(e) => handleChangeColor('submit', 'background', e)} />
          <ColourPicker label="타이틀 색상" value={data.submit?.title} onChange={(e) => handleChangeColor('submit', 'title', e)} />
          <ColourPicker label="텍스트 색상" value={data.submit?.text} onChange={(e) => handleChangeColor('submit', 'text', e)} />
        </div>
        <div className="flex-1 d-none d-md-block ml-5 mb-2 p-3" style={{backgroundColor: data.submit?.background || ''}}>
          <h4 style={{color: data.submit?.title}}>TITLE</h4>
          <p style={{color: data.submit?.text}}>텍스트 색상을 변경하세요.</p>
        </div>
      </div>

      <h6 className="font-weight-bold">Digger & FAQ</h6>
      <div className="d-flex mb-2">
        <div>
          <ColourPicker label="배경 색상" value={data.faq?.background} onChange={(e) => handleChangeColor('faq', 'background', e)} />
          <ColourPicker label="타이틀 색상" value={data.faq?.title} onChange={(e) => handleChangeColor('faq', 'title', e)} />
          <ColourPicker label="텍스트 색상" value={data.faq?.text} onChange={(e) => handleChangeColor('faq', 'text', e)} />
        </div>
        <div className="flex-1 d-none d-md-block ml-5 mb-2 p-3" style={{backgroundColor: data.faq?.background || ''}}>
          <h4 style={{color: data.faq?.title}}>TITLE</h4>
          <p style={{color: data.faq?.text}}>텍스트 색상을 변경하세요.</p>
        </div>
      </div>

      <div className="d-flex px-1 justify-content-center mt-5">
          <Button label='업데이트' className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
      </div>
    </div>
  )
}

export default RdaSettings;