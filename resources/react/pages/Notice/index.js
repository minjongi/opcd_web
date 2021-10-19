import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import { Table } from '../../components'
import { Button } from '../../components/form';

import { getNoticeType } from '../../helpers/utils';
import { GetNotices } from '../../store/notice/user_api';

const columns = [
    {key: 'noti_type', label: '구분', width: 80},
    {key: 'title', label: '제목'},
    {key: 'created_at', label: '작성일자', width: 100}
]

const NoticePage = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [tableState, setTableState] = useState({
        perPage: 10,
        page: 1,
        total: 0,
    });

    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        refreshPage(tableState);
    }, []);

    const refreshPage = (state) => {
        GetNotices(state).then(res => {
            const { total, notices } = res.data;
            setTableState({...state, total: Math.ceil(total/tableState.perPage)});

            let _notices = notices.map((notice, index) => {
                return {
                    ...notice,
                    noti_type: <span className={`op-badge ${notice.type === 'NOTICE' ? 'purple' : ''}`}>{getNoticeType(notice.type)}</span>,
                    created_at: notice.created_at.slice(0, 10),
                }
            })  

            setData(_notices);
        })
    }

    const handleChangeTable = (state) => {
        const _state = {...tableState, ...state};
        setTableState(_state);
        refreshPage(_state);
    }

    const handleClickRow = (row) => {
        history.push(`/notice/${row.id}`);
    }

    return (
        <div className="faq-page">
            <div className="section-container">
                <div className="max-w-768 m-auto">
                    <div className="heading text-center my-5 border-b-3">
                        <h2 className="text-ttnorm-bd py-3 font-weight-bold">NOTICE</h2>
                        <p className="color-400">공지사항입니다</p>
                    </div>

                    {selected ?
                        <div>
                            <div className="d-flex align-items-center border-y">
                                <div className="p-12" style={{width: 100}}>
                                    <span className={`op-badge ${selected.type === 'NOTICE' ? 'purple' : ''}`}>{getNoticeType(selected.type)}</span>
                                </div>
                                <div className="p-12 flex-grow-1">{selected.title}</div>
                                <div className="p-12" style={{width: 124}}>{selected.created_at.slice(0, 10)}</div>
                            </div>
                            <div className="p-12 border-b html-content" dangerouslySetInnerHTML={{__html: selected.content || ''}}></div>
                            <Row className="mx-0 my-5 d-flex justify-content-center">
                                <Col sm={6} className="pl-0 pr-2">
                                    <Button label="목록" className="btn-color-gray flex-grow-1" onClick={() => setSelected(null)}/>
                                </Col>
                            </Row>
                        </div>
                        :
                        <div className="mb-5">
                            <Table
                                className="dark header-center"
                                data={data}
                                columns={columns}
                                tableState={tableState}
                                onChange={handleChangeTable}
                                onRowClick={handleClickRow}
                            />
                        </div>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default NoticePage;