import axios from 'axios';
import { Button, Editor, InputText, Menubar, Panel, PrimeIcons, Toast } from 'primereact';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { FaReply } from 'react-icons/fa';
import swal from 'sweetalert';
import { Dialog } from 'primereact/dialog';
import { useRef } from 'react';

function ReadInbox(props) {

    const [Details, setDetails] = useState([]);
    const [visible, setVisible] = useState(false)
    const [loading, setloading] = useState(true)
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

    useEffect(() => {

        const data = {
            id: localStorage.getItem("auth_id"),
            key: props.match.params.id,
        };

        axios.post(`/api/InboxDetails`, data).then(res => {
            if (res.data.status === 200) {
                setDetails(res.data.Inbox);
            }
            setloading(false)
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }, [])

    const ReplyMsg = (e) => {
        setVisible(true)
    }


    const items = [
        {
            label: "Return Page",
            url: "/admin/inbox"
        },
        {
            label: <span onClick={ReplyMsg}>Reply</span>,
            icon: PrimeIcons.REPLY,

        }
    ]

    const header = <Menubar model={items} />


    const Composemsg = (e) => {

        e.preventDefault();
        const data = {
            user: Details.frominfo.email,
            from: localStorage.getItem('auth_id'),
            subject: Details.subject,
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
                setVisible(false)
            }
        }).catch((error) => {
            if (error.response.statue === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }

    if (loading) {
        return (
            <h4></h4>
        )
    }

    return (

        <div>
            <Toast ref={toast} />
            <Panel headerTemplate={header}>
                <div className="col">
                    <div className="col-md-12 mb-2">
                        <InputText value={Details.frominfo.email} readOnly required className="form-control py-2" placeholder='' />
                    </div>
                    <div className="col-md-12 mb-2">
                        <InputText value={Details.subject} readOnly required className="form-control py-2" placeholder='Subject' />
                    </div>
                    <div className="col-md-12 mb-2">
                        <Editor readOnly={true} style={{ height: '200px' }} size={20} value={Details.message_text} />
                    </div>
                    {
                        Details.file === null ? "No File Attached" : <div class="mb-3 mt-2">

                            <a target="_blank" href={`http://127.0.0.1:8000/${Details.file}`}><button className='btn btn-primary'>View File</button></a>
                        </div>
                    }
                </div>
                <Dialog header={<h4>Reply Message</h4>} draggable={false} visible={visible} position="top" style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                    <form onSubmit={Composemsg} id="compose" className='mt-3'>
                        <div className="col">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="" className='form-label'>Email</label>
                                {/* <small className='text-info'><span className='text-danger'>*</span>Input Account Email (Student, Librarian, Admin)</small> */}
                                <InputText value={Details.frominfo.email} readOnly required className="w-100" placeholder='Recipient Email' onChange={(e) => setTouser(e.target.value)} />
                                <span className='text-danger'>{Errors.Email}</span>
                            </div>
                            <div className="col-md-12 mb-3">
                                <label htmlFor="" className="form-label">Subject</label>
                                <InputText value={Details.subject} readOnly required className="w-100" placeholder='Subject' onChange={(e) => setsubject(e.target.value)} />
                            </div>
                            <div className="col-md-12 mb-3">
                                <label htmlFor="" className="form-label">Message</label>
                                <Editor style={{ height: '200px' }} size={20} value={text} onTextChange={(e) => setText(e.htmlValue)} />
                            </div>
                          
                        </div>
                        <div className="col-xl-2 mt-3">
                            <Button className="p-button-info p-button-sm" label='Send' />
                        </div>
                    </form>
                </Dialog>
            </Panel>
        </div>
    )
}

export default ReadInbox