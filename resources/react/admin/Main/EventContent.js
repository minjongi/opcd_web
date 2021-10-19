import React, { useState, useEffect } from 'react';

import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetEvents, DeleteEvent, UpdateEventStatus } from '../../store/main/api';
import EventContentForm from './EventContentForm';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    {key: 'title', label: '타이틀', sort: true, searchable: true},
    {key: 'desc', label: 'HOST', sort: true, searchable: true},
    {key: 'link', label: '링크', sort: true, searchable: true, minWidth: 120},
    {key: 'created_at', label: '작성일자', sort: true, searchable: true, width: 96},
    {key: 'status', label: '상태', sort: true, searchable: true, width: 60},
    {key: 'action', label: '', width: 208}
]

const EventContent = () => {
    const [submitting, setSubmitting] = useState(false);
    const [tableState, setTableState] = useState({
        page: 1,
        perPage: 10,
        total: 0,
        search: '',
        sort: '',
        sortDir: '',
        totalCount: 0
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
        
        GetEvents({...state}).then(res => {
            setSubmitting(false);
            
            const {total, events} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _events = events.map((event, index) => {
                return {
                    ...event,
                    num: total - index - (state.page - 1)*state.perPage,
                    link: <a href={event.link} target="_blank">{event.link}</a>,
                    created_at: event.created_at.slice(0, 10),
                    status: event.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">확인</span>
                            :
                            <span className="color-warning font-weight-bold">대기</span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 my-1-px px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(event)}/>
                            <Button
                                label="수정"
                                className="btn-color-info d-inline-block mr-2 my-1-px px-2 py-0 rounded"
                                onClick={() => {
                                    setEditContent(event);
                                    setOpenModal(true);
                                }}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block my-1-px px-2 py-0 rounded"
                                onClick={() => setSelectedId(event.id)}/>
                        </>
                    )
                }
            })  
            setData(_events);

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

        DeleteEvent(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("Event가 삭제되였습니다.");
            getData(tableState);
        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleChangeStatus = (event) => {
        UpdateEventStatus(event.id, {status: event.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">EVENT영역 콘텐츠</h4>

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
                <EventContentForm
                    open={openModal}
                    event={editContent}
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
                    삭제된 EVENT는 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default EventContent;