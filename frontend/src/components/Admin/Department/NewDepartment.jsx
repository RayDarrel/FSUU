import axios from 'axios';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'
import swal from 'sweetalert';
import { ColorPicker } from 'primereact/colorpicker';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

function NewDepartment() {

    const [color, setColor] = useState("");
    const [btndis, setbtndis] = useState(false);
    const [btntext, setbtntext] = useState("Add Department");

    const [department, setdepartment] = useState({
        deptname: "",
        deptcode: "",
        error: [],
    });
    const toast = useRef();



    const handleinput = (e) => {
        e.persist();
        setdepartment({ ...department, [e.target.name]: e.target.value });
    }
    const Department = (e) => {
        e.preventDefault();
        if (color === "") {
            alert("Assign Department Color Code")
        }
        else {
            setbtntext("Adding Department")
            setbtndis(true)
            const data = {
                id: localStorage.getItem('auth_id'),
                deptname: department.deptname,
                deptcode: department.deptcode,
                colorcode: color,
            }

            axios.post(`/api/AddDepartment`, data).then(res => {
                if (res.data.status === 200) {
                    toast.current.show({ severity: 'success', summary: res.data.success, detail: 'Registered Department' });
                    document.getElementById('addDepartment').reset();
                    setbtntext("Add Department")
                    setbtndis(false)
                }
                else {
                    setdepartment({ ...department, error: res.data.error });
                }
            }).catch((err) => {
                if (err.response.status === 500) {
                    swal("Warning", err.response.statusText, 'warning');
                }
            });
        }
    }


    return (
        <div className="container">
            <Toast ref={toast} />
            <form onSubmit={Department} id="addDepartment">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <InputText className='w-100' required placeholder='Department Name' name='deptname' onChange={handleinput} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <InputText className='w-100' required placeholder='Department Code' name='deptcode' onChange={handleinput} />
                    </div>
                    <label htmlFor="" className="form-label">Department Color Code</label>
                    <div className="col-md-12 mb-3">
                        <ColorPicker value={color} onChange={(e) => setColor(e.value)} inline style={{ width: "200px" }} />
                      
                        {/* <small className='text-danger'>*Not Include #</small> */}
                    </div>
                    <InputText value={color}  required readOnly className='w-100' />
                    <div className="mt-3">
                        <Button className='p-button-sm' label={btntext} disabled={btndis}></Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default NewDepartment