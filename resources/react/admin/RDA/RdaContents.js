import React, {useEffect, useState} from 'react'
import { TextInput, Button } from '../../components/form';
import { FileUploader, SmartEditor, ImagePreview, CircleFullSpinner } from '../../components';
import { GetRdaContents, UpdateRdaContents } from '../../store/rda/api'
import { toast } from 'react-toastify';

const defaultData = {
  main: {image: '', content: ''},
  uncut_gems: {image: '', content: ''},
  content_list: {image: '', content: ''}
};

const RdaContents = () => {
  const [submitting, setSubmitting] = useState(false);
  const [mainEditor, setMainEditor] = useState(null);
  const [editor, setEditor] = useState(null);
  const [data, setData] = useState(defaultData);
  const [mainImage, setMainImage] = useState(null);
  const [uncutImage, setUncutImage] = useState(null);

  useEffect(() => {
    GetRdaContents().then(res => {
      const { contents } = res.data;
      if(contents && contents.length) {
        let _contents = contents.reduce((reducer, s) => { return {...reducer, [s.type]: s} }, {});
        setData(_contents);
      }
    });
  }, []);

  const handleSelectFile = (type, files) => {
    if(type === 'main'){
      setMainImage({
        file: files[0],
        preview: URL.createObjectURL(files[0])
      });
    }else{
      setUncutImage({
        file: files[0],
        preview: URL.createObjectURL(files[0])
      });
    }
  }

  const handleDeleteImage = (type) => {
    setData({...data, [type]: {...data[type], image: ''}});
    if(type === 'main'){
      setMainImage(null);
    }else{
      setUncutImage(null);
    }
  }

  const handleChangeField = (type, e) => {
    const { value } = e.target;
    setData({...data, [type]: {...data[type], content: value}});
  }

  const getMainEditorData = () => {
    if(mainEditor){
        mainEditor.getById['main_content'].exec("UPDATE_CONTENTS_FIELD", []);
        const content = document.getElementById('main_content').value;
        return content;
    }
    return '';
  }

  const getEditorData = () => {
    if(editor){
        editor.getById['content_list'].exec("UPDATE_CONTENTS_FIELD", []);
        const content = document.getElementById('content_list').value;
        return content;
    }
    return '';
  }

  const handleSubmit = () => {
    if(submitting) return;
    setSubmitting(true);

    let formdata = new FormData();
    formdata.append('main[content]', getMainEditorData());
    formdata.append('uncut_gems[content]', data.uncut_gems?.content || '');
    formdata.append('content_list[content]', getEditorData());

    if(mainImage) formdata.append('main_file', mainImage.file);
    else formdata.append('main[image]', data.main?.image || '');

    if(uncutImage) formdata.append('uncut_file', uncutImage.file);
    else formdata.append('uncut_gems[image]', data.uncut_gems?.image || '');

    UpdateRdaContents(formdata).then(res => {
      toast.success('콘텐츠가 성공적으로 업데이트 되였습니다.');
    }).catch(err => {
      console.log(err);
    }).then(() => {
      setSubmitting(false);
    });
  }

  console.log(data);
  return (
    <div className="pb-4">
      {submitting && <CircleFullSpinner size="full"/>}
      <h4 className="mb-5">RDA 콘텐츠</h4>

      <div className="pb-2 mb-4 border-bottom">
        <h6 className="font-weight-bold">메인 서브구문</h6>
      </div>
      <div className="w-100 mb-4">
        <SmartEditor
          id="main_content"
          rows={16}
          content={data.main?.content}
          onLoadEditor={(editor) => setMainEditor(editor)}
        />
        {/* <div className="inline-group md-block mb-3">
          <div className="w-10-rem mt-2">서브구문</div>
          <div className="flex-full">
            <TextInput
              className="light rounded"
              value={data.main?.content}
              rows={5}
              onChange={(e) => handleChangeField('main', e)}/>
          </div>
        </div> */}
      </div>

      {/* <div className="pb-2 mb-4 border-bottom">
        <h6 className="font-weight-bold">UNCUT GEMS</h6>
      </div>
      <div className="mb-4">
        <div className="inline-group md-block mb-3">
          <div className="w-10-rem">
            <div>이미지</div>
            <span className="font-12">(*.jpg, *.png파일)</span>
          </div>
          <div className="flex-full">
            {data.uncut_gems?.image || uncutImage ?
                <div className="max-w-300">
                    <ImagePreview url={uncutImage?.preview ||  data.uncut_gems?.image} deletable onDelete={() => handleDeleteImage('uncut_gems')}/>
                </div>
                :
                <FileUploader onChange={(files) => handleSelectFile('uncut_gems', files)} accept=".jpg,.png"/>
            }
          </div>
        </div>
        <div className="inline-group md-block mb-3">
          <div className="w-10-rem mt-2">서브구문</div>
          <div className="flex-full">
            <TextInput
              className="light rounded"
              value={data.uncut_gems?.content}
              rows={5}
              onChange={(e) => handleChangeField('uncut_gems', e)}/>
          </div>
        </div>
      </div> */}

      <div className="pb-2 mb-4 border-bottom">
        <h6 className="font-weight-bold">CONTENTS LIST</h6>
      </div>
      <div className="w-100">
        <SmartEditor
          id="content_list"
          rows={16}
          content={data.content_list?.content}
          onLoadEditor={(editor) => setEditor(editor)}
        />
      </div>

      <div className="d-flex px-1 justify-content-center mt-5">
          <Button label='업데이트' className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
      </div>
    </div>
  )
}

export default RdaContents;