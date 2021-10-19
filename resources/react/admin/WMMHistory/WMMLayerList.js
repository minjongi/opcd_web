import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetLayers, DeleteLayer } from '../../store/wmm/api';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    {key: 'title', label: '레이어명', sort: true, searchable: true},
    {key: 'author', label: '작성자', sort: true, searchable: true},
    {key: 'created_at', label: '작성일자', sort: true, searchable: true},
    {key: 'action', label: '', width: 200}
]

const WMMLayerList = () => {
    const history = useHistory();
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
        
        GetLayers({...state}).then(res => {
            setSubmitting(false);
            
            const {total, layers} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _layers = layers.map((feature, index) => {
                return {
                    ...feature,
                    num: total - index - (state.page - 1)*state.perPage,
                    created_at: feature.created_at.slice(0, 10),
                    action: (
                        <>
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

            setData(_layers);

        }).catch(err => {
            setSubmitting(false);
            console.log(err);
        })
    }

    const handleDeleteFeature = () => {
        if(submitting) return;
        setSubmitting(true);

        DeleteLayer(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("콘텐츠가 삭제되였습니다.");
            getData(tableState);
        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleGoToDetail = (item) => {
        if(item) history.push(`/admin/wmm_history_layer/${item.id}`)
        else history.push(`/admin/wmm_history_layer`)
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

    return (
        <div>
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">WMM 레이어팝업 목록</h4>
            
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
                    삭제된 레이어는 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default WMMLayerList;