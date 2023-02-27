import axios from 'axios';
import { Button, InputText, InputTextarea, Menubar, Panel, PrimeIcons, Toast } from 'primereact';
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';



function GuestData(props) {

    const [Data, setData] = useState({
        Book: "",
        title: "",
    });
    const [visible, setVisible] = useState(false);
    const [fromdate, setFromDate] = useState([])
    const [enddate, setEndDate] = useState([])
    const [txtbtn, setBtn] = useState("Save");
    const [btndis, setBtndis] = useState(false);
    const toast = useRef();
    const history = useHistory();
    useEffect(() => {
        const id = props.match.params.id;

        axios.post(`/api/GuestData/${id}`).then(res => {
            if (res.data.status === 200) {
                setData({
                    Book: res.data.data,
                    title: res.data.title,
                });
            }
            else {
                swal("Error", res.data.error, 'error');
                history.push(`/admin/booking`);
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }, [props.match.params.id]);


    const SaveSchedule = () => {

        if (fromdate.length === 0 || enddate.length === 0) {
            alert("Set Schedule")
        }
        else {
            const data = {
                from: moment(fromdate).format("MM D YYYY"),
                end: moment(enddate).format("MM D YYYY"),
                id: props.match.params.id,
                email: Data.Book.email,
                name: Data.Book.fullname,
            };
            setBtndis(true)
            setBtn("Updating...");
            axios.put(`/api/UpdateGuest`, data).then(res => {
                if (res.data.status === 200) {
                    setVisible(false)
                    setBtndis(false)
                    setBtn("Set Schedule");
                    toast.current.show({ severity: "success", summary: res.data.success, detail: "Successfully" });
                    setInterval(() => {
                        window.location.href = "/admin/booking";
                    }, 800);
                }
            }).catch((error) => {
                if (error.response.status === 500) {
                    swal("Warning", error.response.statusText, 'warning');
                    setBtndis(false)
                    setBtn("Set Schedule");
                }
            })
        }
    }

    const onHide = () => {
        setVisible(false);
    }

    const DialogDisplay = () => {
        setVisible(true);
    }

    const footerdialog = <div>
        <Button className='p-button-info p-button-sm' disabled={btndis} label={txtbtn} onClick={SaveSchedule} />
        <Button className='p-button-danger p-button-sm' label='Close' onClick={onHide} />
    </div>



    const header = <nav className="navbar navbar-light bg-transparent">
        <div className="container-fluid">
            <a className="navbar-brand">Book Information</a>
            <div className="d-flex">
                <Link to={'/admin/booking'}> <Button className='p-button-success p-button-sm ' label='Return Page' /></Link>
            </div>
        </div>
    </nav>

    return (
        <div>
            <Toast ref={toast} />
            <Panel headerTemplate={header}>
                {/* <div className="container"> */}
                <div className="row">
                    <div className="col-lg-6 col-md-12 mb-2">
                        <label className="form-label">Book Number</label>
                        <InputText className='w-100' readOnly value={Data.Book.bookid} />
                    </div>
                    <div className="col-lg-6 col-md-12 mb-2">
                        <label className="form-label">Full Name</label>
                        <InputText className='w-100' readOnly value={Data.Book.fullname} />
                    </div>

                    {
                        (Data.Book.role === 1) ? <React.Fragment>
                            <div className="col-lg-6 col-md-12 mb-2">
                                <label className="form-label">Email</label>
                                <InputText className='w-100' readOnly value={Data.Book.email} />
                            </div>
                            <div className="col-lg-6 col-md-12 mb-2">
                                <label className="form-label">Address</label>
                                <InputText className='w-100' readOnly value={Data.Book.address} />
                            </div>
                        </React.Fragment>
                            : <React.Fragment>
                                <div className="col-lg-6 col-md-12 mb-2">
                                    <label className="form-label">Email</label>
                                    <InputText className='w-100' readOnly value={Data.Book.email} />
                                </div>
                                <div className="col-lg-6 mb-2">
                                    <label className="form-label">Department</label>
                                    <InputText className='w-100' readOnly value={Data.Book.department} />
                                </div>
                                <div className="col-lg-6 mb-2">
                                    <label className="form-label">Course</label>
                                    <InputText className='w-100' readOnly value={Data.Book.course} />
                                </div>
                            </React.Fragment>

                    }
                    <div className="col-lg-6 col-md-12 mb-2">
                        <label className="form-label">School</label>
                        <InputText className='w-100' readOnly value={Data.Book.school} />
                    </div>
                    <div className="col-lg-6 col-md-12 mb-2">
                        <label className="form-label">Thesis Title</label>
                        <InputText className='w-100' readOnly value={Data.title.title} />
                    </div>
                    <div className="col-lg-12 col-md-12 mb-2">
                        <label className="form-label">Message</label>
                        <InputTextarea className='w-100' readOnly cols={5} rows={5} value={Data.Book.message} />
                    </div>
                </div>
                <div className="mt-3">
                    <Button className='p-button-info p-button-sm' onClick={DialogDisplay} icon={PrimeIcons.CALENDAR_PLUS} label="Set Schedule" />
                </div>
                {/* </div> */}
            </Panel>


            <Dialog header="Set Schedule" footer={footerdialog} visible={visible} position="top" draggable={false} onHide={onHide} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }}>
                <div className="container">
                    <form>
                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <label htmlFor="" className="form-label">From</label>
                                <Calendar required showButtonBar disabledDays={[0, 6]} dateFormat="mm/dd/yy" className='w-100' readOnlyInput value={fromdate} onChange={(e) => setFromDate(e.value)}></Calendar>
                            </div>
                            <div className="col-lg-12 col-md-12">
                                <label htmlFor="" className="form-label">End</label>
                                <Calendar required disabledDays={[0, 6]} dateFormat="mm/dd/yy" className='w-100' readOnlyInput value={enddate} onChange={(e) => setEndDate(e.value)}></Calendar>
                            </div>
                        </div>
                    </form>
                </div>
            </Dialog>

        </div>
    )
}

export default GuestData