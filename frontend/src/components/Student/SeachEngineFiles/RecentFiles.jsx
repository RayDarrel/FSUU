import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import swal from 'sweetalert';
import Paginate from './Paginate';
import PaginateRecent from './PaginateRecent';

function RecentFiles(year) {

    const [loading , setloading] = useState([]);
    const [SearchAgain, setsearchAgain] = useState([]);

    useEffect(() =>{
        const data = {
            keyword: localStorage.getItem('keyword'),
        }
        axios.post(`/api/MostRecentFiles`,data).then(res => {
            if (res.data.status === 200) {
                setsearchAgain(res.data.ResultsOutput)
            }
            else if (res.data.status === 404) {
                swal("Error", res.data.error, 'error');
            }
            setloading(false)
        });
    },[])

    return (
        <div>
            <PaginateRecent data={SearchAgain} />
        </div>
    )
}

export default RecentFiles