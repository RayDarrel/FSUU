import React, { useEffect, useState } from 'react'
import { Toast } from 'primereact/toast';
import { OrganizationChart } from 'primereact/organizationchart';
import axios from 'axios';
import { Panel } from 'primereact/panel';

function DepartmentChart() {

    const [DataDepartment, setDepartment] = useState([]);
    const [loading, setloading] = useState(true);
    var list;

    useEffect(() => {
        axios.get(`/api/department`).then(res => {
            if (res.data.status === 200) {
                setDepartment(res.data.department);
                // setDepartment(JSON.stringify(res.data.department));
            }
            setloading(false)
        })
    }, []);

    const data_list = DataDepartment.map((deptd) =>
        list = {
            key: deptd.id,
            label: deptd.department_code,
        },
    )

    if (loading) {
        return (
            <h4>Loading Data...</h4>
        )
    }

    const data = [
        {
            label: 'Father Saturnino Urios University',
            expanded: true,
            children: [
                {
                    label: 'Thesis Archives',
                    expanded: true,
                    children: data_list,
                },
            ]
        }
    ];

    return (
        <div>
            <Panel header={<h4>Organization Chart</h4>}>
                <OrganizationChart value={data} selectionMode="single" className='p-organizationchart-table p-organizationchart-lines'></OrganizationChart>
            </Panel>
        </div>
    )
}

export default DepartmentChart