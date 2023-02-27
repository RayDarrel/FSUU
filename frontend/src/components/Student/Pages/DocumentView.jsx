import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'

function DocumentView(props) {

    const [Details, setdetails] = useState([]);

    useEffect(() =>{
        const id = props.match.params.id;

        axios.get(`/api/DocumentDetails/${id}`).then( res =>{
            if(res.data.status === 200){

            }
        }).catch((error) =>{
            if(error.response.status === 500){

            }
        })

    },[props.match.params.id])

    return (
        <div>DocumentView</div>
    )
}

export default DocumentView