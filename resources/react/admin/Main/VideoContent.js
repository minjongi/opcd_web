import React, { useState, useEffect } from 'react';

import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetVideos, DeleteVideo, UpdateVideoStatus } from '../../store/main/api';
import VideoContentForm from './VideoContentForm';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    // {key: 'title', label: '타이틀', sort: true, searchable: true},
    // {key: 'desc', label: '서브문구', sort: true, searchable: true},
    {key: 'image', label: '이미지'},
    {key: 'link', label: '링크', sort: true, searchable: true},
    {key: 'created_at', label: '작성일자', sort: true, searchable: true, minWidth: 60},
    {key: 'status', label: '상태', sort: true, searchable: true},
    {key: 'action', label: '', minWidth: 106}
]

const VideoContent = () => {
    const [submitting, setSubmitting] = useState(false);
    const [tableState, setTableState] = useState({
        page: 1,
        perPage: 10,
        total: 0,
        search: '',
        sort: '',
        sortDir: '',
        tableCount: 0
    });
    const [data, setData] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [editContent, setEditContent] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        getData(tableState);
    }, []);

    const getData = (state) => {
        if(submitting) return;
        setSubmitting(true);
        
        GetVideos({...state}).then(res => {
            setSubmitting(false);
            
            const {total, videos} = res.data;
            setTableState({...state, tableCount: total, total: Math.ceil(total/tableState.perPage)});

            let _videos = videos.map((video, index) => {
                return {
                    ...video,
                    num: total - index - (state.page - 1)*state.perPage,
                    image: <img src={video.image} height="30px"/>,
                    link: <a href={video.link} target="_blank">{video.link}</a>,
                    created_at: video.created_at.slice(0, 10),
                    status: video.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">확인</span>
                            :
                            <span className="color-warning font-weight-bold">대기</span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 my-1-px px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(video)}/>
                            <Button
                                label="수정"
                                className="btn-color-info d-inline-block mr-2 my-1-px px-2 py-0 rounded"
                                onClick={() => {
                                    setEditContent(video);
                                    setOpenModal(true);
                                }}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block my-1-px px-2 py-0 rounded"
                                onClick={() => setSelectedId(video.id)}/>
                        </>
                    )
                }
            })  

            setData(_videos);

        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleSearch = (text) => {
        const _state = {...tableState, search: text};
        setTableState(_state);
        getData(_state);
    }

    const handleChangeTable = (state) => {
        const _state = {...tableState, ...state};
        
        setTableState(_state);
        getData(_state);
    }

    const handleDeleteContent = () => {
        if(submitting) return;
        setSubmitting(true);

        DeleteVideo(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("Video가 삭제되였습니다.");
            getData(tableState);
        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleChangeStatus = (video) => {
        UpdateVideoStatus(video.id, {status: video.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">VIDEO영역 콘텐츠</h4>

            <div className="op-table-toolbar font-14">
                <SearchBar value={tableState.search} onChange={handleSearch}/>
                <Button label="등록" className="btn-contain light px-3" onClick={() => setOpenModal(true)}/>
            </div>

            <Table
                data={data}
                columns={columns}
                tableState={tableState}
                onChange={handleChangeTable}
            />

            {openModal &&
                <VideoContentForm
                    open={openModal}
                    video={editContent}
                    onClose={() => {
                        setEditContent(null);
                        setOpenModal(false);
                    }}
                    onSuccess={() => {
                        setOpenModal(false);
                        setEditContent(null);
                        getData(tableState);
                    }}/>
            }

            {selectedId && 
                <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="확인"
                    confirmBtnBsStyle="danger"
                    cancelBtnText="취소"
                    title="삭제하시겠습니까?"
                    onConfirm={handleDeleteContent}
                    onCancel={() => setSelectedId(null)}
                >
                    삭제된 VIDEO는 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default VideoContent;