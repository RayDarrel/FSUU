import React, { useEffect, useState } from 'react'
import { Panel } from 'primereact/panel'
import { FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa'
import DataTable, {createTheme} from 'react-data-table-component'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert'
import moment from 'moment/moment'
import { Badge, Button } from 'primereact'

function Inbox() {

    const [searchData, setSearchData] = useState();
    const [loading, setloading]  = useState(true);
    const history = useHistory();
    const [FacultyInbox, setFaculty] = useState([]);

    useEffect(() =>{
        const id = localStorage.getItem('auth_id');

        axios.get(`/api/FacultyInbox/${id}`).then(res =>{
            if(res.data.status === 200){
                setFaculty(res.data.FacultyInbox);
            }
            setloading(false)
        }).catch((error) =>{
            if(error.response.status === 500){
                swal("Warning",error.response.statusText, 'warning');
            }
        })
        
    },[localStorage.getItem('auth_id')])


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

    const Update = (event) =>{
        const id = event;

        axios.post(`/api/StudentSeen/${id}`).then(res =>{
            console.log(res)
            if(res.data.status === 200){
               window.location.href= `/student/read/ref=${id}`;
            }
            else{

            }
        }).catch((error) =>{
            if(error.response.status === 500){
                swal("Warning",error.response.statusText, 'warning');
            }
        })
    }


    const column = [
        {
            name: "From",
            selector: row => row.email,
            sortable: true,
        },
        {
            name: "Subject",
            selector: row => row.subject,
            sortable: true,
        },
        {
            name: "Date Received",
            selector: row => moment(row.created_at).format('MMM D YYYY h:mm a'),
            sortable: true,
        },
        {
            name: "Action",
            selector: row => row.seen === 0 ? <button onClick={() => Update(row.id)} className='bg-transparent border-0'><Badge value={"New Message"} severity="danger"></Badge></button> : <Link to={`/faculty/read/ref=${row.message_id}`}><Badge value={"Read"} severity="info"></Badge></Link>,
            // to={`/dean/read/${row.id}`}
            // selector: row => row.seen === 0 ? <button value={row.id}  onClick={() =>Update(row.id)} className='bg-transparent border-0'><Badge value={"New Message"} severity="info" /></button> : <Link to={`/student/read/ref=${row.id}`}  className='bg-transparent border-0'><Badge value={"Read"} severity="danger" /></Link>,
            // selector: row => row.seen === 0 ? <button value={row.id} className='btn badge bg-primary border-0' onClick={() =>Update(row.id)}>New Message</button> : <Link to={`/student/read/${row.id}`} className='btn border-0'><span className='badge bg-secondary'>Read</span></Link>,
        },
    ]
    if (loading) {
        return (
            <h4></h4>
        )
    }

    return (
      
            <Panel>
                <DataTable
                    title="Inbox Message"
                    noDataComponent="Inbox Empty"
                    subHeader
                    selectableRows
                    columns={column}
                    data={FacultyInbox}
                    theme="solarized"
                    pagination
                />
            </Panel>
      
    )
}

export default Inbox