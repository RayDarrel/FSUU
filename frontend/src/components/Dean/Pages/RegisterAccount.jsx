import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import swal from 'sweetalert';
import { Toast } from 'primereact/toast';

function RegisterAccount() {

    const [filter, setfilter] = useState([]);
    const [btntext, setbtntext] = useState("Create");
    const [choose, setchoose] = useState([]);
    const [btndis, setbtndis] = useState(false);
    var item = [];

    const [CreateAccount, setCreate] = useState({
        idnum: "",
        email: "",
        fname: "",
        mname: "",
        lname: "",
        error: [],
    });
    const toast = useRef();
    useEffect(() => {
        const data = {
            id: localStorage.getItem('auth_id'),
        }
        axios.post(`/api/CourseSelected`, data).then(res => {
            if (res.data.status === 200) {
                setfilter(res.data.data);
            }
        });
    }, [])

    const handleInput = (e) => {
        e.persist();
        setCreate({ ...CreateAccount, [e.target.name]: e.target.value });
    }

    const course = filter.map((datacourser) => {
        return (
            {
                label: datacourser.course, value: datacourser.id
            }
        )
    })

    const Create = (e) => {
        e.preventDefault();
        setbtntext("Creating..")
        setbtndis(true)
        const data = {
            idnum: CreateAccount.idnum,
            email: CreateAccount.email,
            fname: CreateAccount.fname,
            mname: CreateAccount.mname,
            lname: CreateAccount.lname,
            course: choose,
            user: localStorage.getItem('auth_id'),
        }
        axios.post(`/api/RegisterAccount`,data).then(res =>{
            if(res.data.status === 200){
                toast.current.show({severity: 'success',summary: res.data.message, detail: "Added Account"});
                document.getElementById('resetform').reset();
                setbtntext("Create")
                setchoose([])
                setbtndis(false)
            }
            else{
                setCreate({...CreateAccount, error: res.data.error});
                setbtntext("Create")
                setbtndis(false)
            }
        }).catch((error) =>{
            if(error.response.status === 500){
                swal("Warning",error.response.statusText,'warning');
                setbtntext("Create")
                setbtndis(false)
            }
        })
        
    }

    return (
        <div>
            <Toast ref={toast} />
            <form onSubmit={Create} id="resetform">
                <div className="container mt-0">
                    <h4 className='text-secondary'>Student Info</h4>
                    <div className="row justify-content-space align-items-center">
                        <div className="col-lg-6 mb-3">
                            <InputText keyfilter={'alphanum'} required className='w-100' onChange={handleInput} name='idnum' placeholder='Student ID Number' />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={'email'} name="email" onChange={handleInput} placeholder='Student Urios Email' />
                            <span className='text-danger'>{CreateAccount.error.email}</span>
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={/^[^#<>*!]+$/} name='fname' onChange={handleInput} placeholder='First Name' />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' keyfilter={/^[^#<>*!]+$/} name='mname' onChange={handleInput} placeholder='Middle Name' />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={/^[^#<>*!]+$/} name='lname' onChange={handleInput} placeholder='Last Name' />
                        </div>
                        <div className="col-lg-6 mb-3">
                        <Dropdown className='w-100' required value={choose} options={course} onChange={(e) => setchoose(e.target.value)} placeholder="Course"></Dropdown>
                        </div>
                        <div className="mt-1">
                            <Button className='p-button-sm' disabled={btndis} label={btntext}></Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RegisterAccount