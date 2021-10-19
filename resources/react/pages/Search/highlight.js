import React from 'react';

export const highlightText = (text, highlight) => {
    if(!text) return '';
    if(!highlight) return text;
    
    let _split = text.split(highlight);
    const count = _split.length;
    if(count <= 1) return text;
    
    let _highlighted = [];
    _split.forEach((str, index) => {
        _highlighted.push(<span key={index}>{str}</span>);
        if(index < count -1){
            _highlighted.push(<span key={`highlight_${index}`} className="text-highlight">{highlight}</span>);
        }
    });

    return _highlighted;
}

export const highlightHtml = (text, highlight) => {
    if(!text) return '';
    if(!highlight) return text;
    
    const regex = new RegExp(highlight, 'gi');
    return text.replace(regex, `<mark class="text-highlight">$&</mark>`);
}
