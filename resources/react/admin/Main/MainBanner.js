import React, { useState, useEffect } from 'react';

import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetBanners, DeleteBanner, UpdateBannerStatus } from '../../store/main/api';
import MainBannerForm from './MainBannerForm';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    {key: 'title', label: '타이틀', sort: true, searchable: true},
    {key: 'description', label: '서브문구', sort: true, searchable: true},
    {key: 'link', label: '링크', sort: true, searchable: true, minWidth: 100},
    {key: 'author', label: '작성자', sort: true, searchable: true, minWidth: 80},
    {key: 'created_at', label: '작성일자', sort: true, searchable: true, minWidth: 60},
    {key: 'status', label: '상태', sort: true, searchable: true},
    {key: 'action', label: '', width: 208}
]

const MainBanner = () => {
    const type = 'MAIN';
    const [submitting, setSubmitting] = useState(false);
    const [tableState, setTableState] = useState({
        page: 1,
        perPage: 10,
        total: 0,
        search: '',
        sort: '',
        sortDir: ''
    });
    const [data, setData] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [editBanner, setEditBanner] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        getData(tableState);
    }, []);

    const getData = (state) => {
        if(submitting) return;
        setSubmitting(true);
        
        GetBanners({...state, type}).then(res => {
            setSubmitting(false);
            
            const {total, banners} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _banners = banners.map((banner, index) => {
                return {
                    ...banner,
                    num: total - index - (state.page - 1)*state.perPage,
                    link: banner.link && banner.link !== 'null' ? <a href={banner.link} target="_blank">{banner.link}</a> : '',
                    created_at: banner.created_at.slice(0, 10),
                    status: banner.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">확인</span>
                            :
                            <span className="color-warning font-weight-bold">대기</span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block my-1-px mr-2 px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(banner)}/>
                            <Button
                                label="수정"
                                className="btn-color-info d-inline-block my-1-px mr-2 px-2 py-0 rounded"
                                onClick={() => {
                                    setEditBanner(banner);
                                    setOpenModal(true);
                                }}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block my-1-px px-2 py-0 rounded"
                                onClick={() => setSelectedId(banner.id)}/>
                        </>
                    )
                }
            })  

            setData(_banners);

        }).catch(err => {
            setSubmitting(false);
            console.log(err);
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

    const handleDeleteBanner = () => {
        if(submitting) return;
        setSubmitting(true);

        DeleteBanner(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("배너 삭제되였습니다.");
            getData(tableState);
        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleChangeStatus = (banner) => {
        UpdateBannerStatus(banner.id, {status: banner.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">메인 비쥬얼 배너</h4>

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
                <MainBannerForm
                    open={openModal}
                    banner={editBanner}
                    onClose={() => {
                        setEditBanner(null);
                        setOpenModal(false);
                    }}
                    onSuccess={() => {
                        setOpenModal(false);
                        setEditBanner(null);
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
                    onConfirm={handleDeleteBanner}
                    onCancel={() => setSelectedId(null)}
                >
                    삭제된 배너는 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default MainBanner;