import { Panel } from 'primereact/panel'
import React, { useRef, useState } from 'react'
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import swal from 'sweetalert';
import { Divider, Toast } from 'primereact';


function Request() {

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
            <div className="mt-0">
                <Panel header={header}>
                    <Toast ref={toast} />
                    <form onSubmit={Composemsg} id="compose">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                {/* <small className='text-info'><span className='text-danger'>*</span>Input Library Email</small> */}
                                <InputText value={touser} required className="w-100" placeholder='Library Email' onChange={(e) => setTouser(e.target.value)} />
                                {/* <span className='text-danger'>{Errors.Email}</span> */}
                            </div>
                            <div className="col-md-6 mb-3">
                                <InputText value={subject} required className="w-100" placeholder='Subject' onChange={(e) => setsubject(e.target.value)} />
                            </div>
                            <div className="col-md-12 mb-3">
                                <Editor style={{ height: '200px' }} size={5} value={text} onTextChange={(e) => setText(e.htmlValue)} />
                            </div>
                        </div>
                        <div className="col-xl-2 mt-3">
                            <Button className="p-button-info" label='Send' />
                        </div>

                    </form>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="mt-3">
                                <b>Please Specify The Following Instruction When You Are Requesting To Access</b>
                                
                                <ul>
                                    <li>Purpose</li>
                                    <li>BarCode</li>
                                    <li>Name</li>
                                    <li>ID Number</li>
                                    <li>Department</li>
                                    <li>Course</li>
                                    
                                    <p>If You Didn't Follow The Instruction Your Request Will Be Deleted.
                                    <ul>
                                        <li><b>Library Email:</b> library@urios.edu.ph</li>
                                    </ul>
                                </p>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mt-3">
                                <b>Note:</b>
                                 <p>After Sending a Request Kindly Visit The Booking Status To Check The Status of your Request.</p>
                            </div>
                        </div>
                        
                    </div>
                    <Divider></Divider>
                </Panel>

            </div>
        </div>
    )
}

export default Request