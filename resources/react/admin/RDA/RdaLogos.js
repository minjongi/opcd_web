import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Table, FileUploader, CircleFullSpinner, ImagePreview } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetRdaLogos, PostLogo, DeleteLogo, UpdateLogoStatus } from '../../store/rda/api';

const defaultData = {
  name: '',
  url: ''
}

const columns = [
    {key: 'num', label: 'No'},
    {key: 'image', label: '로고 이미지'},
    {key: 'status', label: '상태', sort: true},
    {key: 'action', label: '', width: 156}
]

const RdaLogos = () => {
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
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        getData(tableState);
    }, []);

    const getData = (state) => {
        if(submitting) return;
        setSubmitting(true);
        
        GetRdaLogos({...state}).then(res => {
            setSubmitting(false);
            
            const {total, logos} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _logolist = logos.map((logo, index) => {
                return {
                    ...logo,
                    num: total - index - (state.page - 1)*state.perPage,
                    image: <img src={logo.url} height="30px"/>,
                    status: logo.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">노출</span>
                            :
                            <span className="color-warning font-weight-bold">비노출</span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 my-1-px px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(logo)}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block my-1-px px-2 py-0 rounded"
                                onClick={() => setSelectedId(logo.id)}/>
                        </>
                    )
                }
            })  
            setData(_logolist);

        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleChangeTable = (state) => {
        const _state = {...tableState, ...state};
        
        setTableState(_state);
        getData(_state);
    }

    const handleDeleteContent = () => {
        if(submitting) return;
        setSubmitting(true);

        DeleteLogo(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("로고가 삭제되였습니다.");
            getData(tableState);
        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleChangeStatus = (logo) => {
        UpdateLogoStatus(logo.id, {status: logo.status === 'ACTIVE' ? 'DISABLE' : 'ACTIVE'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleSelectFile = (files) => {
      setImageFile({
          file: files[0],
          preview: URL.createObjectURL(files[0])
      });
    }

    const handleSubmit = () => {
      if(submitting) return;
      if(!imageFile) return;
      setSubmitting(true);

      const formData = new FormData();
      formData.append('name', selectedRow.name || '');
      formData.append('file', imageFile.file);

      PostLogo(formData)
          .then(res => {
              setSubmitting(false);
              setSelectedRow(null);
              setImageFile(null);
              getData(tableState);
          }).catch(err => {
              setSubmitting(false);
          });
    }

    const handleCloseModal = () => {
      setSelectedRow(null);
      setImageFile(null);
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">RDA 로고 목록</h4>

            <div className="op-table-toolbar font-14">
                <div></div>
                <Button label="등록" className="btn-contain light px-3" onClick={() => setSelectedRow(defaultData)}/>
            </div>

            <Table
                data={data}
                columns={columns}
                tableState={tableState}
                onChange={handleChangeTable}
            />

            {!!selectedRow &&
              <Modal
                show={true}
                centered
                size="lg"
                onHide={handleCloseModal}
              >
                <Modal.Title className="p-4 back-primary">
                    <h5 className="m-0">로고 등록</h5>
                </Modal.Title>
      
                <Modal.Body className="p-4 text-bold">
                  <div className="d-flex justify-content-center">
                      {selectedRow.url || imageFile ?
                          <div className="max-w-300">
                              <ImagePreview
                                  url={selectedRow.url || imageFile.preview}
                                  deletable
                                  onDelete={() => {
                                      setImageFile(null);
                                  }}/>
                          </div>
                          :
                          <FileUploader onChange={handleSelectFile} accept=".jpg,.png"/>
                      }
                  </div>

                  <div className="d-flex px-1 justify-content-center mt-5">
                      <Button label="등록하기" className="btn-contain light px-5 mx-2" onClick={handleSubmit}/>
                      <Button label="취소하기" className="light px-5 mx-2" onClick={handleCloseModal}/>
                  </div>
                </Modal.Body>
              </Modal>
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
                    삭제된 로고는 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default RdaLogos;