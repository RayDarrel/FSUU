import axios from 'axios';
import { Badge } from 'primereact';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import DataTable, {createTheme} from 'react-data-table-component';
import { Link } from 'react-router-dom';

function Status() {

    const [AccessData, setAccess] = useState([]);

    createTheme('solarized', {
        text: {

            // text row color
            primary: '#424242',
            // footer text color
            secondary: '#2aa198',
        },
        background: {
            // background Datable
            default: 'transparent',
        },
        context: {

            // contect background color
            background: '#24262e',
            text: '#FFFFFF',
        },
        divider: {

            // Lines 
            default: '#BBBBBB',
        },
        action: {
            button: 'rgba(0,0,0,.54)',
            hover: 'rgba(0,0,0,.08)',
            disabled: 'rgba(0,0,0,.12)',
        },
    }, 'dark');

    useEffect(() => {
        const id = localStorage.getItem("auth_id");
        axios.get(`/api/AccessLink/${id}`).then(res => {
            if(res.data.status === 200){
                setAccess(res.data.record)
            }
        }).catch((error) => {
            if (error.response.status === 500) {

            }
        })
    }, []);

    const column = [
        {
            name: "Title",
            selector: row => row.title,
        },
        {
            name: "BarCode",
            selector: row => row.reference_code,
        },
        {
            name: "Action",
            selector: row => <Link to={`/student/document/access_key=${row.uniq_key}`}><Badge value="Open" severity='info'></Badge></Link>
        },
    ];

    return (
        <div>
            <DataTable 
                title="Book Data"
                columns={column}
                data={AccessData}
                pagination
                selectableRows
                theme='solarized'
            />
        </div>
    )
}

export default Status