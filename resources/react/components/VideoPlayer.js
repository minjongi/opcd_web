import React from 'react';
import { Modal } from 'react-bootstrap';
import Icon from './Icon';

const getYoutubeEmbeded = (url) => {
    let _url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(_url[2] !== undefined) {
      let _ID = _url[2].split(/[^0-9a-z_\-]/i);
      return 'https://www.youtube.com/embed/' + _ID[0];
    }

    return null;
}

const VideoPlayer = ({url, style}) => {
    
    const youtube = getYoutubeEmbeded(url);

    return (
        <div className="video-container">
            <div className="video-ratio"></div>
            <div className="player">
                {youtube ? 
                    <iframe
                        style={{width: '100%', height: '100%', ...style}}
                        src={youtube}
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                    :
                    <video src={url} controls style={style}></video>
                }
            </div>
        </div>
    )
};

const VideoPlayerDlg = ({open, onClose, children}) => {
    return (
        <Modal
            centered
            show={open}
            onHide={onClose}
            dialogClassName="video-player-modal"
        >
            <div className="video-wrapper">
                <div className="close-btn" onClick={onClose}>
                    <Icon name="close" />
                </div>
                {children}
            </div>
        </Modal>
    )
}

export {
    VideoPlayer,
    VideoPlayerDlg
}