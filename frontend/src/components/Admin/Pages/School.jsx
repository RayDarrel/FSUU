import axios from 'axios';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import React, { useEffect, useState } from 'react'
import DataTable, { createTheme, Media } from 'react-data-table-component';
import { Link } from 'react-router-dom';

function School() {



    const [year, setyear] = useState([])
    const [thesis, setthesis] = useState([])

    useEffect(() => {
        axios.get(`/api/SchoolYear`).then(res => {
            if (res.data.status === 200) {
                setyear(res.data.Year);

            }
        });
    }, []);

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
            name: "School Year",
            selector: row => row.school_year,
            sortable: true,
        },
        {
            name: "Number of Accounts",
            selector: row => row.total,
            sortable: true,
            hide: Media.MD,
        },
        {
            name: "Action",
            cell: row => <Link to={`/admin/yeardetails/refid=${row.id}`}><Badge value={"Details"} severity="info"></Badge></Link>,
            sortable: true,
        },
    ]

    return (
        <div>

            <Panel>
                <DataTable
                    title="School Year Details"
                    columns={column}
                    data={year}
                    selectableRows
                    pagination
                    theme='solarized'
                />
            </Panel>
        </div>
    )
}

export default School