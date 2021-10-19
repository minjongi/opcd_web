import React from 'react';
import Icon from '../Icon';

import { formattedDate } from '../../helpers/utils'

const EventCard = ({data}) => {
    const { title, desc, link, link_target, image, category, start_date, end_date, is_end } = data;

    return (
        <div className="event-card">
            <div className="card-image" style={{backgroundImage: `url(${image})`}}></div>
            <div className={`content-wrapper ${is_end ? 'disabled' : ''}`}>
                <p className="label">{category}&nbsp;</p>
                <p className="content two-line-truncate h-two-line">{title || ''}</p>

                <p className="label text-ttnorm-md">HOST</p>
                <p className="content two-line-truncate h-two-line">{desc || ''}</p>

                <p className="label text-ttnorm-md">DATE</p>
                <p className="date">
                    <span>{formattedDate(start_date, 'yy.mm.dd')}</span>
                    <span className="mx-1">-</span>
                    <span>{formattedDate(end_date, 'yy.mm.dd')}</span>
                </p>
                
                <div>
                    {is_end ?
                        <span className="button disabled">마감완료</span>
                        :
                        <a href={link || ''} target={link_target === 'BLANK' ? '_blank' : ''} className="button">신청하기</a>
                    }
                </div>
            </div>
        </div>
    )
}

export default EventCard;