import axios from 'axios';
import moment from 'moment';
import { Badge } from 'primereact';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import DataTable, { createTheme } from 'react-data-table-component'
import { Link } from 'react-router-dom';
import Message from '../Pages/Message'

function Inbox() {

    const [InboxData, setInbox] = useState([]);

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
        axios.get(`/api/AdminInbox/${id}`).then(res => {
            if (res.data.status === 200) {
                setInbox(res.data.inbox);
            }
        }).catch((error) => {
            if (error.response.status === 500) {

            }
        })
    }, [])


    const column = [
        {
            name: "Email",
            selector: row => row.email,
        },
        {
            name: "Subject",
            selector: row => row.subject,
        },
        {
            name: "Date Received",
            selector: row => moment(row.created_at).format('MMM D YYYY h:mm a'),
        },
        {
            name: "Action",
            cell: row => row.seen === 1 ? <Link to={`/admin/read/refid=${row.message_id}`}><Badge severity='info' value="Open"></Badge></Link> : <Link to={`/admin/read/refid=${row.message_id}`}><Badge severity='danger' value="New Message"></Badge></Link>,
        },
    ];

    return (
        <div>
            <Message />
            {
                <DataTable
                title="Inbox Message"
                    columns={column}
                    data={InboxData}
                    noDataComponent="No Inbox Message"
                    theme='solarized'
                    selectableRows
                    pagination
                />
            }
        </div>
    )
}

export default Inbox