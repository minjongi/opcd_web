import React, { useEffect, useState } from 'react';

import { LayerPopup } from '../../../components';
import { GetPuzzleBanners } from '../../../store/wmm/user_api';

const WmmPuzzle = ({display}) => {
    const [puzzles, setPuzzles] = useState([]);
    const [layers, setLayers] = useState([]);
    const [selectedLayer, setSelectedLayer] = useState(null);

    useEffect(() => {
        GetPuzzleBanners().then(res => {
            const { puzzles, layers } = res.data;
            const _puzzles = puzzles.filter(p => p.display === display);
            setPuzzles(_puzzles);
            setLayers(layers);
        })
    }, []);

    const handleOpenPopup = (item) => {
        const layer = layers.find(l => Number(l.id) === Number(item.layer_id));
        if(!layer) return;
        setSelectedLayer(layer);
    }

    return (
        <div className="puzzle-gallery">
            <div className={`op-puzzle-gallery-container ${display === 'DESKTOP' ? 'desktop' : 'mobile'}`}>
                <div className="op-puzzle-gallery">
                    {puzzles.map((item, index) => 
                        <div key={index} className={`gallery-item item-${index}`} onClick={() => handleOpenPopup(item)}>
                            {item.base_image && <img className="base-image" src={item.base_image}/>}
                                            
                            {item.type === 'SOON' && item.soon_image && 
                                <div className="overlay-wrapper">
                                    <img src={item.soon_image}/>
                                </div>
                            }

                            {item.type === 'LIVE' && item.live_image && 
                                <div className="overlay-wrapper">
                                    <img src={item.live_image}/>
                                </div>
                            }
                        </div>
                    )}
                    
                </div>
            </div>

            {selectedLayer &&
                <LayerPopup layer={selectedLayer} contents={selectedLayer.content} onClose={() => setSelectedLayer(null)}/>
            }
        </div>
    )
}

export default WmmPuzzle;