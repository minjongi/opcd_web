import React, {useEffect, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';

import { Button, RadioBox, TextInput, CheckBox } from '../../../components/form';
import { Table } from '../../../components';
import { FormFactory } from '../../../components/formBuilder';

import { GetApplicants, GetApplicant } from '../../../store/camp/user_api';

const defaultTableSetting = {
    page: 1,
    total: 0,
    sort: '',
    sortDir: ''
};

const columns = [
    {key: 'id', label: 'No.'},
    {key: 'applicant_id', label: '접수번호'},
    {key: 'campaign_name', label: '신청항목'},
    {key: 'user_name', label: '신청자'},
]

const TableView = ({userInfo, campaign, onSelect}) => {
    const perPage = 10;
    const type = 'WMM';
    const [tableState, setTableState] = useState(defaultTableSetting);

    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        setTableState(defaultTableSetting);
        getData(defaultTableSetting);
    }, [campaign.id]);

    const getData = (state) => {
        GetApplicants({...state, campaign_id: campaign.id, perPage, type}).then(res => {
            const {total, applicants} = res.data;
            setTableState({...state, total: Math.ceil(total/perPage)});

            let _applicants = applicants.map((applicant, index) => {
                return {
                    ...applicant,
                    campaign_name: applicant.campaign ? applicant.campaign.name : '',
                    user_name: getUserName(applicant)
                }
            })  

            setData(_applicants);

        }).catch(err => {
            setSubmitting(false);
            console.log(err);
        })
    }

    const getUserName = (applicant) => {
        if(!applicant.user || !applicant.user.name) return '';
        
        if(applicant.security === 'PRIVATE') return "비공개";

        let user_name = applicant.user.name;
        return user_name.slice(0, 1) + '*' + user_name.slice(-1);
    }

    const handleChangeTable = (state) => {
        const _state = {...tableState, ...state};
        setTableState(_state);
        getData(_state);
    }

    const handleClickRow = (row) => {
        if(!row || !row.user_id) return;
        if(userInfo.id === row.user_id) onSelect(row);
        else setSelected(row);
    }

    return (
        <>
            <Table
                className="dark"
                data={data}
                columns={columns}
                tableState={tableState}
                onChange={handleChangeTable}
                onRowClick={handleClickRow}
            />

            {selected && 

                <SweetAlert
                    info
                    title=""
                    confirmBtnText="확인"
                    confirmBtnBsStyle="info"
                    onConfirm={() => setSelected(null)}
                    customClass="text-info"
                    style={{top: window && window.scrollY ? window.scrollY /2 : 0}}
                >
                    본인 신청내역만 확인 가능합니다.
                </SweetAlert>
            }
        </>
    )
}

const DetailView = ({userInfo, applicant, onReturn}) => {
    if(!userInfo || !applicant) return null;
    
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        GetApplicant(applicant.id).then(res => {
            const { applicant } = res.data;
            if(!applicant || !applicant.applicant_content) onReturn();
            else setFormData(JSON.parse(applicant.applicant_content));
        }).catch(err => {
            console.log(err);
        })
    }, [applicant.id]);

    return (
        <form>
            <label className="font-14 mt-4">접수번호</label>
            <TextInput className="dark readOnly" id="date" name="date" value={applicant.applicant_id} readOnly/>

            <label className="font-14 mt-4">신청내역공개여부</label>
            <RadioBox label={applicant.security === "PUBLIC" ? "공개" : "비공개"} className="font-14 mr-4" name="security" checked={true}/>

            <label className="font-14 mt-4">신청자정보</label>
            <Row>
                <Col sm={6}>
                    <TextInput className="dark readOnly" id="email" name="email" value={userInfo.email} readOnly/>
                </Col>
                <Col sm={6}>
                    <TextInput className="dark readOnly" id="phone" name="phone" value={userInfo.phone} readOnly/>
                </Col>
                <Col sm={6}>
                    <TextInput className="dark readOnly" id="name" name="name" value={userInfo.name} readOnly/>
                </Col>
                <Col sm={6}>
                    <TextInput className="dark readOnly" id="surname" name="surname" value={userInfo.artist_name} readOnly/>
                </Col>
            </Row>

            {formData && formData.map((f, index) =>
                <FormFactory
                    key={index}
                    id={`item_${index}`}
                    field={f}
                    disabled
                />
            )}
        </form>
    )
}

const SongCampView = ({tab, userInfo, campaign , onSubmit}) => {
    const [selected, setSelected] = useState(null);

    return (
        <div className="songcamp-sumit">
            <h3 className={`text-center py-3 ${selected && 'border-b-2-white'}`}>{`[${campaign.name}] 참가신청`}</h3>

            {selected ?
                <DetailView userInfo={userInfo} applicant={selected}/>
                :
                <TableView userInfo={userInfo} campaign={campaign} onSelect={(row) => setSelected(row)}/>
            }

            <Row className="mx-0 mt-5 d-flex justify-content-center">
                <Col sm={6} className="pl-0 pr-2">
                    <Button label="돌아가기"
                        className="btn-color-gray flex-grow-1"
                        onClick={() => selected ? setSelected(null) : onSubmit('RETURN')}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default SongCampView;