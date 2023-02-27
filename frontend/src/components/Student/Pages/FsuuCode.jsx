import axios from 'axios'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
import React, { useState } from 'react'
import { FaCode, FaSearch } from 'react-icons/fa'
import { Link, useHistory } from 'react-router-dom'
import swal from 'sweetalert'
import { Dialog } from 'primereact/dialog';
import { Messages } from 'primereact/messages';
import { useRef } from 'react'


function FsuuCode() {




    const [visible, setVisible] = useState(false);
    const msgs = useRef(null);

    const [search, setsearch] = useState({
        fsuu_code: "",
        error: [],
    });
    const history = useHistory();

    const handleInput = (e) => {
        e.persist();
        setsearch({ ...search, [e.target.name]: e.target.value });
    }



    const Search = (e) => {
        e.preventDefault();
        console.log()
        if (search.fsuu_code === "") {
            alert("Please Input the BarCode Code 🔏 ")
        }
        else {
            const code = "3FSUU" + "" + search.fsuu_code;

            const data = {
                fsuu_code: code,
                id: localStorage.getItem('auth_id'),
            };
            axios.post(`/api/searchCode`, data).then(res => {
                if (res.data.status === 200) {
                    localStorage.setItem('thesis', data.fsuu_code);
                    history.push(`/student/code/search=${data.fsuu_code}`);
                }
                else if (res.data.status === 404) {
                    swal("Warning", res.data.error, 'error');
                }
                else if (res.data.status === 505) {
                    setVisible(true)
                    msgs.current.show({ sticky: true, severity: 'warn', summary: 'Warning', detail: 'Message Content', closable: false },)
                }
                else {
                    setsearch({ ...search, error: res.data.error });

                }
            });

        }
    }
    return (
        <div>
            <Panel>
                <div className="p-5 bg-image text-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="text-container">
                                    <h1 className='text-secondary title-head'>FATHER SATURNINO URIOS UNIVERSITY</h1>
                                    <br />
                                    <span className='text-secondary fs-4 font-weight-500'>THESIS COLLECTIONS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <form onSubmit={Search}>
                    <h4 className='text-details'><FaCode /> BarCode Search </h4>
                    <div className="p-inputgroup">
                        <Button disabled label='3FSUU' />
                        <InputText keyfilter={'int'} name='fsuu_code' onChange={handleInput} placeholder="BarCode" />
                        <Button icon="pi pi-search" className="p-button-primary" />
                    </div>
                </form>
                <Divider></Divider>
                <Dialog header={<h4 className='text-warning fw-bold'>Warning!</h4>} position='top' visible={visible} draggable={false} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                    <div className="container mb-3">
                        <span className='fs-6 text-secondary p-2 mt-3'>Hello,</span>
                        <p className="m-0 py-3 text-indent-parag text-secondary">
                            This document is for admin only. If you want to get an access, you should visit them directly at their office or message them by clicking compose button.
                        </p>
                        <div className="container mb-3">
                            <h5 className='text-secondary'>Requirements</h5>
                            <ul>
                                <li className='mb-2'><span className='text-secondary'>Purpose</span></li>
                                <li className='mb-2'><span className='text-secondary'>BarCode</span></li>
                                <li className='mb-2'><span className='text-secondary'>Name</span></li>
                                <li className='mb-2'><span className='text-secondary'>ID Number</span></li>
                                <li className='mb-2'><span className='text-secondary'>Department</span></li>
                                <li className='mb-2'><span className='text-secondary'>Course</span></li>
                            </ul>
                        </div>

                    </div>
                    <div className="mt-3">
                        <Link to={`/student/request`}><Button className='p-button-sm p-button-info' label='Compose'></Button></Link>
                    </div>
                </Dialog>

            </Panel>
        </div>
    )
}

export default FsuuCode