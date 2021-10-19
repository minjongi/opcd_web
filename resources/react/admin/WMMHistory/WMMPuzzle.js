import React, { useState, useEffect } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { PuzzleGallery } from '../../components';
import WMMPuzzleForm from './WMMPuzzleForm';

import { GetPuzzleBanners, DeletePuzzleBanners } from '../../store/wmm/api';

const WMMPuzzle = () => {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        GetPuzzleBanners().then(res => {
            const { banners } = res.data;
            setData(banners);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleDeletePuzzle = () => {
        DeletePuzzleBanners(deleteItem.id).then(res => {
            setDeleteItem(false);
            getData();
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div>
            <h4 className="mb-5">WMM 퍼즐배너</h4>

            <p>PC</p>
            <div className="max-w-1200">
                <PuzzleGallery
                    data={data}
                    display="DESKTOP"
                    editable
                    onEdit={(item) => setSelected(item)}
                    onDelete={(item) => setDeleteItem(item)}/>
            </div>

            <p className="mt-5">Mobile</p>
            <div className="max-w-500">
                <PuzzleGallery
                    data={data}
                    display="MOBILE"
                    editable
                    onEdit={(item) => setSelected(item)}
                    onDelete={(item) => setDeleteItem(item)}/>
            </div>
            
            {selected && 
                <WMMPuzzleForm
                    open={true}
                    puzzle={selected}
                    onClose={() => setSelected(null)}
                    onSuccess={() => {
                        setSelected(null);
                        getData();
                    }}/>
            }

            {deleteItem && 
                <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="확인"
                    confirmBtnBsStyle="danger"
                    cancelBtnText="취소"
                    title="삭제하시겠습니까?"
                    onConfirm={handleDeletePuzzle}
                    onCancel={() => setDeleteItem(null)}
                >
                    삭제된 퍼즐은 회복할수 없습니다.
                </SweetAlert>
            }
        </div>
    )
};

export default WMMPuzzle;