import axios from 'axios';
import { trimEnd } from 'lodash';
import moment from 'moment/moment';
import { Panel } from 'primereact/panel'
import React, { useEffect, useState } from 'react'
import DataTable, {createTheme} from 'react-data-table-component'
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { FaArrowLeft } from 'react-icons/fa';
import { Badge } from 'primereact';

function SentItems() {

    const [loading, setloading] = useState(true);
    const [loadData, setloadData] = useState([]);

    useEffect(() => {
        const id = localStorage.getItem('auth_id');

        axios.get(`/api/MessageItem/${id}`).then(res => {
            if (res.data.status === 200) {
                setloadData(res.data.Sent);
            }
            setloading(false);
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        });

    }, [localStorage.getItem('auth_id')]);

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
            name: "Email",
            selector: row => row.usersinfo.email,
            sortable: true,
        },
        {
            name: "Subject",
            selector: row => row.subject,
            sortable: true,
        },
        {
            name: "Date Sent",
            selector: row => moment(row.created_at).format('MMM D YYYY'),
            sortable: true,
        },
        {
            name: "Action",
            cell: row =>  <Link to={`/admin/view/refid=${row.id}`} className='border-0'><Badge value="Open" severity='info' /></Link>,
            sortable: true,
        }
    ];

    if (loading) {
        return (
            // <Loading></Loading>
            <h4></h4>
        )
    }

    return (

        <Panel>
            <DataTable
                noDataComponent={"No Sent Items"}
                columns={column}
                title="Sent Items"
                data={loadData}
                theme="solarized"
                pagination
                selectableRows
            />

        </Panel>

    )
}

export default SentItems