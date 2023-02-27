import axios from 'axios'
import { Button, InputText, InputTextarea, Panel, Toast } from 'primereact'
import React,{useEffect, useState} from 'react'
import { useRef } from 'react';
import swal from 'sweetalert';
import NavBar from './NavBar'

function BookingForm(props) {

    const [Title,setTitle] = useState([]);
    const toast = useRef();
    const [booking, setBooking] = useState({
        fullname: "",
        email: "",
        address: "",
        school: "",
        message: "",
        error: [],
    });

    useEffect(() =>{
        axios.get(`/api/NameDocument/${props.match.params.id}`).then(res =>{
            if(res.data.status === 200){
                setTitle(res.data.data)
            }
        }).catch((error) =>{
            if(error.response.status === 500){

            }
        })
    },[]);


    const handleInput = (e) =>{
        e.persist();
        setBooking({...booking, [e.target.name] : e.target.value});
    }

    const AddForm = (e) =>{
        e.preventDefault();

        const data ={
            fullname: booking.fullname,
            email: booking.email,
            address: booking.address,
            school: booking.school,
            message: booking.message,
            code: props.match.params.id,
            userole: 1,
        }
        axios.post(`/api/RegisterForm`,data).then(res =>{
            if(res.data.status === 200){
                document.getElementById('form').reset();
                toast.current.show({severity: 'success',summary: res.data.message, detail: "Successfully"});
                setBooking({
                    error: [],
                })
            }
            else{
                setBooking({...booking, error: res.data.error});
            }
        }).catch((error) =>{
            if(error.response.status === 500){
                swal("Warning",error.response.statusText,'warning');
            }
        })
    }


    return (
        <div>
            <Toast ref={toast} />
            <NavBar />
            <div className="container mt-2">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <Panel header={<h4>Booking Form - <small>{Title.title}</small></h4>}>
                            <form onSubmit={AddForm} id="form">
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="" className="form-label">Full Name</label>
                                        <InputText className='w-100' name="fullname" onChange={handleInput} />
                                        <span className='text-danger'>{booking.error.fullname}</span>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="" className="form-label">Email Address</label>
                                        <InputText className='w-100' name="email" onChange={handleInput} />
                                        <span className='text-danger'>{booking.error.email}</span>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="" className="form-label">Address</label>
                                        <InputText className='w-100' required  name="address" onChange={handleInput} />
                                        {/* <span className='text-danger'>{booking.error.address}</span> */}
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="" className="form-label" >School</label>
                                        <InputText className='w-100' required name="school" onChange={handleInput} />
                                        {/* <span className='text-danger'>{booking.error.school}</span> */}
                                    </div>
                                    <div className="col-md-12 mb-2">
                                        <label htmlFor="" className="form-label">Message</label>
                                        <InputTextarea className='w-100' cols={5} rows={5} name="message" onChange={handleInput} />
                                        <span className='text-danger'>{booking.error.message}</span>
                                    </div>
                                </div>
                                <Button className='p-button-sm' label='Submit' />
                            </form>
                            <div className="mt-2">
                                <span><b>Note:</b> <p>After submitting your form, please wait for the response from the library within one day. You'll get the notification from the email you registered.</p></span>
                            </div>
                        </Panel>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingForm