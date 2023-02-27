import { Button } from 'primereact/button';
import { Badge, Dialog, Divider, Dropdown, InputText, Menubar, Panel, PrimeIcons, Toast } from 'primereact'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';
import { useEffect } from 'react';
import { useRef } from 'react';
import RecordThesis from './RecordThesis';




function AccountDetails(props) {

    const [Data, setData] = useState([]);
    const history = useHistory();
    const [loading, setloading] = useState(true);
    const [error, setError] = useState([]);
    const [status, setstatus] = useState([])
    const [visible, setVisible] = useState(false)
    var CryptoJS = require("crypto-js");
    const [encrypttext, setencrpyt] = useState("")
    const toast = useRef();

    // Register Acceess
    const [BarcodeData, setCode] = useState("");

    useEffect(() => {
        const data_id = props.match.params.id;

        axios.get(`/api/SearchStudent/${data_id}`).then((res) => {
            if (res.data.status === 200) {
                setData(res.data.Data);
                setloading(false);
            } else {
                swal("Error", res.data.error, "error");
                history.push("/admin/accounts");
            }
        }).catch((err) => {
            if (err.response.status === 500) {
                swal("Error", err.response.statusText, "error");
            }
        });
    }, [props.match.params.id]);


    const handleInput = (e) => {
        e.persist();
        setData({ ...Data, [e.target.name]: e.target.value });
    };

    const stat = [
        { label: "Active", value: 1 },
        { label: "Deactivited", value: 0 }
    ];


    const UpdateData = (e) => {
        e.preventDefault();

        const profile_id = props.match.params.id;
        const data = Data;
        axios.post(`/api/update_student/${profile_id}`, data).then((res) => {
            if (res.data.status === 200) {
                swal("Success", res.data.message, "success");
                history.push("/admin/accounts");
            } else if (res.data.status === 422) {
                swal("Warning", res.data.error, "warning");
            } else {
                setError(res.data.error);
            }
        });
    };

    const Update = (e) => {
        const data = {
            is_active: e.value,
            user: props.match.params.id,
        }
        axios.put(`/api/UpdateStatusAccount`, data).then((res) => {
            if (res.data.status === 200) {
                swal("Success", res.data.message, "success");
                setTimeout(() => {
                    window.location.href = `/admin/account/refid=${props.match.params.id}`;
                }, 1500);

            }
        });
    }

    const AddAccess = () => {
        setVisible(true)
        setencrpyt(CryptoJS.AES.encrypt('awgd', '12').toString())
    }

    const AddLink = (e) => {
        e.preventDefault();

        const data = {
            key: encrypttext,
            barcode: BarcodeData,
            userid: Data.id,
            email: Data.email,
            userfk: localStorage.getItem("auth_id"),
        }

        axios.post(`/api/SaveAccess`, data).then(res => {
            if(res.data.status === 200){
                setVisible(false)
                toast.current.show({severity: "success",summary: res.data.success, detail: Data.email});
                document.getElementById("Addlink").reset();
                setTimeout(() =>{
                    window.location.href= `/admin/account/refid=${Data.id}`;
                },1500);
            }
            else if(res.data.status === 504){
                alert("BarCode Does Not Exist");
            }
        }).catch((err) => {
            if (err.response.status === 500) {
                swal("Error", err.response.statusText, "error");
            }
        });
    }


    const items = [
        {
            label: <span onClick={AddAccess}>Document Access</span>,
            icon: PrimeIcons.PLUS,
        }
    ]

    const header = <Menubar model={items} />

    return (
        <div className='mt-3'>
            <Toast ref={toast} />
            <Panel headerTemplate={header}>
                <Divider>
                    <Badge value={"Student Information"} severity="info">

                    </Badge>
                </Divider>
                <div className="container">
                    <form onSubmit={UpdateData}>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="col-lg-12">
                                    <label htmlFor="" className="form-label text-color-code">
                                        ID Number
                                    </label>
                                    <InputText className='w-100' name='idnumber' value={Data.idnumber} onChange={handleInput} />
                                </div>
                                <div className="col-lg-12">
                                    <label htmlFor="" className="form-label text-color-code">
                                        Name:
                                    </label>
                                    <InputText className='w-100' name='name' onChange={handleInput} value={Data.name} />
                                </div>
                                <div className="col-lg-12">
                                    <label htmlFor="" className="form-label text-color-code">
                                        Email:
                                    </label>
                                    <InputText className='w-100' name='email' onChange={handleInput} value={Data.email} />
                                </div>
                                <div className="col-lg-12">
                                    <label htmlFor="" className="form-label text-color-code">
                                        Department:
                                    </label>
                                    <InputText className='w-100' value={Data.department} readOnly />
                                </div>
                                <div className="col-lg-12">
                                    <label htmlFor="" className="form-label text-color-code">
                                        Course:
                                    </label>
                                    <InputText className='w-100' value={Data.course} readOnly />
                                </div>

                            </div>
                            <div className="col-lg-6">
                                <div className="col-lg-12">
                                    <label htmlFor="" className="form-label text-color-code">
                                        School Year Registered
                                    </label>
                                    <InputText className='w-100' value={Data.school_year} readOnly />
                                </div>
                                <div className="col-lg-12">
                                    <label htmlFor="" className="form-label text-color-code">
                                        Google ID
                                    </label>
                                    <InputText className='w-100' value={Data.googleID} readOnly />
                                </div>
                                <div className="col-lg-12">
                                    <label htmlFor="" className="form-label text-color-code">
                                        Status
                                    </label>
                                    <InputText className='w-100' value={Data.is_active === 1 ? "Active" : "Not Active"} readOnly disabled />
                                </div>
                                <div className="col-lg-12">
                                    <label htmlFor="" className='form-label text-color-code'>
                                        Change Status
                                    </label>
                                    <Dropdown className='w-100' value={status} options={stat} onChange={Update} placeholder='Status Account' />
                                </div>
                            </div>
                            <Divider />

                        </div>
                        <div className="mt-3">
                            <Button className='p-button-success p-button-sm' label='Update' />
                        </div>
                    </form>
                    <Divider>
                        <Badge value={"Access Document"} severity="info">
                        </Badge>
                    </Divider>
                    <div className="container">
                        <RecordThesis id={props.match.params.id} />
                    </div>
                </div>
            </Panel>
            <Dialog header={<h4>Add Link</h4>} position='top' draggable={false} maximizable={false} visible={visible} onHide={() => setVisible(false)}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div className="container">
                    <form className='mt-3' id='Addlink' onSubmit={AddLink}>
                        <div className="row">
                            <div className="col-lg-12 mb-3">
                                <label htmlFor="" className='form-label'>BarCode</label>
                                <InputText className='w-100' required value={BarcodeData} name='barcode' onChange={(e) => setCode(e.target.value)} />
                            </div>
                            <div className="col-lg-12 mb-3">
                                <label htmlFor="" className='form-label'>Access Key</label>
                                <InputText className='w-100' readOnly value={encrypttext} />
                            </div>
                        </div>
                        <div className="mt-3">
                            <Button className='p-button-sm p-button-info' label='Save Link'></Button>
                        </div>
                    </form>
                </div>
            </Dialog>
        </div>
    )
}

export default AccountDetails