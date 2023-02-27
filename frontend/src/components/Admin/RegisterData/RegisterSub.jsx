import axios from 'axios';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'
import { MagnifyingGlass } from 'react-loader-spinner';
import swal from 'sweetalert';


function RegisterSub() {

    const [department, setdepartment] = useState([]);
    const [selected, setselected] = useState();
    const [loading, setloading] = useState(true)
    const [Year, setYear] = useState([]);
    const [btn, setdisbtn] = useState(false);
    const [btntext, setbtntext] = useState("Create");
    const toast = useRef();
    const [selecttype, setselecttype] = useState([])
    const [positiondata ,setposition] = useState([]);
    const [collect, setcollect] = useState({
        idnum: "",
        fname: "",
        mname: "",
        lname: "",
        email: "",
        year: "",
        error: [],
    })

    useEffect(() => {
        axios.get(`/api/department`).then(res => {
            if (res.data.status === 200) {
                setdepartment(res.data.department);
            }

        }).catch((err) => {
            if (err.response.status === 500) {

                swal("Warning", err.response.statusText, 'warning');
            }
        });
    }, []);

    useEffect(() => {
        axios.get(`/api/currentYear`).then(res => {
            if (res.data.status === 200) {
                setYear(res.data.YearData);
            }
            setloading(false);
        });
    }, []);

    const courseSelectItem = department.map((dept) => {
        return (
            {
                label: dept.department, value: dept.id,
            }
        )
    });

    const assign_program = [
        // { label: "Dean", value: 3 },
        { label: "Faculty", value: "Faculty" },
        { label: "Staff", value: "Chairman" },

    ];

    const positionlist = [
        {label: "Dean", value: 3},
        {label: "Chairman", value: 5}
    ]

    const handleInput = (e) => {
        e.persist();
        setcollect({ ...collect, [e.target.name]: e.target.value });
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center w-100 align-items-center vh-100">
                <MagnifyingGlass
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="MagnifyingGlass-loading"
                    wrapperStyle={{}}
                    wrapperClass="MagnifyingGlass-wrapper"
                    glassColor='#c0efff'
                    color='#e15b64'
                />
            </div>
        )
    }

    const CreateSub = (e) => {
        e.preventDefault();
        setdisbtn(true)

        if (selected === "") {
            alert("Please Select Department")
        }
        else {
            const data = {
                idnum: collect.idnum,
                // name: collect.name,
                fname: collect.fname,
                mname: collect.mname,
                lname: collect.lname,
                email: collect.email,
                year: Year.school_year,
                account: selecttype,
                department: selected,
                position: positiondata, // dean or chairman
                user_id: localStorage.getItem('auth_id'),
            }

            setbtntext("Creating.")

            axios.post(`/api/CreateSub`, data).then(res => {
                if (res.data.status === 200) {
                    toast.current.show({ severity: 'success', summary: res.data.message, detail: 'Created Account' });
                    document.getElementById('formcreate').reset();
                    setdisbtn(false)
                    setbtntext("Create")
                    setselected([]);
                    setposition([]);
                }
                else {
                    setcollect({ ...collect, error: res.data.error });
                    setdisbtn(false)
                    setbtntext("Save")
                }
            }).catch((error) => {
                if (error.response.status === 500) {
                    swal("Warning", error.response.statusText, 'warning');
                    setdisbtn(false)
                    setbtntext("Save")
                }
            })
        }
    }

    return (
        <div>
            <Toast ref={toast} />
            {/* <h5 className='text-secondary'>Account Type</h5> */}
            {/* <div className="col-md-12 mb-2 mt-1">
                <Dropdown required className='w-100' value={selecttype} options={assign_program} placeholder='Type of Assign Program' onChange={(e) => setselecttype(e.value)}></Dropdown>
            </div> */}
            <div className="row justifity-content-center">
                <h5 className='text-secondary'>Department</h5>
                <div className="col-md-6 mb-2 mt-1">
                    <Dropdown value={selected} id="department" required className="w-100" options={courseSelectItem} onChange={(e) => setselected(e.value)} placeholder="Select Department" />
                </div>
                <div className="col-md-6 mb-2 mt-1">
                    <Dropdown value={positiondata} id="department" required className="w-100" options={positionlist} onChange={(e) => setposition(e.value)} placeholder="Position" />
                </div>
                <hr />
                <h5 className='text-secondary'>Account Info</h5>
                <form onSubmit={CreateSub} id="formcreate">
                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={'alphanum'} name='idnum' onChange={handleInput} placeholder="ID Number" />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={/^[^#<>*!]+$/} name='fname' onChange={handleInput} placeholder="First Name" />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={/^[^#<>*!]+$/} name='mname' onChange={handleInput} placeholder="Middle Name" />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={/^[^#<>*!]+$/} name='lname' onChange={handleInput} placeholder="Last Name" />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={'email'} name='email' onChange={handleInput} placeholder="Email" />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' name='year' readOnly value={Year.school_year} />
                        </div>

                        <div className="mt-3">
                            <Button className='p-button-sm' label={btntext} disabled={btn}></Button>
                        </div>
                    </div>
                </form>
            </div>
            

        </div>
    )
}

export default RegisterSub