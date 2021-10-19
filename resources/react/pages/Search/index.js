import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { CircleFullSpinner } from '../../components';
import EmptyView from './EmptyView';
import EventSection from './EventSection';
import VideoSection from './VideoSection';
import FeatureSection from './FeatureSection';
import ArtistSection from './ArtistSection';
import HistorySection from './HistorySection';
import CampaignSection from './CampaignSection';
import LibrarySection from './LibrarySection';

import { decodeStr, findSearchParam } from '../../helpers/utils';
import { SearchSite } from '../../store/main/user_api';

const Search = () => {
    const location = useLocation();

    const [searching, setSearching] = useState(false);
    const [search, setSearch] = useState('');
    const [result, setResult] = useState(null);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        if(!location.search) return;
        
        let _search = findSearchParam('kword', location.search);
        _search = decodeStr(_search || '');
        setSearch(_search);

        setSearching(true);
        SearchSite(`?text=${_search}`).then(res => {
            setSearching(false);
            updateSearchData(res.data);
        }).catch(err => {
            setSearching(false);
            setResult(null);
            setIsEmpty(true);
        })
    }, [location.search]);

    const updateSearchData = (data) => {
        let _isEmpty = true;
        Object.keys(data).forEach(key => {
            if(key !== 'status' && data[key].length > 0) _isEmpty = false;
        });
        setResult(data);
        setIsEmpty(_isEmpty);
        window && window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="search-page">
            <div className="section-container">
                <div className="heading text-center my-5 py-3 border-b-3">
                    {search && <h2 className="d-block d-md-inline font-weight-bold mx-3">'{search || ''}'</h2>}
                    <h2 className="d-block d-md-inline text-kr-bd font-weight-bold">검색결과</h2>
                </div>
                
                <div className="min-h-300">
                    {searching && <CircleFullSpinner />}
                    {!searching && isEmpty && <EmptyView />}
                    {result && 
                        <div className="section-list">
                            {/* <EventSection title="EVENT" data={result.events} search={search}/> */}
                            <EventSection title="EVENT" data={result.events}/>
                            <FeatureSection title="MAGAZINE" data={result.features} />
                            <VideoSection title="VIDEO" data={result.videos}/>
                            <ArtistSection title="ARTIST PROFILE" data={result.artists} />
                            <HistorySection title="WMM HISTORY" data={result.history}/>
                            <CampaignSection title="WMM SONGCAMP" type="wmm" data={result.songcamps} />
                            <CampaignSection title="BEATBOX PROGRAM" type="beatbox" data={result.bb_programs} />
                            <CampaignSection title="VINYL PROGRAM" type="vinyl" data={result.vi_programs} />
                            <LibrarySection title="LP LIBRARY" data={result.libraries} />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Search;