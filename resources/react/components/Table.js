import React from 'react';
import { Table as BSTable } from 'react-bootstrap';
import { Pagination } from '../components';


const Table  = ({columns, data, tableState, checkbox, onChange, onRowClick, className, onChangeSelection, onChangeAllSection}) => {

    const handleSort = (head) => {
        if(!tableState || !head.sort) return;

        let sortDir = head.key === tableState.sort ? tableState.sortDir : '';
        
        if(!sortDir) sortDir = 'desc';
        else if(sortDir === 'desc') sortDir = 'asc';
        else sortDir = '';

        onChange && onChange({sort: sortDir ? head.key : '', sortDir});
    }

    const handleChangePage = (page) => {
        if(!tableState || page === tableState.page) return;
        onChange && onChange({page});
    }

    const handleChangeCheck = (index) => {
        onChangeSelection && onChangeSelection(data[index]);
    }

    const handleChangeAllCheck = (e) => {
        const { checked } = e.target;

        let checkboxes = document.querySelectorAll('.op-table input[type=checkbox]');
        checkboxes.forEach(el => {
            el.checked = checked;
        });

        onChangeAllSection && onChangeAllSection(checked);
    }

    return (
        <>
            <BSTable hover className={`op-table outline ${className}`}>
                <thead>
                    <tr>
                        {checkbox && 
                            <th style={{width: 50}}>
                                <input type="checkbox" onChange={handleChangeAllCheck}/>
                            </th>
                        }
                        {columns.map((col, index) => 
                            <th
                                key={index}
                                data-key={col.key}
                                className={`
                                    ${col.sort ? 'sortable' : ''} 
                                    ${col.sort && tableState && tableState.sort === col.key ? tableState.sortDir : ''}
                                `}
                                onClick={() => handleSort(col)}
                                style={{
                                    width: col.width ? `${col.width}px` : 'auto',
                                    minWidth: col.minWidth ? `${col.minWidth}px` : 'unset'
                                }}
                            >
                                {col.label}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data && !!data.length ? data.map((row, rIndex) => 
                        <tr key={`row_${rIndex}`} onClick={() => onRowClick && onRowClick(row)}>
                            {checkbox && <td><input type="checkbox" onChange={() => handleChangeCheck(rIndex)}/></td>}
                            {columns.map((col, cIndex) =>
                                <td key={`col_${cIndex}`}>{row[col.key]}</td>
                            )}
                        </tr>
                    ) : 
                        <tr>
                            <td className="text-center color-400" colSpan={columns.length}>자료가 없습니다</td>
                        </tr>
                    }
                </tbody>
            </BSTable> 

            {tableState &&
                <Pagination
                    variant={className && className.indexOf('dark') > -1 ? 'dark' : "light"}
                    className="mt-5"
                    total={ tableState.total || 0 }
                    current={tableState.page || 0}
                    onChangePage={handleChangePage}
                />
            }
        </>
    )
}

export default Table;
