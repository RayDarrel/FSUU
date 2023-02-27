import React, { useEffect, useRef, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import axios from 'axios';
import swal from 'sweetalert';
import { Toast } from 'primereact/toast';
import { MagnifyingGlass } from 'react-loader-spinner'
import { InputText } from 'primereact/inputtext';

function RegisterStudent() {

    const [course, setcourse] = useState([]);
    const [selected, setselected] = useState();
    const [CourseData, setCourseData] = useState([]);
    const [DataCourse, setdata] = useState([]);
    const [filter, setfilter] = useState([]);
    const [Year, setYear] = useState([]);
    const [btntext, setbtntext] = useState("Create");
    const toast = useRef();
    const [selectdata, setselectdata] = useState();
    const [btndis, setbtndis] = useState(false);
    const [loading, setloading] = useState(true);
    const [CreateAccount, setCreate] = useState({
        idnum: "",
        email: "",
        fname: "",
        mname: "",
        lname: "",
    });

    const handleInput = (e) => {
        e.persist();
        setCreate({ ...CreateAccount, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        axios.post(`/api/Course`).then(res => {
            if (res.data.status === 200) {
                setdata(res.data.Data)
                setfilter(res.data.Data);
            }
        });
    }, [])

    useEffect(() => {
        axios.get(`/api/currentYear`).then(res => {
            if (res.data.status === 200) {
                setYear(res.data.YearData);
            }
            setloading(false);
        });
    }, []);




    useEffect(() => {
        const result = DataCourse.filter(data => {
            return data.deparment_fk === selected ? selected : setselectdata("");
        })
        setfilter(result);
    }, [selected]);


    const itemcourse = filter.map((dept) => {
        return (
            {
                label: dept.course, value: dept.id,
            }
        )
    });

    useEffect(() => {
        axios.get(`/api/department`).then(res => {
            if (res.data.status === 200) {
                setcourse(res.data.department);
            }
        }).catch((err) => {
            if (err.response.status === 500) {
                swal("Warning", err.response.statusText, 'warning');
            }
        });
    }, []);

    useEffect(() => {
        axios.post(`/api/filterCourse/${selected}`).then(res => {
            if (res.data.status === 200) {
                setCourseData(res.data.Course);

            }
        })
    }, [])

    const courseSelectItem = course.map((dept) => {
        return (
            {
                label: dept.department, value: dept.id,
            }
        )
    });

    const Create = (e) => {
        e.preventDefault();
        setbtndis(true);
        setbtntext("Creating..");
        const data = {
            idnum: CreateAccount.idnum,
            email: CreateAccount.email,
            fname: CreateAccount.fname,
            mname: CreateAccount.mname,
            lname: CreateAccount.lname,
            deparment_fk: selected,
            course_fk: selectdata,
            accounttype: 2,
            yearid: Year.id,
            adminkey: localStorage.getItem('auth_id'),
        };

        axios.post(`/api/saveData`, data).then(res => {
            if (res.data.status === 200) {
                document.getElementById("resetform").reset();
                toast.current.show({ severity: 'success', summary: res.data.success, detail: 'Registered Account' });
                setbtndis(false)
                setbtntext("Create");
                setselected([]);
                setselectdata([]);
            }
            else {

            }
        }).catch((err) => {
            if (err.response.status === 500) {
                swal("Warning", err.response.statusText, 'warning');
                setbtndis(false)
                setbtntext("Save");
                
            }
        });

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



    return (

        <div>
            <Toast ref={toast} />
            <div className="container">
                <h5 className='text-secondary'>Department & Course</h5>
                <div className="row justifity-content-center">
                    <div className="col-md-6 mb-1 mt-1">
                        <Dropdown value={selected} id="department" required className="w-100" options={courseSelectItem} onChange={(e) => setselected(e.value)} placeholder="Select Department" />
                    </div>
                    <div className="col-md-6 mt-1">
                        <Dropdown value={selectdata} required className="w-100" placeholder='Choose Course' options={itemcourse} onChange={(e) => setselectdata(e.value)} />
                    </div>
                </div>
            </div>

            <hr />
            <form onSubmit={Create} id="resetform">
                <div className="container mt-0">
                    <h5 className='text-secondary'>Student Info</h5>
                    <div className="row justify-content-space align-items-center">
                        <div className="col-lg-6 mb-3">
                            <InputText keyfilter={'alphanum'} required className='w-100' onChange={handleInput} name='idnum'  placeholder='Student ID Number'/>    
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={'email'} name="email" onChange={handleInput}  placeholder='Student Urios Email'/>    
                        </div> 
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={/^[^#<>*!]+$/} name='fname' onChange={handleInput}  placeholder='First Name'/>    
                        </div> 
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' keyfilter={/^[^#<>*!]+$/} name='mname' onChange={handleInput}  placeholder='Middle Name'/>    
                        </div>  
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={/^[^#<>*!]+$/} name='lname' onChange={handleInput}  placeholder='Last Name'/>    
                        </div>  
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' readOnly value={Year.school_year} />    
                        </div> 
                        <div className="mt-3">
                            <Button className='p-button-sm' disabled={btndis} label={btntext}></Button>    
                        </div> 
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RegisterStudent
