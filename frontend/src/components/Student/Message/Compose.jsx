import { Panel } from 'primereact/panel'
import React, { useRef, useState } from 'react'
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import swal from 'sweetalert';
import { Toast } from 'primereact';


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

        const data = new FormData();

        data.append('Email', touser);
        data.append('subject', subject);
        data.append('text', text);
        data.append('file', uploadfile.file);
        data.append('FromUser', localStorage.getItem('auth_id'));


        axios.post(`/api/SendComposeStudent`, data).then(res => {
            if (res.data.status === 200) {
                document.getElementById('compose').reset();
                setText("");
                setTouser("")
                setsubject("");
                seterror("")
                toast.current.show({ severity: 'success', summary: res.data.success, details: 'Message Sent' });
            }
            else if (res.data.status === 504) {
                swal("Warning", res.data.email, 'warning');
            }
            else {
                seterror(res.data.error);
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }


    const header = <span className='text-secondary'>Compose Message</span>

    return (
        <div>
            <div className="mt-3">
                <Panel header={header}>
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
                            <Button className="p-button-info" label='Send' />
                        </div>
                    </form>
                </Panel>
            </div>
        </div>
    )
}

export default Compose