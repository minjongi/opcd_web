import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetFeatureList, DeleteFeatureContent, UpdateFeatureStatus } from '../../store/feature/api';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    {key: 'title', label: '타이틀', sort: true, searchable: true},
    {key: 'description', label: '서브구문', sort: true, searchable: true},
    {key: 'author', label: '작성자', sort: true, searchable: true, width: 100},
    {key: 'type', label: '구분', sort: true, searchable: true, width: 100},
    {key: 'created_at', label: '작성일자', sort: true, searchable: true, width: 96},
    {key: 'status', label: '상태', sort: true, width: 60},
    {key: 'action', label: '', width: 208}
]

const FeatureContentList = () => {
    const history = useHistory();
    const location = useLocation();
    const [tableState, setTableState] = useState({
        perPage: 15,
        page: 1,
        total: 0,
        search: '',
        sort: '',
        sortDir: '',
        type: '',
        totalCount: 0
    });

    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    

    useEffect(() => {
        let _page = new URLSearchParams(location.search).get('page');
        let _tableState = {...tableState, page: Number(_page || 1)};
        getData(_tableState);
    }, []);

    const getData = (state) => {
        if(submitting) return;
        setSubmitting(true);
        
        GetFeatureList(state).then(res => {
            setSubmitting(false);
            
            const {total, features} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _features = features.map((feature, index) => {
                return {
                    ...feature,
                    num: total - index - (state.page - 1)*state.perPage,
                    created_at: feature.created_at.slice(0, 10),
                    status: feature.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">확인</span>
                            :
                            <span className="color-warning font-weight-bold">대기</span>,
                    action: (
                        <>
                            <Button 
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(feature)}/>
                            <Button
                                label="수정"
                                className="btn-color-info d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => handleGoToDetail(feature)}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block px-2 py-0 rounded"
                                onClick={() => setSelectedId(feature.id)}/>
                        </>
                    )
                }
            })  

            setData(_features);

        }).catch(err => {
            setSubmitting(false);
            console.log(err);
        })
    }

    const handleDeleteFeature = () => {
        if(submitting) return;
        setSubmitting(true);

        DeleteFeatureContent(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("콘텐츠가 삭제되였습니다.");
            getData(tableState);
        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleGoToDetail = (item) => {
        if(item) history.push(`/admin/feature_detail/${item.id}`)
        else history.push(`/admin/feature_detail`)
    }

    const handleSearch = (text) => {
        const _state = {...tableState, search: text};
        
        setTableState(_state);
        getData(_state);
    }

    const handleChangeTable = (state) => {
        const _state = {...tableState, ...state};
        setTableState(_state);
        let query = _state.page > 0 ? `?page=${_state.page}` : '';
        if(query) history.push(`/admin/feature_list${query}`);
        getData(_state);
    }

    const handleChangeType = (type) => {
        if(type === tableState.type || submitting) return;
        const _tableState = {...tableState, page: 1, type};
        setTableState(_tableState);
        getData(_tableState);
    }

    const handleChangeStatus = (feature) => {
        UpdateFeatureStatus(feature.id, {status: feature.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">MAGAZINE 콘텐츠 목록</h4>

            <div className="op-navs light font-14 mb-3">
                <span className={`op-nav-item ${tableState.type === '' ? 'active' : ''}`} onClick={() => handleChangeType('')}>TOTAL</span>
                <span className="mx-1">ㅣ</span>
                <span className={`op-nav-item ${tableState.type === 'NEWS' ? 'active' : ''}`} onClick={() => handleChangeType('NEWS')}>NEWS</span>
                <span className="mx-1">ㅣ</span>
                <span className={`op-nav-item ${tableState.type === 'INTERVIEW' ? 'active' : ''}`} onClick={() => handleChangeType('INTERVIEW')}>INTERVIEW</span>
                <span className="mx-1">ㅣ</span>
                <span className={`op-nav-item ${tableState.type === 'FEATURE' ? 'active' : ''}`} onClick={() => handleChangeType('FEATURE')}>FEATURE</span>
                {/* <span className={`op-nav-item ${tableState.type === 'MUSIC' ? 'active' : ''}`} onClick={() => handleChangeType('MUSIC')}>MUSIC</span>
                <span className="mx-1">ㅣ</span>
                <span className={`op-nav-item ${tableState.type === 'TUTORIAL' ? 'active' : ''}`} onClick={() => handleChangeType('TUTORIAL')}>TUTORIAL</span>
                <span className="mx-1">ㅣ</span>
                <span className={`op-nav-item ${tableState.type === 'LIFESTYLE' ? 'active' : ''}`} onClick={() => handleChangeType('LIFESTYLE')}>LIFESTYLE</span> */}
            </div>
            
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
                    삭제된 콘텐츠는 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default FeatureContentList;