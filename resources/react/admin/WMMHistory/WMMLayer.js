import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { TextInput, Button } from '../../components/form';
import { SmartEditor, CircleFullSpinner, Icon, LayerPopup } from '../../components';
import { REQUIRED } from '../../constants/validation';
import { toast } from 'react-toastify';

import WMMLayerForm from './WMMLayerForm';
import { PostLayer, GetLayer } from '../../store/wmm/api';

const defaultData = {
    title: '',
    desc: '',
}

const WMMLayer = () => {
    const history = useHistory();
    const params = useParams();
    const [editor, setEditor] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState(defaultData);
    const [contents, setContents] = useState([]);
    const [errors, setErrors] = useState({});

    const [openLayerModal, setOpenLayerModal] = useState(false);
    const [layerIndex, setLayerIndex] = useState(-1);

    const [openPreview, setOpenPreview] = useState(false);

    useEffect(() => {
        if(params && params.id){
            GetLayer(params.id).then(res => {
                const {content, ...layer} = res.data.layer;
                setData(layer);
                setContents(content);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [params])

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        setErrors({...errors, [id]: ''});
        setData({...data, [id]: value});
    }

    const handleSubmit = () => {
        if(!validateFields() || submitting) return;
        setSubmitting(true);

        const _contents = contents.length > 0 ? contents.map((c, index) => {
            return {
                ...c,
                order: index + 1
            }
        }) : null;

        const submitData = {...data, desc: getEditorData(), contents: _contents};
        PostLayer(data.id, submitData)
            .then(res => {
                setSubmitting(false);
                toast.success('레이어팝업이 성공적으로 등록되였습니다.');
                history.push('/admin/wmm_history_layer_list');
            }).catch(err => {
                setSubmitting(false);
            })
    }

    const validateFields = () => {
        let _errors = {};

        if(!data.title) _errors = {..._errors, title: REQUIRED.title};

        setErrors(_errors);

        if(!Object.keys(_errors).length) return true;
        return false;
    }

    const getEditorData = () => {
        if(editor){
            editor.getById['layer-desc'].exec("UPDATE_CONTENTS_FIELD", []);
            const content = document.getElementById('layer-desc').value;
            return content;
        }
        return '';
    }

    const handleAddLayerContent = (content) => {
        if(layerIndex > -1) {
            contents.splice(layerIndex, 1, content);
            setContents([...contents]);
        }else setContents([...contents, content]);
        setOpenLayerModal(false);
    }

    const handleMoveItem = (index, dir) => {
        if(contents.length < 2) return;
        let _total = contents.length;
        if((index === 0 && dir === 'up') || (index === _total - 1 && dir === 'down')) return;

        const item = contents.splice(index, 1);
        if(dir === 'up'){
            if(index === 1) setContents([...item, ...contents]);
            else setContents([...contents.slice(0, index - 1), ...item, ...contents.slice(index - 1)]);
        }else{
            if(index === _total - 2) setContents([...contents, ...item]);
            else setContents([...contents.slice(0, index + 1), ...item, ...contents.slice(index + 1)]);
        }
    }

    const handleDeleteItem = (index) => {
        contents.splice(index, 1);
        setContents([...contents]);
    }

    const handleOpenPreview = () => {
        setData({...data, desc: getEditorData()});
        setOpenPreview(true);
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <div className="mb-5 d-flex justify-content-between">
                <h4 className="m-0">레이어팝업</h4>
                <Button label="미리보기" className="btn-contain light px-4 py-1 mx-2" onClick={handleOpenPreview}/>
            </div>
            

            <div className="inline-group md-block mb-3">
                <div className="w-10-rem mt-2">레이어명*</div>
                <div className="flex-full max-w-20">
                    <TextInput
                        id="title"
                        name="title"
                        className="light rounded"
                        value={data.title}
                        error={errors.title}
                        onChange={handleChangeField}/>
                </div>
            </div>

            <div className="w-10-rem">콘텐츠</div>
            <div className="w-100 mb-4">
                <SmartEditor
                    id="layer-desc"
                    rows={6}
                    content={data.desc}
                    onLoadEditor={(editor) => setEditor(editor)}
                />
            </div>

            {!!contents.length && contents.map((c, index) => 
                <div key={index} className="d-flex align-items-center border-1 mb-2 px-3 py-2">
                    <div className="font-24 line-0 mr-3">
                        <div className="cursor-pointer"><Icon name="caretUp" color="primary" onClick={() => handleMoveItem(index, 'up')}/></div>
                        <div className="cursor-pointer"><Icon name="caretDown" color="primary"  onClick={() => handleMoveItem(index, 'down')}/></div>
                    </div>
                    <div
                        className="flex-grow-1 cursor-pointer"
                        onClick={() => {
                            setLayerIndex(index);
                            setOpenLayerModal(true);
                        }}
                    >
                        <span className="d-block">{c.title}</span>
                        <span className="font-14 mr-4">{c.content_num}</span><span className="font-14">{c.date}</span>
                    </div>
                    <div className="font-24 line-0 ml-3">
                        <div className="cursor-pointer"><Icon name="close" color="primary"  onClick={() => handleDeleteItem(index)}/></div>
                    </div>
                </div>
            )}

            <div className="d-flex align-items-center font-18 cursor-pointer" onClick={() => setOpenLayerModal(true)}>
                <Icon name="plusCircle" color="primary"/> <span className="ml-2 font-12">팝업본문을 추가하려면 이 버튼을 클릭하세요.</span>
            </div>

            <div className="d-flex px-1 justify-content-center mt-4">
                <Button label={data.id ? '업데이트' : '등록하기'} className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                <Button label={data.id ? '돌아가기' : '취소하기'} className="light px-5 mx-2" onClick={() => history.push('/admin/wmm_history_layer_list')}/>
            </div>

            {openLayerModal &&
                <WMMLayerForm
                    open={openLayerModal}
                    layerContent={layerIndex > -1 ? contents[layerIndex] : null}
                    onClose={() => {
                        setOpenLayerModal(false);
                        setLayerIndex(-1);
                    }}
                    onSuccess={handleAddLayerContent}/>
            }

            {openPreview && 
                <LayerPopup layer={data} contents={contents} onClose={() => setOpenPreview(false)} />
            }
        </div>
    )
};

export default WMMLayer;