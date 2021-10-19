import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetApplicants, DeleteApplicant, UpdateApplicantStatus } from '../../store/camp/api';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    {key: 'applicant_id', label: '접수번호', sort: true, searchable: true},
    {key: 'user_name', label: '신청자명', sort: true, searchable: true},
    {key: 'campaign_name', label: '캠페인명', sort: true, searchable: true},
    {key: 'security', label: '공개여부', sort: true},
    {key: 'status', label: '상태', sort: true},
    {key: 'action', label: '', width: 208}
]

const WMMCampApplicantList = () => {
    const history = useHistory();
    const type = 'WMM';
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
        
        GetApplicants({...state, type}).then(res => {
            setSubmitting(false);
            
            const {total, applicants} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _applicants = applicants.map((applicant, index) => {
                return {
                    ...applicant,
                    num: total - index - (state.page - 1)*state.perPage,
                    applicant_id: <Link to={`/admin/wmm_camp_applicant_detail/${applicant.id}`} className="text-decoration-underline cursor-pointer">
                                        {applicant.applicant_id}
                                  </Link>,
                    security: applicant.security === 'PRIVATE' ? '비공개' : '공개',
                    status: applicant.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">확인</span>
                            :
                            <span className="color-warning font-weight-bold">대기</span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(applicant)}/>
                            <Button
                                label="수정"
                                className="btn-color-info d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => handleGoToDetail(applicant)}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block px-2 py-0 rounded"
                                onClick={() => setSelectedId(applicant.id)}/>
                        </>
                    )
                }
            })  

            setData(_applicants);

        }).catch(err => {
            setSubmitting(false);
            console.log(err);
        })
    }

    const handleGoToDetail = (item) => {
        if(item) history.push(`/admin/wmm_camp_applicant/${item.id}`);
        else history.push(`/admin/wmm_camp_applicant`)
    }

    const handleDeleteFeature = () => {
        if(submitting) return;
        setSubmitting(true);

        DeleteApplicant(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("신청내역이 삭제되였습니다.");
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

    const handleChangeStatus = (applicant) => {
        UpdateApplicantStatus(applicant.id, {status: applicant.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">WMM 신청자 목록</h4>
            
            <div className="op-table-toolbar font-14">
                <SearchBar value={tableState.search} onChange={handleSearch}/>
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
                    삭제된 신청내역은 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default WMMCampApplicantList;