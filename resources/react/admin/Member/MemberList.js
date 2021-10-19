import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Table, SearchBar, CircleFullSpinner } from '../../components';
import { Button } from '../../components/form';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';

import { GetMembers, DeleteMember, UpdateMemberStatus } from '../../store/member/api';

const columns = [
    {key: 'num', label: 'No.', width: 70},
    {key: 'name', label: '이름', sort: true, searchable: true},
    {key: 'artist_name', label: '아티스트명', sort: true, searchable: true},
    {key: 'email', label: '이메일', sort: true, searchable: true},
    {key: 'birthday', label: '생년월일', sort: true, searchable: true},
    {key: 'phone', label: '폰 번호', sort: true, searchable: true},
    {key: 'address', label: '주소', sort: true, searchable: true},
    {key: 'status', label: '상태', sort: true},
    {key: 'action', label: '', width: 208}
]

const MemberList = () => {
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
        
        GetMembers({...state}).then(res => {
            setSubmitting(false);
            
            const {total, users} = res.data;
            setTableState({...state, totalCount: total, total: Math.ceil(total/tableState.perPage)});

            let _members = users.map((member, index) => {
                return {
                    ...member,
                    num: total - index - (state.page - 1)*state.perPage,
                    name: <Link to={`/admin/member_detail/${member.id}`} className="text-decoration-underline cursor-pointer">
                                        {member.name}
                                  </Link>,
                    status: member.status === 'ACTIVED' ? 
                            <span className="color-success font-weight-bold">확인</span>
                            :
                            <span className="color-warning font-weight-bold">대기</span>,
                    action: (
                        <>
                            <Button
                                label="상태변화"
                                className="btn-color-warning d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => handleChangeStatus(member)}/>
                            <Button
                                label="수정"
                                className="btn-color-info d-inline-block mr-2 px-2 py-0 rounded"
                                onClick={() => handleGoToDetail(member)}/>
                            <Button
                                label="삭제"
                                className="btn-color-error d-inline-block px-2 py-0 rounded"
                                onClick={() => setSelectedId(member.id)}/>
                        </>
                    )
                }
            })  

            setData(_members);

        }).catch(err => {
            setSubmitting(false);
            console.log(err);
        })
    }

    const handleDeleteFeature = () => {
        if(submitting) return;
        setSubmitting(true);

        DeleteMember(selectedId).then(res => {
            setSubmitting(false);
            setSelectedId(null);
            toast.success("콘텐츠가 삭제되였습니다.");
            getData(tableState);
        }).catch(err => {
            setSubmitting(false);
        })
    }

    const handleGoToDetail = (item) => {
        if(item) history.push(`/admin/member/${item.id}`)
        else history.push(`/admin/member`)
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

    const handleChangeStatus = (member) => {
        UpdateMemberStatus(member.id, {status: member.status === 'ACTIVED' ? 'DISABLED' : 'ACTIVED'})
        .then(res => {
            getData(tableState);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            {submitting && <CircleFullSpinner size="full"/>}
            <h4 className="mb-5">회원 목록</h4>
            
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
                    삭제된 회원은 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default MemberList;