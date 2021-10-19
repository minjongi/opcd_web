import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Table, CircleFullSpinner } from '../../components';
import { Button, TextInput } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetRdaFaqs, PostFaq, DeleteFaq, UpdateFaqStatus } from '../../store/rda/api';

const defaultData = {
  question: '',
  answer: ''
}

const columns = [
    {key: 'num', label: 'No'},
    {key: 'question', label: '질문'},
    {key: 'answer', label: '답변'},
    {key: 'status', label: '상태', sort: true},
    {key: 'action', label: '', width: 156}
]

const RdaFaqList = () => {
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

    useEffect(() => {
        getData(tableState);
    }, []);

    const getData = (state) => {
        if(submitting) return;
        setSubmitting(true);
        
        GetRdaFaqs({...state}).then(res => {
            setSubmitting(false);
            
            const {total, faqs} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _faqlist = faqs.map((faq, index) => {
                return {
                    ...faq,
                    num: total - index - (state.page - 1)*state.perPage,
                    status: faq.status === 'ACTIVE' ? 
                            <span className="color-success font-weight-bold">노출</span>
                            :
                            <span className="color-warning font-weight-bold">비노출</span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 my-1-px px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(faq)}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block my-1-px px-2 py-0 rounded"
                                onClick={() => setSelectedId(faq.id)}/>
                        </>
                    )
                }
            })  
            setData(_faqlist);

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

        DeleteFaq(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("FAQ가 삭제되였습니다.");
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

    const handleChangeField = (e) => {
      const {id, value} = e.target;
      setSelectedRow({...selectedRow, [id]: value});
    }

    const handleSubmit = () => {
      if(!selectedRow.question || !selectedRow.answer || submitting) return;
      setSubmitting(true);

      const formData = new FormData();
      formData.append('question', selectedRow.question);
      formData.append('answer', selectedRow.answer);

      PostFaq(formData)
          .then(res => {
              setSubmitting(false);
              setSelectedRow(null);
              getData(tableState);
          }).catch(err => {
              setSubmitting(false);
          });
    }

    const handleCloseModal = () => {
      setSelectedRow(null);
    }

    return (
        <div className="pb-4">
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">RDA FAQ 목록</h4>

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
                    <h5 className="m-0">FAQ 등록</h5>
                </Modal.Title>
      
                <Modal.Body className="p-4 text-bold">
                  <div className="inline-group md-block mb-3">
                      <div className="w-8-rem mt-2">질문*</div>
                      <div className="flex-full">
                          <TextInput
                              id="question"
                              name="question"
                              className="light rounded"
                              value={selectedRow.question}
                              onChange={handleChangeField}/>
                      </div>
                  </div>

                  <div className="inline-group md-block mb-5">
                      <div className="w-8-rem mt-2">답변*</div>
                      <div className="flex-full">
                          <TextInput
                              id="answer"
                              name="answer"
                              rows="3"
                              className="light rounded"
                              value={selectedRow.answer}
                              onChange={handleChangeField}/>
                      </div>
                  </div>

                  <div className="d-flex px-1 justify-content-center">
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
                    삭제된 FAQ는 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default RdaFaqList;