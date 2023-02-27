import axios from "axios";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import DataTable, {createTheme} from "react-data-table-component";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import {Panel} from 'primereact/panel'
import moment from "moment/moment";
import { Badge } from "primereact/badge";

function Dashboard() {

    createTheme('solarized', {
        text: {

            // text row color
            primary: '#BFC3CD',
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
            default: '#073642',
        },
        action: {
            button: 'rgba(0,0,0,.54)',
            hover: 'rgba(0,0,0,.08)',
            disabled: 'rgba(0,0,0,.12)',
        },
    }, 'dark');

    const [DataDocs, setData] = useState([])
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem("auth_id");
        axios.get(`/api/ThesisDocument/${id}`).then(res => {
            if (res.data.status === 200) {
                setData(res.data.Details);
            }
            setloading(false)
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }, [])

    console.log(DataDocs)

    const column = [
        {
            name: "Research Title",
            selector: row => row.title,
            sortable: true,
        },
        {
            name: "Reference Code",
            selector: row => row.reference_code,
            sortable: true,
        },
        {
            name: "Published",
            selector: row => moment(row.created_at).format("MMM D YYYY"),
            sortable: true,
        },
        {
            name: "Action",
            cell: row => <Link to={`/student/details/docu/refid=${row.reference_code}`}><Badge value={"Details"}/></Link> ,
            sortable: true,
        },
    ]

    return (
        <div>
        
            <Panel>
                <DataTable 
                    title="Research Title"
                    columns={column}
                    data={DataDocs}
                    selectableRows
                    pagination
                    theme="solarized"
                />
            </Panel>
        </div>
    )
}

export default Dashboard