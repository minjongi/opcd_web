import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetCampForms, DeleteCampForm, UpdateCampFormStatus } from '../../store/camp/api';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    {key: 'form_name', label: '신청양식명', sort: true, searchable: true},
    {key: 'campaign_name', label: '캠페인명', sort: true, searchable: true},
    {key: 'author', label: '작성자', sort: true},
    {key: 'created_at', label: '작성일자', sort: true},
    {key: 'status', label: '상태', sort: true},
    {key: 'action', label: '', width: 208}
]

const BBApplicantDocuments = () => {
    const history = useHistory();
    const type = 'BEATBOX';
    const [tableState, setTableState] = useState({
        page: 1,
        perPage: 15,
        total: 0,
        search: '',
        sort: '',
        sortDir: '',
        totalCount: 0
    });

    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        getData(tableState);
    }, []);

    const getData = (state) => {
        if(submitting) return;
        setSubmitting(true);
        
        GetCampForms({...state, type}).then(res => {
            setSubmitting(false);
            
            const {total, forms} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _forms = forms.map((form, index) => {
                return {
                    ...form,
                    num: total - index - (state.page - 1)*state.perPage,
                    created_at: form.created_at.slice(0, 10),
                    status: form.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">노출</span>
                            :
                            <span className="color-warning font-weight-bold">대기</span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(form)}/>
                            <Button
                                label="수정"
                                className="btn-color-info d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => handleGoToDetail(form)}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block px-2 py-0 rounded"
                                onClick={() => setSelectedId(form.id)}/>
                        </>
                    )
                }
            })  

            setData(_forms);

        }).catch(err => {
            setSubmitting(false);
            console.log(err);
        })
    }

    const handleGoToDetail = (item) => {
        if(item) history.push(`/admin/beatbox_camp_document/${item.id}`);
        else history.push(`/admin/beatbox_camp_document`)
    }

    const handleDeleteFeature = () => {
        if(submitting) return;
        setSubmitting(true);

        DeleteCampForm(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("신청양식이 삭제되였습니다.");
            getData(tableState);
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

    const handleChangeStatus = (form) => {
        UpdateCampFormStatus(form.id, {status: form.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">신청양식 목록</h4>
            
            <div className="op-table-toolbar font-14">
                <SearchBar value={tableState.search} onChange={handleSearch}/>
                <Button label="등록" className="btn-contain light px-3" onClick={() => handleGoToDetail()}/>
            </div>
            
            <Table
                data={data}
                columns={columns}
                tableState={tableState}
                onChange={handleChangeTable}
            />

            {selectedId && 
                <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="확인"
                    confirmBtnBsStyle="danger"
                    cancelBtnText="취소"
                    title="삭제하시겠습니까?"
                    onConfirm={handleDeleteFeature}
                    onCancel={() => setSelectedId(null)}
                >
                    삭제된 신청양식은 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default BBApplicantDocuments;