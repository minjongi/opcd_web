import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import PerfectScrollBar from 'react-perfect-scrollbar';

import { CircleFullSpinner, FileUploader, ImagePreview } from '../../components';
import { Button, Select } from '../../components/form';
import { toast } from 'react-toastify';

import { PostPuzzleBanner, GetLayerNameList } from '../../store/wmm/api';

const WMMPuzzleForm = ({puzzle, open, onClose, onSuccess}) => {
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState(puzzle);
    const [layers, setLayers] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [liveImage, setLiveImage] = useState(null);
    const [soonImage, setSoonImage] = useState(null);

    useEffect(() => {
        GetLayerNameList().then(res => {
            const { layers } = res.data;
            setLayers(layers);
        }).catch(err => {
            console.log(err);
        })
    }, [])

    const handleSelectFile = (type, files) => {
        if(type === 'MAIN') setMainImage({ file: files[0], preview: URL.createObjectURL(files[0]) });
        else if(type === 'LIVE') setLiveImage({ file: files[0], preview: URL.createObjectURL(files[0]) });
        else  setSoonImage({ file: files[0], preview: URL.createObjectURL(files[0]) });
    }

    const handleChangeField = (e) => {
        const {id, value} = e.target;
        if(value === 'none') setData({...data, [id]: ''});
        else setData({...data, [id]: value});
    }

    const handleSubmit = () => {
        if(submitting) return;
        setSubmitting(true);

        const formData = new FormData();
        formData.append('layer_id', data.layer_id);
        formData.append('type', data.type);
        if(mainImage) formData.append('base_file', mainImage.file);
        if(liveImage) formData.append('live_file', liveImage.file);
        if(soonImage) formData.append('soon_file', soonImage.file);

        PostPuzzleBanner(data.id, formData)
            .then(res => {
                setSubmitting(false);
                toast.success('배너가 성공적으로 등록되였습니다.');
                onSuccess();
            }).catch(err => {
                setSubmitting(false);
            })
    }

    return (
        <Modal
            show={open}
            centered
            size="md"
            onHide={onClose}
        >
            <Modal.Title className="p-4 back-primary">
                <h5 className="m-0">퍼즐배너</h5>
            </Modal.Title>

            <Modal.Body className="p-1 scroll-modal-body" style={{height: 650}}>
                {submitting && <CircleFullSpinner size="full"/>}
                
                <PerfectScrollBar>
                    <div className="p-3">
                        {data.type && data.type !== 'FIXED' &&
                            <>
                                <div className="inline-group md-block mb-3">
                                    <div className="w-10-rem mt-2">배너타입*</div>
                                    <div className="flex-full">
                                        <Select id="type" name="type" value={data.type} className="light rounded" onChange={handleChangeField}>
                                            <option value="SOON">SOON용</option>
                                            <option value="LIVE">LIVE용</option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="inline-group md-block mb-3">
                                    <div className="w-10-rem mt-2">레이어 팝업</div>
                                    <div className="flex-full">
                                        <Select id="layer_id" name="layer_id" value={data.layer_id || 'none'} className="light rounded" onChange={handleChangeField}>
                                            <option value="none"></option>
                                            {layers.map((l, index) => 
                                                <option key={index} value={l.id}>{l.title}</option>
                                            )}
                                        </Select>
                                    </div>
                                </div>
                            </>
                        }

                        <div className="inline-group md-block mb-3">
                            <div className="w-10-rem mt-2">MAIN 이미지*</div>
                            <div className="flex-full">
                                {data.base_image || mainImage ?
                                    <div className="max-w-300">
                                        <ImagePreview
                                            url={data.base_image || mainImage.preview}
                                            deletable
                                            onDelete={() => {
                                                setData({...data, base_image: ''});
                                                setMainImage(null);
                                            }}/>
                                    </div>
                                    :
                                    <FileUploader onChange={(files) => handleSelectFile('MAIN', files)} accept=".jpg,.png,.gif,.jpeg,.svg"/>
                                }
                            </div>
                        </div>

                        {data.type && data.type !== 'FIXED' &&
                            <>
                                <div className="inline-group md-block mb-3">
                                    <div className="w-10-rem mt-2">LIVE 이미지</div>
                                    <div className="flex-full">
                                        {data.live_image || liveImage ?
                                            <div className="max-w-300">
                                                <ImagePreview
                                                    url={data.live_image || liveImage.preview}
                                                    deletable
                                                    onDelete={() => {
                                                        setData({...data, live_image: ''});
                                                        setLiveImage(null);
                                                    }}/>
                                            </div>
                                            :
                                            <FileUploader onChange={(files) => handleSelectFile('LIVE', files)} accept=".jpg,.png,.gif,.jpeg,.svg"/>
                                        }
                                    </div>
                                </div>

                                <div className="inline-group md-block mb-3">
                                    <div className="w-10-rem mt-2">SOON 이미지</div>
                                    <div className="flex-full">
                                        {data.soon_image || soonImage ?
                                            <div className="max-w-300">
                                                <ImagePreview
                                                    url={data.soon_image || soonImage.preview}
                                                    deletable
                                                    onDelete={() => {
                                                        setData({...data, soon_image: ''});
                                                        setSoonImage(null);
                                                    }}/>
                                            </div>
                                            :
                                            <FileUploader onChange={(files) => handleSelectFile('SOON', files)} accept=".jpg,.png,.gif,.jpeg,.svg"/>
                                        }
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </PerfectScrollBar>
            </Modal.Body>
            <Modal.Footer  className="d-flex px-1 justify-content-center">
                <Button label={data.id ? '업데이트': '등록하기'} className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                <Button label={data.id ? '돌아가기': '취소하기'} className="light px-5 mx-2" onClick={onClose}/>
            </Modal.Footer>
        </Modal>
    )
};

export default WMMPuzzleForm;