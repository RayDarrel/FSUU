import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';

function Pagination(props) {

 
    const { data } = props;
    const [currentItems, setCurrentItems] = useState([])
    const [loading ,setloading] = useState(true)
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 4;
    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(data.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(data.length / itemsPerPage));
      
    }, [itemOffset, itemsPerPage, data])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % data.length;
        setItemOffset(newOffset);
    };

    return (
        <>
            {
                currentItems.map((title, id) => {
                    return (
                        <div key={id} className="mb-3">
                            <ul>
                                <li className='text-color-code mb-3 list-result'>
                                    <Link to={`/admin/document/refid=${title.uniq_key}`}><span className='text-details-title'>{title.title}</span></Link>
                                </li>
                                <li className='text-color-code mb-3 list-result'>
                                    <span><b>Keywords</b>: {title.keywords}</span>
                                </li>
                                <li className='text-color-code mb-3 list-result'>
                                    <span><b>Year Published: </b>{title.Year_Published}</span>
                                </li>
                                <li className='text-color-code mb-3 list-result'>
                                    <span> <b>Abstract</b>: <p className='text-details'>
                                    {title.description.slice(0, 300)}...    
                                    </p></span>
                                </li>
                            </ul>
                            <Divider></Divider>
                        </div>
                    )
                })
            }


            <ReactPaginate
                breakLabel="..."
                nextLabel="Next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="Previous"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName='page-num'
                previousLinkClassName='page-num'
                nextLinkClassName='page-num'
                activeLinkClassName='active'
            />
        </>
    )
}

export default Pagination