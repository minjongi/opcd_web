import React, { useState, useEffect } from 'react';

import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetAdminFaqs, DeleteAdminFaq, UpdateFaqStatus } from '../../store/faq/api';
import FaqForm from './FaqForm';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    {key: 'question', label: '질문', sort: true, searchable: true},
    {key: 'created_at', label: '작성일자', sort: true, searchable: true},
    {key: 'status', label: '상태', sort: true},
    {key: 'action', label: '', width: 206}
]

const FaqAdminPage = () => {
    const [submitting, setSubmitting] = useState(false);
    const [tableState, setTableState] = useState({
        perPage: 10,
        page: 1,
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
        
        GetAdminFaqs(state).then(res => {
            setSubmitting(false);
            
            const {total, faqs} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _faqs = faqs.map((faq, index) => {
                return {
                    ...faq,
                    num: total - index - (state.page - 1)*state.perPage,
                    created_at: faq.created_at.slice(0, 10),
                    status: faq.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">확인</span>
                            :
                            <span className="color-warning font-weight-bold">대기</span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(faq)}/>
                            <Button
                                label="수정"
                                className="btn-color-info d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => {
                                    setEditContent(faq);
                                    setOpenModal(true);
                                }}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block px-2 py-0 rounded"
                                onClick={() => setSelectedId(faq.id)}/>
                        </>
                    )
                }
            })  
            setData(_faqs);

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

        DeleteAdminFaq(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            // toast.success("Event가 삭제되였습니다.");
            getData(tableState);
        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleChangeStatus = (faq) => {
        UpdateFaqStatus(faq.id, {status: faq.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">FAQ</h4>

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
                <FaqForm
                    open={openModal}
                    faq={editContent}
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
                    삭제된 질문은 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default FaqAdminPage;