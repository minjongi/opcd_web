import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button, Select } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetCategorNames, GetContents, DeleteContent, UpdateContentStatus } from '../../store/lib/api';
import VINYLLibForm from './VINYLLibForm';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    {key: 'image', label: '이미지'},
    {key: 'description', label: '서브문구', sort: true, searchable: true},
    {key: 'category_name', label: '카테고리', searchable: true},
    {key: 'author', label: '작성자', sort: true, searchable: true, minWidth: 80},
    {key: 'created_at', label: '작성일자', sort: true, searchable: true, minWidth: 60},
    {key: 'status', label: '상단노출', sort: true, searchable: true},
    {key: 'action', label: '', minWidth: 106}
]

const VINYLLibList = () => {
    const history = useHistory();
    const [submitting, setSubmitting] = useState(false);
    const [tableState, setTableState] = useState({
        perPage: 10,
        page: 1,
        total: 0,
        search: '',
        sort: '',
        sortDir: '',
        category: '',
        tableCount: 0
    });
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);

    // const [openModal, setOpenModal] = useState(false);
    // const [editBanner, setEditBanner] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        getCategories();
        getData(tableState);
    }, []);

    const getCategories = () => {
        GetCategorNames().then(res => {
            const { names } = res.data;
            setCategories(names);
        });
    }

    const getData = (state) => {
        if(submitting) return;
        setSubmitting(true);
        
        GetContents(state).then(res => {
            setSubmitting(false);
            
            const {total, contents} = res.data;
            setTableState({...state, tableCount: total, total: Math.ceil(total/tableState.perPage)});

            let _contents = contents.map((content, index) => {
                return {
                    ...content,
                    num: total - index - (state.page - 1)*state.perPage,
                    image: <div style={{width: 50}}>{content.image && <img src={content.image} style={{width: '100%'}}/>}</div>,
                    category_name: content.category.name,
                    created_at: content.created_at.slice(0, 10),
                    status: content.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">노출</span>
                            :
                            <span className="color-warning font-weight-bold"></span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block my-1-px mr-2 px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(content)}/>
                            <Button
                                label="수정"
                                className="btn-color-info d-inline-block my-1-px mr-2 px-2 py-0 rounded"
                                onClick={() => {
                                    handleGoToDetail(content)
                                    // setEditBanner(content);
                                    // setOpenModal(true);
                                }}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block my-1-px px-2 py-0 rounded"
                                onClick={() => setSelectedId(content.id)}/>
                        </>
                    )
                }
            })  

            setData(_contents);

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

        DeleteContent(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("콘텐츠 삭제되였습니다.");
            getData(tableState);
        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleChangeStatus = (content) => {
        const _tableState = {...tableState};
        UpdateContentStatus(content.id, {status: content.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(_tableState);
        }).catch(err => {
            console.log(err);
        })
    }
    
    const handleChangeCategory = (e) => {
        const {value} = e.target;
        const _tableState = {...tableState, category: value};
        setTableState(_tableState);
        getData(_tableState);
    }

    const handleGoToDetail = (item) => {
        if(item) history.push(`/admin/vinyl_lib_detail/${item.id}`)
        else history.push(`/admin/vinyl_lib_detail`)
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">VINYL LIBRARY</h4>

            <div className="inline-group md-block mb-3">
                <div className="mt-2 mr-4">카테고리 : </div>
                <div className="flex-full max-w-300">
                    <Select
                        id="category"
                        className="light rounded"
                        value={tableState.category}
                        onChange={handleChangeCategory}>
                            <option value="">Total</option>
                            {categories && categories.map((cat, index) => 
                                <option key={index} value={cat.id}>{cat.name}</option>
                            )}
                    </Select>
                </div>
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

            {/* {openModal &&
                <VINYLLibForm
                    open={openModal}
                    categories={categories}
                    content={editBanner}
                    onClose={() => {
                        setEditBanner(null);
                        setOpenModal(false);
                    }}
                    onSuccess={() => {
                        setOpenModal(false);
                        setEditBanner(null);
                        getData(tableState);
                    }}/>
            } */}

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
                    삭제된 콘텐츠는 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};
export default VINYLLibList;