import axios from 'axios'
import { Button, InputText, InputTextarea, Panel, Toast } from 'primereact'
import React,{useEffect, useState} from 'react'
import { useRef } from 'react';
import swal from 'sweetalert';

function BookForm(props) {

    const [Title,setTitle] = useState([]);
    const [UserData, setUser] = useState([]);
    const toast = useRef();
    const [btntext, setBtntext] = useState("Submit")
    const [btndis, setBtndis] = useState(false)
    const [booking, setBooking] = useState({
        fullname: "",
        email: "",
        address: "",
        school: "",
        message: "",
        error: [],
    });

 

    useEffect(() =>{
        axios.post(`/api/AccountDetails/${localStorage.getItem('auth_id')}`).then(res =>{
            if(res.data.status === 200){
                setUser(res.data.User)
            }
        }).catch((error) =>{
            if(error.response.status === 500){
                swal("Warning",error.response.statusText,'warning')
            }
        })
    },[]);

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

        setBtndis(true)
        setBtntext("Submitting");
        const data ={
            fullname: UserData.first_name+" "+UserData.middle_name+" "+UserData.last_name,
            email: UserData.email,
            department: UserData.department,
            course: UserData.course,
            message: booking.message,
            code: props.match.params.id,
            userole: 2,
        }
        axios.post(`/api/RegisterForm`,data).then(res =>{
            if(res.data.status === 200){
                setBtndis(false)
                setBtntext("Submit");
                document.getElementById('form').reset();
                toast.current.show({severity: 'success',summary: res.data.message, detail: "Successfully"});
                setBooking({
                    error: [],
                })
                setTimeout(() =>{
                    window.location.href = `/student/document/refid=${props.match.params.id}`;
                },1200);

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
         
            <div className="container mt-2">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <Panel header={<h4>Booking Form - <small>{Title.title}</small></h4>}>
                            <form onSubmit={AddForm} id="form">
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="" className="form-label">Full Name</label>
                                        <InputText readOnly className='w-100' name="fullname" value={UserData.first_name+" "+UserData.middle_name+" "+UserData.last_name} onChange={handleInput} />
                                      
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="" className="form-label">Email Address</label>
                                        <InputText className='w-100' readOnly value={UserData.email} name="email" onChange={handleInput} />
                                     
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="" className="form-label">Department</label>
                                        <InputText className='w-100' readOnly value={UserData.department} name="address" onChange={handleInput} />
                                   
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label htmlFor="" className="form-label" >Course</label>
                                        <InputText className='w-100' readOnly value={UserData.course} name="school" onChange={handleInput} />
                                    
                                    </div>
                                    <div className="col-md-12 mb-2">
                                        <label htmlFor="" className="form-label">Message</label>
                                        <InputTextarea placeholder='Compose Message...' className='w-100' cols={5} rows={5} name="message" onChange={handleInput} />
                                        <span className='text-danger'>{booking.error.message}</span>
                                    </div>
                                </div>
                                <Button className='p-button-sm p-button-info' disabled={btndis}  label={btntext} />
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

export default BookForm