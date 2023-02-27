import { Panel } from 'primereact/panel'
import React, { useState } from 'react'
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import swal from 'sweetalert';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Menubar } from 'primereact';


function ReadInbox(props) {

    const [loading, setloading] = useState(true);
    const [text, setText] = useState();
    const [touser, setTouser] = useState();
    const [subject, setsubject] = useState();
    const [uploadfile, setfile] = useState([]);

    const [AllData, setalldata] = useState([]);


    useState(() => {
        const id = props.match.params.id;
        axios.get(`/api/DeanReadData/${id}`).then(res => {
            if (res.data.status === 200) {
                setalldata(res.data.Inbox);
            }
            setloading(false)
        }).catch((error) => {
            if (error.response.status === 200) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })

    }, [props.match.params.id]);

    

    const fileHandler = (e) => {
        e.persist();
        setfile({ file: e.target.files[0] });

    }


    if (loading) {
        return (
            <h4></h4>
        )
    }

    const items = [
        {
            label: "Return Page",
            url: "/faculty/inbox"
        }
    ]

    const header = <Menubar model={items}  />

    return (
        <div className='mt-3'>
            <Panel headerTemplate={header}>
                <div className="col">
                    <div className="col-md-12 mb-2">
                        <InputText value={AllData.frominfo.email} readOnly required className="form-control py-2" placeholder='To Recipient ' onChange={(e) => setTouser(e.target.value)} />
                    </div>
                    <div className="col-md-12 mb-2">
                        <InputText value={AllData.subject} readOnly required className="form-control py-2" placeholder='Subject' onChange={(e) => setsubject(e.target.value)} />
                    </div>
                    <div className="col-md-12 mb-2">
                        <Editor readOnly={true} style={{ height: '200px' }} size={20} value={AllData.message_text} onTextChange={(e) => setText(e.htmlValue)} />
                    </div>
                    {
                        AllData.file === null ? "No File Attached" : <div class="mb-3 mt-2">

                            <a target="_blank" href={`http://127.0.0.1:8000/${AllData.file}`}><button className='btn btn-primary'>View File</button></a>
                        </div>
                    }
                </div>
            </Panel>
        </div>
    )
}

export default ReadInbox