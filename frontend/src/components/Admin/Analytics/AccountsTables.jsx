import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import DataTable,{createTheme} from 'react-data-table-component'

function AccountsTables({id}) {

    const [Department,setDepartment ] = useState([]);
    const [TotalAccounts, setTotal] = useState([]);
    const [loading, setloading] = useState(false);
    useEffect(() => {
        axios.post(`/api/AnalyticsDepartmentYear/${id}`).then((res) => {
            if (res.data.status === 200) {
                setDepartment(res.data.analytics);
                setTotal(res.data.count);
            }
            setloading(false);
        }).catch((error) => {
            if (error.response.status === 500) {
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
            name: "Department Code",
            selector: row => row.department_code,
        },
        {
            name: "Total Data",
            selector: row => row.total,
        },
    ]

    return (
        <div className='mb-3'>
            {(TotalAccounts === "No Data") ? "No Data To Display" :   <DataTable 
                columns={column}
                data={TotalAccounts}
                theme='solarized'
                pagination
            />}
        </div> 
    )
}

export default AccountsTables