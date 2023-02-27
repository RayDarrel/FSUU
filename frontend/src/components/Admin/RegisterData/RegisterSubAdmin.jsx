import axios from 'axios';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'
import { MagnifyingGlass } from 'react-loader-spinner';
import swal from 'sweetalert';

function RegisterSubAdmin() {

    const [selected, setselected] = useState();
    const [loading, setloading] = useState(true)
    const [Year, setYear] = useState([]);
    const [btn, setdisbtn] = useState(false);
    const toast = useRef();
    const [selecttype, setselecttype] = useState([])
    const [btntext, setbtntext] = useState("Create")
    const [btndis, setbtndis] = useState(false);
    const [collect, setcollect] = useState({
        idnum: "",
        name: "",
        email: "",
        year: "",
        error: [],
    })

    useEffect(() => {
        axios.get(`/api/currentYear`).then(res => {
            if (res.data.status === 200) {
                setYear(res.data.YearData);
            }
            setloading(false);
        });
    }, []);

    // const assign_program = [
    //     // { label: "Chairman", value: 5 },
    //     { label: "Librarian", value: 4 },
    // ]

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
        setbtndis(true)
        const data = {
            idnum: collect.idnum,
            name: collect.name,
            email: collect.email,
            year: Year.school_year,
            account: 4,
            user_id: localStorage.getItem('auth_id'),
        }
        setbtntext("Creating.")

        axios.post(`/api/AdminType`, data).then(res => {
            if (res.data.status === 200) {
                toast.current.show({ severity: 'success', summary: res.data.message, detail: 'Created Account' });
                document.getElementById('formcreate').reset();
                setbtndis(false)
                setbtntext("Create")
                setselecttype([])
            }
            else {
                setcollect({ ...collect, error: res.data.error });
                setbtndis(false)
                setbtntext("Create")
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
                setbtndis(false)
                setbtntext("Create")
            }
        })
    }

    return (
        <div>

            <Toast ref={toast} />
            <div className="row justifity-content-center">
                <h5 className='text-secondary'>Account Type</h5>
                {/* <div className="col-md-12 mb-2 mt-1">
                    <Dropdown required className='w-100'  value={selecttype} options={assign_program} placeholder='Type of Assign Program' onChange={(e) => setselecttype(e.value)}></Dropdown>
                </div> */}
                <hr />
                <h5 className='text-secondary'>Account Info</h5>
                <form onSubmit={CreateSub} id="formcreate">
                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={'alphanum'} name='idnum' onChange={handleInput} placeholder="ID Number" />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={/^[^#<>*!]+$/} name='name' onChange={handleInput} placeholder="Full Name" />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' required keyfilter={'email'} name='email' onChange={handleInput} placeholder="Email" />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <InputText className='w-100' name='year' readOnly value={Year.school_year} />
                        </div>
                        <div className="mt-3">
                            <Button className='p-button-sm' label={btntext} disabled={btndis}></Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterSubAdmin