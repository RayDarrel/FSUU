import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import swal from 'sweetalert';
import Papa from 'papaparse';
import { useHistory } from 'react-router-dom';
import { FaInfo, FaInfoCircle } from 'react-icons/fa';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

function ImportCSV() {

    const [TextBtn, setTextBtn] = useState("Upload");
    const [btndis, setbtndis] = useState(false);
    const history = useHistory();
    const [uploadstatus, setuploadstatus] = useState([])
    const [loading,setloading] = useState(true);
    const toast = useRef();

    const student = (e) => {
        e.preventDefault();
        var filec = document.getElementById('filecsv').files[0];
        if (filec) {
            setTextBtn("Uploading");
            setbtndis(true)
            Papa.parse(filec, {
                skipEmptyLines: true, header: false,
                complete: function (result) {
                    const obj = Object.entries(result.data);
                    obj.forEach(([key, value]) => {
                        const data = {
                            IDNumber: value[0],
                            first: value[1],
                            middle: value[2],
                            last: value[3],
                            email: value[4],
                            department: value[5],
                            course: value[6],
                            user: localStorage.getItem('auth_id'),
                        }
                        axios.post('/api/importdata', data).then(res => {
                            if (res.data.status === 200) {
                                setTextBtn("Upload")
                                setbtndis(false)
                                document.getElementById("fileform").reset();
                                toast.current.show({ severity: 'success', summary: res.data.message, detail: 'Registered Account' });
                            }
                        }).catch((err) => {
                            if (err.response.status === 500) {
                                setTextBtn("Upload")
                                setbtndis(false)
                            }
                        })
                    })
                }
            });
        }
        else {
            swal("Warning", "Please Input the file", "warning");
        }
    }

    return (
        <div>
            <form onSubmit={student} id="fileform">
                <div className="container">
                    <Toast ref={toast} />
                    <div class="alert alert-info py-2" role="alert">
                        <FaInfoCircle className='me-2 align-middle' /> Once a CSV file is uploaded. The File must contain (ID Number, First Name, Middle Name, Last name, Email, Department, Course
                        <br /> <b>Type of Users</b>: Student
                    </div>
                    <div className="mt-3">
                        <input type="file" name='file' id='filecsv' className='p-inputtext p-component p-inputtext w-100 file-place' />
                        <div className="mt-3">
                            <Button  className='p-button-sm' label={TextBtn} disabled={btndis}/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ImportCSV