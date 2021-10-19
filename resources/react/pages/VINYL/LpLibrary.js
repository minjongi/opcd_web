import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PerfectScrollBar from 'react-perfect-scrollbar';
import {
    Row,
    Col
} from 'react-bootstrap';
import { CircleFullSpinner, Pagination, Icon } from '../../components';
import { LibCard } from '../../components/cards';
import { Button } from '../../components/form';

import { GetCategorNames, GetContents } from '../../store/lib/user_api';

const LpLibrary = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState(null);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [pageState, setPageState] = useState({
        perPage: 12,
        page: 1,
        total: 0,
        category: '',
        search: ''
    });

    useEffect(() => {
        GetCategorNames().then(res => {
            const { names } = res.data;
            if(names && names.length){
                setCategories(names);
                const _pageState = {...pageState};
                setPageState(_pageState);
                getData(_pageState);
            }
        });
    }, []);

    const getData = (state, isMobile = false) => {
        setLoading(true);

        GetContents(state).then(res => {
            setLoading(false);
            const { contents, actived, total } = res.data;
            setPageState({...state, total: Math.ceil(total/state.perPage)});
            setSelected(actived || null);
            if(isMobile){
                setData([...data, ...contents]);
            }else{
                setData(contents);
                window && window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }).catch(err => {
            setLoading(false);
        });
    }

    const handleChangeCategory = (id) => {
        const _pageState = {...pageState, category: id};
        getData(_pageState);
    }

    const handleSearch = (e) => {
        const { value } = e.target;
        setPageState({...pageState, search: value});
    }

    const handleChangePage = (page) => {
        const _pageState = {...pageState, page};
        getData(_pageState);
    }

    const handleMore = () => {
        if(pageState.total === pageState.page) return;
        const _pageState = {...pageState, page: pageState.page + 1};
        getData(_pageState, true);
    }

    const handleGoDetail = (content) => {
        history.push('/vinyl_library_detail/' + content.id);
    }

    const handleKeyPress = (e) => {
        if(e.charCode === 13) searchData();
    }

    const searchData = () => {
        getData(pageState);
    }

    return (
        <div id="page-lplibrary"  className="pt-5">
            {loading && <CircleFullSpinner size="full"/>}
            <div className="section-container">
                <h2 className="text-center font-weight-bold text-ttnorm-bd mb-4">LP LIBRARY</h2>

                {selected && 
                    <div className="border-b">
                        <div className="selected-card max-w-300 m-auto text-center">
                            <LibCard data={selected} />
                        </div>
                    </div>
                }

                <div className="search-box">
                    <div className="input-wrapper">
                        <input type="text" placeholder="검색어 입력" value={pageState.search} onChange={handleSearch} onKeyPress={handleKeyPress}/>
                        <span className="search-icon" onClick={searchData}>
                            <Icon className="right-icon" name={'search'}/>
                        </span>
                    </div>
                    <button className="search-button" onClick={searchData}>검색</button>
                </div>

                <div className="py-2">
                    <PerfectScrollBar>
                        <div className="op-navs my-3">
                            <span className={`op-nav-item ${!pageState.category ? 'active' : ''}`} onClick={() => handleChangeCategory('')}>전체</span>
                            {!!categories?.length && <span className="op-nav-divider">ㅣ</span>}
                            {categories && categories.map((cat, index) => 
                                <React.Fragment key={index}>
                                    <span className={`op-nav-item ${pageState.category === cat.id ? 'active' : ''}`} onClick={() => handleChangeCategory(cat.id)}>{cat.name}</span>
                                    {categories.length - 1 > index && <span className="op-nav-divider">ㅣ</span>}
                                </React.Fragment>
                            )}
                        </div>
                    </PerfectScrollBar>
                </div>
                
                <Row className="lp-library-gallery">
                    {!!data?.length ? data.map((content, index) => 
                        <Col key={index} xs={6} md={3}>
                            <LibCard data={content} onClick={() => handleGoDetail(content)}/>
                        </Col>
                    ) : 
                        <div style={{width: '100%', textAlign: 'center', padding: '60px 20px'}}>
                            검색 결과가 없습니다.
                        </div>
                    }
                </Row>
            
                {!!data?.length &&
                    <div className="d-xs-none"> 
                        <Pagination
                            className="py-5"
                            total={pageState.total}
                            current={pageState.page}
                            perPage={pageState.perPage}
                            onChangePage={handleChangePage}
                        />
                    </div>
                }

                <div className="d-block d-sm-none">
                    <Button label="더보기" className="btn-outline my-4" onClick={handleMore}/>
                </div>
            </div>
        </div>
    )
}

export default LpLibrary;