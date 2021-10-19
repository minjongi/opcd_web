import React from 'react';

import { Button } from '../../components/form';

const About = () => {
    return (
        <div className="page-about pt-5 mb-50p">
            <div className="section-container">
                <div>
                    <video src="/videos/brand_1.mp4" controls style={{width: '100%'}}/>
                </div>
                
                <div className="text-center border-b-light py-5 mb-5">
                    <p className="m-0 text-break-keep">OPCD(오픈창동)은 서울시와 도봉구의 아티스트 지원기관입니다.</p>
                    <div className="text-break-keep">
                        <span className="m-0 d-sm-block">OPCD는 도봉구 창동을 한국의 음악 중심지로 만들기 위해 아티스트를 대상으로</span>
                        <span className="m-0 d-sm-block">영상, 음향, 유통, 공연 등 음악관련 전문적인 서비스를 제공합니다.</span>
                    </div>
                </div>

                <div>
                    <video src="/videos/brand_2.mp4" controls style={{width: '100%'}}/>
                </div>

                <div className="text-center py-5">
                    <h6>안내/문의 연락처</h6>
                    <h2>02-944-7525</h2>
                </div>

                <div className="d-flex justify-content-center">
                    <a className="w-100 max-w-500 text-decoration-none" onClick={() => alert('준비중입니다')}>
                        <Button label="스튜디오 예약" className="btn-color-purple"/>
                    </a>
                </div>
            </div>
            
            
        </div>
    )
}

export default About;