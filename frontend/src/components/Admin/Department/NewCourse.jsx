import React, { useEffect, useRef, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import swal from 'sweetalert';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';

function NewCourse() {



    const [course, setcourse] = useState([]);
    const [selected, setselected] = useState();
    const [btntext, setbtntext] = useState("Create");
    const [btndis, setbtndis] = useState(false);
    const toast = useRef();

    const [CourseAdd, setCourse] = useState({
        course: "",
        error: [],
    });

    useEffect(() => {
        axios.get(`/api/department`).then(res => {
            if (res.data.status === 200) {
                setcourse(res.data.department);
            }
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

    const handleInput = (e) => {
        setCourse({ ...CourseAdd, [e.target.name]: e.target.value });
    }

    const AddCourse = (e) => {
        e.preventDefault();
        const data = {
            deptID: selected,
            course: CourseAdd.course
        }
        setbtntext("Creating.")
        setbtndis(false);
        axios.post(`/api/AddCourse`, data).then(res => {
            if (res.data.status === 200) {
                toast.current.show({ severity: 'success', summary: res.data.success, detail: 'Course Added' });
                document.getElementById("course").reset();
                setbtntext("Create")
                setselected([])
                setbtndis(false);
            }
           
        }).catch((err) => {
            if (err.response.status === 500) {
                swal("Warning", err.response.statusText, 'warning');
                setbtntext("Create")
                setbtndis(true);
            }
        });
    }



    return (
        <div className="container">
            <Toast ref={toast} />
            <form onSubmit={AddCourse} id="course">
                <div className="col-md-12 mb-3">
                <label htmlFor="" className='text-secondary form-label'>Department</label>
                    <Dropdown value={selected} required className="w-100" options={courseSelectItem} onChange={(e) => setselected(e.value)} placeholder="Select Department" />
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="" className='text-secondary form-label'>Course Name</label>
                    <InputText className='w-100' name='course' onChange={handleInput} />
                    {/* <label htmlFor="" className='text-secondary form-label'>Course Name</label>
                    <input type="text" placeholder='Course' name='course' onChange={handleInput} className='form-control' /> */}
                </div>
                <div className="mt-3">
                    <Button className='p-button-sm' label={btntext} disabled={btndis} />
                </div>
            </form>
        </div>
    )
}

export default NewCourse