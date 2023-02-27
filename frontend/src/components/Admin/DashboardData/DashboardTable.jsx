import React, { useEffect, useState } from "react";
import DataTable, {createTheme} from "react-data-table-component";
import axios from "axios";
import { Badge } from 'primereact/badge';
 

function DashboardTable() {

    const [department, setdepartment] = useState([]);
    useEffect(() => {
        axios.get(`/api/department`).then((res) => {
            if (res.data.status === 200) {
                setdepartment(res.data.department);
            }
        });
    }, []);

    const columns = [
        {
            name: "Department",
            selector: (row) => row.department,
            sortable: true,
        },
        {
            name: "Department Code",
            selector: (row) => row.department_code,
            sortable: true,
        },
        {
            name: "Number of Course",
            selector: (row) => <Badge value={row.total} severity="info"></Badge>,
            sortable: true,
        },
    ];

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


    return (
        <div>
            <DataTable
            title="Department"
                pagination
                fixedHeader
                fixedHeaderScrollHeight="200"
                columns={columns}
                data={department}
                theme="solarized"
            />
        </div>
    )
}

export default DashboardTable