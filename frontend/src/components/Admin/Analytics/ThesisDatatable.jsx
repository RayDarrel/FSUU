import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import DataTable, { createTheme } from 'react-data-table-component'

function ThesisDatatable({id}) {

    const [AccountsTotal, setTotal] = useState([]);

    useEffect(() => {
        axios.post(`/api/AnalyticsDocuments/${id}`).then((res) => {
            if (res.data.status === 200) {
                setTotal(res.data.DocumentsTotal);
            }
        }).catch((error) => {
            if (error.response.status === 500) {
            }
        });
    }, []);

    console.log(AccountsTotal)


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

    const column = [
        {
            name: "Department Code",
            selector: (row) => row.department_code,
        },
        {
            name: "Total Document",
            selector: (row) => row.totaldocuments,
        },
    ];

    return (
        <div>
            {(AccountsTotal === "No Data") ? "No Data To Display" : <DataTable
                // title=" "
                columns={column}
                data={AccountsTotal}
                theme='solarized'   
                pagination
            />}
        </div>
    )
}

export default ThesisDatatable