import React from 'react';
import { Modal } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Icon from './Icon';

const LayerPopup = ({title, layer, contents, onClose}) => {
    
    return (
        <Modal
            show={true}
            centered
            size="lg"
            onHide={onClose}
            dialogClassName="layer-popup"
        >
            <Modal.Header>
                <h2 className="text-white">{title || 'dia-log'}</h2>
                <div className="close-btn" onClick={onClose}></div>
            </Modal.Header>

            <Modal.Body>
                <PerfectScrollbar>
                    <div className="modal-body-content">
                        <div className="mb-4">
                            <div className="html-content" dangerouslySetInnerHTML={{__html: layer.desc || ''}}/>
                        </div>

                        {contents && !!contents.length && contents.map((c, index) => 
                            <div key={index} className="layer-card mb-5">
                                <div className="layer-card-header">
                                    <div className="d-flex justify-content-between">
                                        <span className="color-purple-light font-weight-bold">{c.content_num}</span>
                                        <span>{c.date}</span>
                                    </div>
                                    <div className="text-white font-18 font-weight-bold">{c.title}</div>
                                </div>
                                <div className="layer-card-content">
                                    <div className="html-content" dangerouslySetInnerHTML={{__html: c.content || ''}}/>
                                </div>
                            </div>
                        )}
                    </div>
                </PerfectScrollbar>
            </Modal.Body>
        </Modal>
    )
};

export default LayerPopup;