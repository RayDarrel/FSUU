import { Badge, Button, Editor, InputText, PrimeIcons, Toast } from 'primereact'
import React, { useRef } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { Avatar } from 'primereact/avatar';
import swal from 'sweetalert';


function Compose() {

    const [text, setText] = useState();
    const [touser, setTouser] = useState();
    const [subject, setsubject] = useState();
    const [uploadfile, setfile] = useState([]);
    const [Errors, seterror] = useState([]);
    const toast = useRef();

    const fileHandler = (e) => {
        e.persist();
        setfile({ file: e.target.files[0] });

    }

   
    const Composemsg = (e) => {

        e.preventDefault();
        const data = {
            user: touser,
            from: localStorage.getItem('auth_id'),
            subject: subject,
            msg: text,
        }
        axios.post(`/api/SendMessage`, data).then(res => {
            if (res.data.status === 200) {
                toast.current.show({ severity: "success", summary: res.data.success, details: "Message Sent" });
                document.getElementById('compose').reset();
                setText("");
                setTouser("")
                setsubject("");
                seterror("")
            }
        }).catch((error) => {
            if (error.response.statue === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }

    return (
        <div>
       
            <Toast ref={toast} />
            <form onSubmit={Composemsg} id="compose">
                <div className="col">
                    <div className="col-md-12 mb-3">
                        <small className='text-info'><span className='text-danger'>*</span>Input Account Email (Student, Librarian, Admin)</small>
                        <InputText value={touser} required className="w-100" placeholder='Recipient Email' onChange={(e) => setTouser(e.target.value)} />
                        <span className='text-danger'>{Errors.Email}</span>
                    </div>
                    <div className="col-md-12 mb-3">
                        <InputText value={subject} required className="w-100" placeholder='Subject' onChange={(e) => setsubject(e.target.value)} />
                    </div>
                    <div className="col-md-12 mb-3">
                        <Editor style={{ height: '200px' }} size={20} value={text} onTextChange={(e) => setText(e.htmlValue)} />
                    </div>
                    <div class="mb-3 mt-2">
                        {/* <label for="formFile" className="form-label">Attach File</label> */}
                        <input className="form-file" accept='.pdf' onChange={fileHandler} name="file" type="file" id="formFile" /><br />
                        <small className='text-info'><span className='text-danger'>*</span>Please Attach PDF Files only</small>
                    </div>
                </div>
                <div className="col-xl-2 mt-3">
                    <Button className="p-button-info p-button-sm" label='Send' />
                </div>
            </form>
        </div>
    )
}

export default Compose