import React, { useEffect, useState } from 'react';

import { Card, Accordion } from 'react-bootstrap';
import { SearchBar } from '../../components';

import { GetFaqs } from '../../store/faq/user_api';

const FaqPage = () => {
    const [activePanel, setActivePanel] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        refreshPage({search});
    }, []);

    const refreshPage = (payload) => {
        setLoading(true);
        GetFaqs(payload).then(res => {
            const { faqs } = res.data;
            setData(faqs || []);
        })
    }

    const handleSearch = (text) => {
        setSearch(text);
        refreshPage({search: text});
    }

    return (
        <div className="faq-page">
            <div className="section-container">
                <div className="max-w-768 m-auto">
                    <div className="heading text-center my-5 border-b-3">
                        <h2 className="text-ttnorm-bd py-3 font-weight-bold">FAQ</h2>
                        <p className="color-400">질문을 검색 해보세요.</p>
                        <SearchBar value={search} onChange={handleSearch} className="mx-auto w-100 max-w-500 my-4"/>
                    </div>

                    <div className="op-accordion-container mb-5">
                        <Accordion defaultActiveKey={activePanel} activeKey={activePanel}>
                            {data.length && data.map((q, index) => 
                                <Card key={index}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey={q.id}
                                        className={`cursor-pointer ${activePanel === q.id ? 'active' : ''}`}
                                        onClick={() => activePanel === q.id ? setActivePanel('') : setActivePanel(q.id)}
                                    >
                                        <div className="content">
                                            <div className="content-type">Q</div>
                                            <div className="content-text">{q.question}</div>
                                        </div>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={q.id}>
                                        <Card.Body>
                                            <div className="content">
                                                <div className="content-type">A</div>
                                                <div className="content-text html-content" dangerouslySetInnerHTML={{__html: q.answer}}/>
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            )}
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FaqPage;