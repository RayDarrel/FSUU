import axios from 'axios';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react'
import DataTable,{createTheme} from 'react-data-table-component'

function Logs() {

    const [Activity, setLogs] = useState([]);

    useEffect(() => {
        const id = localStorage.getItem('auth_id');
        axios.get(`/api/AdminLogs/${id}`).then(res => {
            if (res.data.status === 200) {
                setLogs(res.data.AccountLogs);
            }
        });
    },[]);

    createTheme('solarized', {
        text: {

            // text row color
            primary: '#424242',
            // footer text color
            secondary: 'gray',
        },
        background: {
            // background Datable
            default: 'transparent',
        },
        context: {

            // contect background color
            background: '#24262e',
            // text: '#FFFFFF',
        },
        divider: {

            // Lines 
            default: '#BBBBBB',
        },
        action: {
            button: 'rgb(99,99,99)',
            hover: 'rgba(0,0,0,.08)',
            disabled: 'rgba(0,0,0,.12)',
        },
    }, 'dark');


    const columns = [
        {
            name: "Description",
            selector: row => row.activity,
            sortable: true,
        },
        {
            name: "Date",
            selector: row => moment(row.creared_at).format('MMM D YYYY h:mm:ss a'),
            sortable: true,
        }
    ];

    return (
        // <div className="container">
            <div className="row justifity-content-center">
                <div className="col-lg-12 col-md-12">
                    <DataTable 
                        title="Activity Logs"
                        columns={columns}
                        data={Activity}
                        selectableRows
                        pagination
                        theme='solarized'
                    />
                </div>
            </div>
        // </div>
    )
}

export default Logs