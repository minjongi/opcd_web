import React, { useState } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';

import { Button } from '../../components/form';
import { FileDownload } from '../../store/rda/api'

const RdaDetailForm = ({data, open, onClose}) => {

    const handleDownloadFile = () => {
        FileDownload(data.id);
    }
    console.log(data);
    return (
        <Modal
            show={open}
            centered
            size="lg"
            onHide={onClose}
        >
            <Modal.Title className="p-4 back-primary">
                <h5 className="m-0">신청자 상세</h5>
            </Modal.Title>

            <Modal.Body className="p-4 text-bold">
                <Row>
                    <Col xs={6}>
                        <p className="color-400 mb-1">Artist name</p>
                        <p>{data.artist_name}</p>
                    </Col>
                    <Col xs={6}>
                        <p className="color-400 mb-1">E-mail</p>
                        <p>{data.email}</p>
                    </Col>
                    <Col xs={6}>
                        <p className="color-400 mb-1">HP</p>
                        <p>{data.phone}</p>
                    </Col>
                    <Col xs={6}>
                        <p className="color-400 mb-1">Song name</p>
                        <p>{data.song_name}</p>
                    </Col>
                    <Col xs={6}>
                        <p className="color-400 mb-1">Position</p>
                        <p>{data.position}</p>
                    </Col>
                    <Col xs={6}>
                        <p className="color-400 mb-1">Genre</p>
                        <p>{data.genre_text}</p>
                    </Col>
                </Row>

                <hr/>

                <div>
                    <span className="mr-4 color-400">CODE</span>
                    <span>{data.code}</span>
                </div>

                <hr/>

                <div>
                    <p className="color-400 mb-1">업로드된 파일</p>
                    <p>
                        <span className="mr-5">{data.file_name}</span>
                        <a href={data.url} download={data.file_name}>다운로드</a>
                    </p>
                </div>

                <div className="d-flex px-1 justify-content-center mt-5">
                    <Button label="닫기" className="btn-contain light px-5 mx-2" onClick={() => onClose && onClose()}/>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default RdaDetailForm;