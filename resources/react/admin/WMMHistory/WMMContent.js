import React, { useState, useEffect } from 'react';

import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetContents, DeleteContent, UpdateContentStatus } from '../../store/wmm/api';
import WMMContentForm from './WMMContentForm';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    {key: 'title', label: '타이틀', sort: true, searchable: true},
    {key: 'type', label: '타입', sort: true},
    {key: 'link', label: '링크', sort: true, searchable: true},
    {key: 'created_at', label: '작성일자', sort: true, searchable: true},
    {key: 'status', label: '상태', sort: true, searchable: true},
    {key: 'action', label: '', width: 208}
]

const WMMContent = () => {
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
        
        GetContents({...state}).then(res => {
            setSubmitting(false);
            
            const {total, contents} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _contents = contents.map((content, index) => {
                return {
                    ...content,
                    num: total - index - (state.page - 1)*state.perPage,
                    type: content.type === 'PACK' ? 'SAMPLE PACK' : content.type,
                    created_at: content.created_at.slice(0, 10),
                    status: content.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">확인</span>
                            :
                            <span className="color-warning font-weight-bold">대기</span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(content)}/>
                            <Button
                                label="수정"
                                className="btn-color-info d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => {
                                    setEditContent(content);
                                    setOpenModal(true);
                                }}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block px-2 py-0 rounded"
                                onClick={() => setSelectedId(content.id)}/>
                        </>
                    )
                }
            })  

            setData(_contents);

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

        DeleteContent(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("배너가 삭제되였습니다.");
            getData(tableState);
        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleChangeStatus = (content) => {
        UpdateContentStatus(content.id, {status: content.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">WMM 배너</h4>

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
                <WMMContentForm
                    open={openModal}
                    content={editContent}
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
                    삭제된 배너는 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default WMMContent;