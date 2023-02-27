import axios from 'axios';
import moment from 'moment';
import { Badge, InputText, Panel } from 'primereact'
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

function AccountDetails() {

    const [UserData, setUser] = useState([]);
    const history = useHistory();

    useEffect(() =>{
        axios.post(`/api/AccountDetails/${localStorage.getItem('auth_id')}`).then(res =>{
            if(res.data.status === 200){
                setUser(res.data.User)
            }
            // else if(res.data.status === 504){
            //     swal("Warning",res.data.error,'warning')
            //     history.push('/faculty');
            // }
        }).catch((error) =>{
            if(error.response.status === 500){
                swal("Warning",error.response.statusText,'warning')
                history.push('/faculty');
            }
        })
    },[]);

    console.log(UserData)

    return (
        <div>
            <Panel header="Account Details">
                <div className="row">
                    <div className="col-lg-4 mb-2">
                        <label htmlFor="" className="form-label">
                            First Name
                        </label>
                        <InputText className='w-100' value={UserData.first_name} readOnly />
                    </div>
                    <div className="col-lg-4 mb-2">
                        <label htmlFor="" className="form-label">
                            Middle Name
                        </label>
                        <InputText className='w-100' value={UserData.middle_name} readOnly />
                    </div>
                    <div className="col-lg-4 mb-2">
                        <label htmlFor="" className="form-label">
                            Last Name
                        </label>
                        <InputText className='w-100' value={UserData.last_name} readOnly />
                    </div>
                    <div className="col-lg-4 mb-2">
                        <label htmlFor="" className="form-label">
                            Email Address
                        </label>
                        <InputText className='w-100' value={UserData.email} readOnly />
                    </div>
                    <div className="col-lg-4 mb-2">
                        <label htmlFor="" className="form-label">
                            ID Number
                        </label>
                        <InputText className='w-100' value={UserData.idnumber} readOnly />
                    </div>
                    <div className="col-lg-4 mb-2">
                        <label htmlFor="" className="form-label">
                            Position
                        </label>
                        <InputText className='w-100' value={UserData.position} readOnly />
                    </div>
                    <div className="col-lg-4 mb-2">
                        <label htmlFor="" className="form-label">
                            Department
                        </label>
                        <InputText className='w-100' value={UserData.department} readOnly />
                    </div>
                    <div className="col-lg-4 mb-2">
                        <label htmlFor="" className="form-label">
                            School Year Registered
                        </label>
                        <InputText className='w-100' value={UserData.school_year} readOnly />
                    </div>
                    <div className="col-lg-4 mb-2">
                        <label htmlFor="" className="form-label">
                            Created Account:
                        </label>
                        <InputText className='w-100 bg-transparent border-0' value= {moment(UserData.created_at).format("MMM D YYYY h:mm: a")} readOnly />
                    </div>
                </div>
            </Panel>
        </div>
    )
}

export default AccountDetails