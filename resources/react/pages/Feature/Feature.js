import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';

import { FeatureGallery, Pagination, CircleFullSpinner } from '../../components';
import { FeatureGalleryCard } from '../../components/cards';
import { FeatureCard } from '../../components/cards';
import { Button } from '../../components/form';
import { GetFeatures } from '../../store/feature/api';

const Feature = () => {
    const params = useParams();
    const [pageTitle, setPageTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadable, setLoadable] = useState(true);
    const [data, setData] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        perPage: 9,
        page: 1,
        total: 0,
        type: params && params.type ? params.type.toUpperCase() : ''
    });

    useEffect(() => {
        getData(pageInfo);
    }, []);

    useEffect(() => {
        if(params.type === pageInfo.type) return;
        setLoadable(true);
        const _pageInfo = {...pageInfo, page: 1, type: params.type};
        getData(_pageInfo);
    }, [params]);

    const getData = (params, isMobile = false) => {
        setPageTitle(params.type ? params.type.toUpperCase() : '');
        setLoading(true);

        GetFeatures(params).then(res => {
            const { total, features } = res.data;
            setLoading(false);
            setPageInfo({...params, total: Math.ceil(total/pageInfo.perPage)});
            if(features.length < pageInfo.perPage) setLoadable(false);
            if(isMobile){
                setData([...data, ...features]);
            }else{
                setData(features);
                window && window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }).catch(err => {
            setLoading(false);
            console.log(err);
        })
    }

    const handleChangePage = (page) => {
        const _pageInfo = {...pageInfo, page};
        getData(_pageInfo);
    }

    const handleMore = () => {
        if(pageInfo.total === pageInfo.page) return;
        const _pageInfo = {...pageInfo, page: pageInfo.page + 1};
        getData(_pageInfo, true);
    }

    return (
        <div id="page-feature" className="pt-5 mb-50p">
            {loading && <CircleFullSpinner size="full"/>}
            <div className="section-container">
                <h2 className="text-center font-weight-bold text-ttnorm-bd mb-4">{pageTitle || 'MAGAZINE'}</h2>

                <div>
                    <Row className="space-10">
                        {data.map((d, index) => 
                            <Col key={index} xs={12} sm={4} className="col mb-40p">
                                <FeatureCard data={d}/>
                            </Col>
                        )}
                    </Row>

                    {(!loading && loadable) && <Button label="MORE" className="btn-outline hovered more_btn" onClick={handleMore}/>}
                </div>
            </div>
        </div>
    )
}

export default Feature;
