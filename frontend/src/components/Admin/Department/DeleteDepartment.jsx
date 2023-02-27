import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import swal from 'sweetalert';
import { Panel } from 'primereact/panel';
import Display from './Display';


function DeleteDepartment() {

    const [loading, setloading] = useState(true);
    const history = useHistory();
    const [course, setcourse] = useState([]);
    const [selected, setselected] = useState("");


    useEffect(() => {
        axios.get(`/api/department`).then(res => {
            if (res.data.status === 200) {

                setcourse(res.data.department);
            }
            setloading(false);
        }).catch((err) => {
            if (err.response.status === 500) {

                swal("Warning", err.response.statusText, 'warning');

            }
        });
    }, []);


    const courseSelectItem = course.map((dept) => {
        return (
            {
                label: dept.department, value: dept.id,
            }
        )
    });
    if (loading) {
        return (
            <h3>Loading Data...</h3>
        )
    }

    return (
        <div>
            <Panel>
                <Dropdown value={selected} className="w-100" options={courseSelectItem} onChange={(e) => setselected(e.value)} placeholder="Select Department" />
                <div className="mt-3">
                    {
                        selected === "" ? "" : <Display selected={selected} setselected={setselected} />
                    }
                </div>
            </Panel>
        </div>
    )
}

export default DeleteDepartment