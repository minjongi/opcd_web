import React, { useEffect, useState } from 'react';

import WmmPuzzle from './WmmPuzzle';
import ArtistGallery from './ArtistGallery';
import HistorySlider from './HistorySlider';
import { Button } from '../../../components/form';
import { Icon } from '../../../components';

import { GetContents } from '../../../store/wmm/user_api';
import { artistData } from '../mockData';

const History = () => {
    const [samplePacks, setSamplePacks] = useState([]);
    const [contests, setContests] = useState([]);
    const [contents, setContents] = useState([]);

    useEffect(() => {
        GetContents().then(res => {
            const { sample_packs, contests, contents } = res.data;
            setSamplePacks(sample_packs);
            setContests(contests);
            setContents(contents);
        })
    }, []);

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div id="page-history" className="pt-5 mb-50p">
            <div className="section-container">
                
                <div className="d-none d-sm-block mt-5">
                    <WmmPuzzle display="DESKTOP"/>
                </div>
                <div className="d-sm-none mt-5">
                    <WmmPuzzle display="MOBILE"/>
                </div>

                {/* <img className="w-100 h-auto" src="/images/wmm_banner.png"/> */}

                <div className="section about-content-section pt-3 mt-5">
                    <h2 className="section-title text-ttnorm-bd">About</h2>
                    <div className="mark-text text-italic text-center font-weight-bold center-purple-line">' WE MAKE MUSIC '</div>
                    <p className="color-purple-light" style={{maxWidth: 470, margin: 'auto'}}>
                        WMM은 단순히 스타만을 발굴하는 오디션이 아닌 음악가의 창작 활동을 지원하는 오디션 브랜드입니다.
                    </p>
                    <hr className="border-b w-5-rem my-5"/>
                    <h4 className="font-weight-bold mb-4">
                        “WMM 2020 : Beat Covid-19 Contest & Sample pack”
                    </h4>
                    <span>2020년 10월 코로나로 지친 음악 창작인을 위해 </span>
                    <span className="mb-4">호스트 뮤지션 5팀이 본인의 프로덕션 경험을 담은 SAMPLE PACK을 공개! </span>
                    
                    <span>동시에 창작 콘테스트를 통해 호스트별 각 2팀 씩 총 10팀을 선정 </span>
                    <span>싱글 발매 및 PV제작, 프로필 촬영 등 아티스트 프로모션을 지원하는 프로젝트</span>
                </div>

                <div className="section">
                    <h2 className="section-title text-ttnorm-bd">Host</h2>
                    <ArtistGallery data={artistData}/>
                </div>

                <div className="section text-center">
                    <h2 className="section-title text-ttnorm-bd">Sample Pack</h2>
                    <p>더콰이엇 - Beautiful Life, Jinbo의 해변으로 가요 remix</p>
                    <p>선우정아의 봄처녀, KIRIN & YUNU의 Pump Up The Yunu, 창모의 METEOR 등</p>
                    <p className="mb-3">주옥같은 명곡들의 스템 파일이 공개되어 창작자들 사이에서 큰 화제가 되었습니다.</p>
                    <p>WMM 호스트의 창작 스토리를 비롯한 인터뷰와 SAMPLE PACK 제작의 비하인드를 확인해보세요!</p>
                    <div className="py-5">
                        <HistorySlider data={samplePacks}/>
                    </div>
                </div>

                <div className="section text-center">
                    <h2 className="section-title text-ttnorm-bd">Contest</h2>
                    <p>샘플팩 이벤트와 동시에 숨은 음악 고수를 찾기 위한 콘테스트가 열렸습니다.</p>
                    <p>호스트 뮤지션이 선정한 뮤지션 10팀은 누구일까요?</p>
                    <div className="py-5">
                        <HistorySlider data={contests}/>
                    </div>
                </div>

                <div className="section text-center">
                    <h2 className="section-title text-ttnorm-bd">Contents</h2>
                    <p>이번 WMM 2020에는 청소년 뮤지션의 지원 열기도 뜨거웠습니다.</p>
                    <p>그렇다면 팔로알토, 더콰이엇, 이영지의 청소년 시절은 과연 어땠을까요?</p>
                    <p>청소년 뮤지션들과의 고민과 호스트의 명쾌한 해답을 영상을 통해 확인하세요!</p>
                    <div className="py-5">
                        <HistorySlider data={contents}/>
                    </div>
                </div>

                <div className="winner-confirm d-flex bg-white text-primary mb-5" style={{padding: 1}}>
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center py-3 px-2">
                        <img src="/images/king_01.png" style={{marginTop: -12, marginRight: 16, height: 24}}/>
                        <h3><strong>WMM2020 우승자</strong>의 <strong>인터뷰를 확인</strong> 하세요!</h3>
                    </div>
                    <div className="d-none d-md-block">
                        <Button 
                            className="h-100 w-10-rem d-flex justify-content-center align-items-center btn-color-primary"
                            label={
                                <span><strong>TOP</strong>&nbsp;&nbsp;<Icon name="caretUp"/></span>
                            }
                            onClick={() => handleScrollTop()}
                        />
                    </div>
                </div>

                <div className="d-md-none">
                    <Button 
                        className="py-3 w-10-rem d-flex justify-content-center align-items-center btn-outline m-auto"
                        label={
                            <span><strong>TOP</strong>&nbsp;&nbsp;<Icon name="caretUp"/></span>
                        }
                        onClick={() => handleScrollTop()}
                    />
                </div>
            </div>
            
        </div>
    )
}

export default History;