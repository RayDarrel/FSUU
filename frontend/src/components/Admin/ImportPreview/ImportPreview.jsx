import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';


function ImportPreview({ barcode,year,month,location, SY, adviser, publication, optional, description,filename, department, course, nameperson, title, keyword }) {

    // const [filea, setfile] = useState([]);

    const [detailsdata, setdetails] = useState({
        dept: "",
        course_data: "",
    });

    const [loading, setloading] = useState(true);

    useEffect(() => {
        const data = {
            dep: department,
            cour: course,
        }
        axios.post(`/api/DepartmentName`, data).then(res => {
            if (res.data.status === 200) {
                setdetails({ dept: res.data.dept, course_data: res.data.course })
            }
            setloading(false)
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })

    }, [])



    if (loading) {
        return (
            <h4>Loading...</h4>
        )
    }

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <Divider align='left'>
                            <Badge value={"Author Information"} severity="info"></Badge>
                        </Divider>
                        {       
                            nameperson.map((person, id) => {
                                return (
                                    <ul>
                                        <li className='text-color-code' key={id}>  <span> <b>Email</b>: {person}</span></li>
                                    </ul>
                                )
                            })
                        }
                        <Divider>
                        <Badge value={"Department & Course"} severity="info"></Badge>
                        </Divider>
                        <ul>
                            <li className='mb-3 text-color-code'>
                                <span><b>Department</b>: {detailsdata.dept.department}</span>
                            </li>
                            <li className='mb-3 text-color-code'>
                                <span><b>Course</b>: {detailsdata.course_data.course}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-12">
                        <Divider>
                            <Badge value={"Research Title Information"} severity="info"></Badge>
                        </Divider>
                        <h5 className='text-color-code'><b>Research Title</b>: </h5> <span className='text-color-code'>{title}</span>
                        <div className="container mt-3">
                            <h5 className='text-color-code'><b>Keywords</b></h5>
                            {
                                keyword.map((keyw, id) => {
                                    return (
                                        <ul>
                                            <li className='text-color-code' key={id}><span>{keyw}</span></li>
                                        </ul>
                                    )
                                })
                            }
                        </div>
                        <h5 className='text-color-code'><b>Abstract</b></h5>
                        <p className='text-description text-color-code'>{description}</p>
                        <Divider>
                            <Badge value={"Other Information"} severity="info"></Badge>
                        </Divider>
                        <div className="container">
                            <ul>
                                <li className='mb-3 text-color-code'><span><b>Barcode:</b>  {barcode}</span></li>
                                <li className='mb-3 text-color-code'><span><b>Publication:</b>  {publication}</span></li>
                                <li className='mb-3 text-color-code'><span><b>Location:</b>  {location}</span></li>
                                <li className='mb-3 text-color-code'><span><b>Date Publshed:</b>  {month+` `+year}</span></li>
                                <li className='mb-3 text-color-code'><span><b>Adviser:</b>  {adviser}</span></li>
                                <li className='mb-3 text-color-code'><span><b>Optional Email:</b>  {optional}</span></li>
                                <li className='mb-3 text-color-code'><span><b>School Year:</b>  {SY}</span></li>
                                <li className='mb-3 text-color-code'><span><b>File Name:</b>  {filename.name}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImportPreview