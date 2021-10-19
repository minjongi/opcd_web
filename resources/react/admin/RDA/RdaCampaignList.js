import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import RdaCampaignForm from './RdaCampaignForm';
import { GetRdaCampaignList, UpdateRdaCampaignStatus, DeleteRdaCampaign } from '../../store/rda/api';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    {key: 'title', label: '타이틀', sort: true, searchable: true},
    {key: 'url', label: '상세보기 경로', sort: true},
    {key: 'author', label: '작성자', sort: true, searchable: true},
    {key: 'created_at', label: '작성일자', sort: true, searchable: true},
    {key: 'status', label: '상태', sort: true, searchable: true},
    {key: 'action', label: '', width: 262}
]

const RdaCampaignList = () => {
    const [tableState, setTableState] = useState({
        page: 1,
        total: 0,
        perPage: 15,
        search: '',
        sort: '',
        sortDir: '',
        totalCount: 0
    });

    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [campInfo, setCampInfo] = useState(null);
    
    useEffect(() => {
        getData(tableState);
    }, []);

    const getData = (state) => {
        if(submitting) return;
        setSubmitting(true);
        
        GetRdaCampaignList(state).then(res => {
            setSubmitting(false);
            
            const {total, campaigns} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _campaigns = campaigns.map((campaign, index) => {
                return {
                    ...campaign,
                    num: total - index - (state.page - 1)*state.perPage,
                    created_at: campaign.created_at.slice(0, 10),
                    status: campaign.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">확인</span>
                            :
                            <span className="color-warning font-weight-bold">대기</span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(campaign)}/>
                            <Button
                                label="수정"
                                className="btn-color-info d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => {
                                    setCampInfo(campaign);
                                    setOpenModal(true);
                                }}/>
                            <Link to={`/admin/rda_campaign_detail/${campaign.id}`} className="button btn-color-success d-inline-block mr-2 px-2 py-0 rounded">보기</Link>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block px-2 py-0 rounded"
                                onClick={() => setSelectedId(campaign.id)}/>
                        </>
                    )
                }
            })  

            setData(_campaigns);

        }).catch(err => {
            setSubmitting(false);
            console.log(err);
        })
    }

    const handleDeleteFeature = () => {
        if(submitting) return;
        setSubmitting(true);

        DeleteRdaCampaign(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("카테고리 삭제되였습니다.");
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
        console.log(state, tableState);
        setTableState(_state);
        getData(_state);
    }

    const handleChangeStatus = (camp) => {
        UpdateRdaCampaignStatus(camp.id, {status: camp.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">RDA 참가 캠페인 목록</h4>
            
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
                <RdaCampaignForm
                    open={openModal}
                    campInfo={campInfo}
                    onClose={() => {
                        setCampInfo(null);
                        setOpenModal(false);
                    }}
                    onSuccess={() => {
                        setOpenModal(false);
                        setCampInfo(null);
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
                    onConfirm={handleDeleteFeature}
                    onCancel={() => setSelectedId(null)}
                >
                    삭제된 카테고리는 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default RdaCampaignList;