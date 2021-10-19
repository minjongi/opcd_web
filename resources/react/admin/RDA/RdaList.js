import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetRdaList, DeleteRda, UpdateRdaStatus, ZipDownload, ExcelDownload } from '../../store/rda/api';
import RdaDetail from './RdaDetail';

const columns = [
    {key: 'code', label: '코드', sort: true, searchable: true, width: 146},
    {key: 'genre_text', label: '구분'},
    {key: 'artist_name', label: '아티스트명', sort: true, searchable: true},
    {key: 'email', label: '이메일', sort: true, searchable: true},
    {key: 'phone', label: '핸드폰', sort: true, searchable: true},
    {key: 'song_name', label: '곡명', sort: true, searchable: true},
    {key: 'created_at', label: '등록일자', sort: true, searchable: true, width: 96},
    // {key: 'status', label: '상태', sort: true, searchable: true, width: 60},
    {key: 'action', label: '', width: 132}
]

const RdaList = () => {
    const params = useParams();
    const history = useHistory();
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
    const [selectedRows, setSelectedRows] = useState([]);

    const [detail, setDetail] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        getData(tableState);
    }, []);

    const getData = (state) => {
        if(submitting) return;
        setSubmitting(true);
        
        GetRdaList({...state, campaign: params.id || ''}).then(res => {
            setSubmitting(false);
            
            const {total, rdalist} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _rdalist = rdalist.map((rda, index) => {
                return {
                    ...rda,
                    num: total - index - (state.page - 1)*state.perPage,
                    created_at: rda.created_at.slice(0, 10),
                    status: rda.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">확인</span>
                            :
                            <span className="color-warning font-weight-bold">대기</span>,
                    action: (
                        <>
                            {/* <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 my-1-px px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(rda)}/> */}
                            <Button
                                label="보기"
                                className="btn-color-info d-inline-block mr-2 my-1-px px-2 py-0 rounded"
                                onClick={() => {
                                    setDetail(rda);
                                }}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block my-1-px px-2 py-0 rounded"
                                onClick={() => setSelectedId(rda.id)}/>
                        </>
                    )
                }
            })  
            setData(_rdalist);

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

    const handleChangeSelection = (row) => {
      let _rows = [...selectedRows];
      let _index = _rows.indexOf(row.id);
      if(_index > -1){
        _rows.splice(_index, 1);
      }else{
        _rows.push(row.id);
      }

      setSelectedRows(_rows);
    }

    const handleChangeAllSelection = (checked) => {
        if(!checked){
            setSelectedRows([]);
        }else{
            let _rows = data.map(d => d.id);
            setSelectedRows(_rows);
        }
    }

    const handleDeleteContent = () => {
        if(submitting) return;
        setSubmitting(true);

        DeleteRda(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("Event가 삭제되였습니다.");
            getData(tableState);
        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleChangeStatus = (rda) => {
        UpdateRdaStatus(rda.id, {status: rda.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleDownloadFiles = () => {
      if(!selectedRows.length) {
          toast.error('신청자들을 선택하세요');
          return;
      }

      ZipDownload({ids: selectedRows}).then(res => {
        if(res.data.status === 'success'){
            const link = document.createElement('a');
            link.href = res.data.filename;
            link.setAttribute('download', 'files.zip');
            document.body.appendChild(link);
            link.click();
        }else{
            toast.error('다운로드가 실패하였습니다.');    
        }
      }).catch(err => {
        toast.error('다운로드가 실패하였습니다.');
      });
    }

    const handleDownloadExcel = () => {
        if(!selectedRows.length) {
            toast.error('신청자들을 선택하세요');
            return;
        }
  
        ExcelDownload({ids: selectedRows}).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.xlsx');
            document.body.appendChild(link);
            link.click();
        });
    }

    const handleGoToList = () => {
        history.push('/admin/rda_campaigns');
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">
                {params.id ? 'RDA 참가 캠페인 상세' : 'RDA 신청자 목록'}
            </h4>

            <div className="op-table-toolbar font-14">
                <SearchBar value={tableState.search} onChange={handleSearch}/>
                <div className="d-flex align-items-center">
                  {params.id && <Button label="돌아가기" className="btn-contain light px-3 mr-5" onClick={handleGoToList}/>}
                  <Button label="일괄 다운로드" className="btn-contain light px-3 mr-3" onClick={handleDownloadFiles}/>
                  <Button label="Excel 다운로드" className="btn-contain light px-3" onClick={handleDownloadExcel}/>
                </div>
            </div>

            <Table
                data={data}
                columns={columns}
                tableState={tableState}
                checkbox={true}
                onChange={handleChangeTable}
                onChangeSelection={handleChangeSelection}
                onChangeAllSection={handleChangeAllSelection}
            />

            {!!detail &&
                <RdaDetail
                    open={true}
                    data={detail}
                    onClose={() => {
                        setDetail(null);
                    }}
                  />
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
                    삭제된 신청자내용은 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default RdaList;