import axios from 'axios';
import moment from 'moment';
import { PrimeIcons } from 'primereact/api';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Menubar } from 'primereact/menubar';
import { Panel } from 'primereact/panel'
import React, { useEffect, useState } from 'react'
import { FaFilePdf } from 'react-icons/fa';
import swal from 'sweetalert';
import ReactReadMoreReadLess from 'react-read-more-read-less'
import VisitsChart from './VisitsChart';
import { useHistory } from 'react-router-dom';
import Readers from '../../Admin/SearchEngineResults/Readers';

function OpenDocument(props) {

    const keyword = localStorage.getItem("keyword")
    const [visits, setvisits] = useState([]);
    const history = useHistory();
    const [ResearchData, setResearch] = useState({
        details: "",
        authors: "",
        course: "",
        numbervisits: "",
    });

    var nf = new Intl.NumberFormat();

    const [loading, setloading] = useState(true);


    const getData = async () => {
        fetch('https://api.ipify.org?format=jsonp?callback=?', {
            method: "GET",
            headers: {},
        }).then(res => {
            if (res.status === 200) {
                return res.text();
            }
        }).then(ip => {

            const data = {
                ipaddress: ip,
                user_fk: localStorage.getItem('auth_id'),
                access: props.match.params.id.replace("=", "")
            }
            axios.post(`/api/IpAddressAccess`, data).then(res => {
                if (res.data.status === 200) {
                    setvisits(res.data.count)
                }
            }).catch((error) => {
                if (error.response.status === 500) {
                    swal("Warning", error.response.statusText, 'warning');
                }
            })
        })

    }
    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {

        const id = props.match.params.id;
        const tmpid = id.replace("=", "");

        const data = {
            document_code: tmpid,
            user_fk: localStorage.getItem("auth_id"),
        }
        axios.post(`/api/DocumentData`, data).then(res => {
            if (res.data.status === 200) {
                setResearch({
                    details: res.data.data,
                    authors: res.data.author,
                    course: res.data.course,
                    numbervisits: res.data.visits,
                });
            }
            // else{
            //     history.push('/student/search')
            // }
            setloading(false)
        }).catch((error) => {
            if (error.response.status === 500) {
                history.push('/student/search')
            }
        })
    }, [])

    if (loading) {
        return (
            <h4></h4>
        )
    }


    const item = [
        {
            label: "Return Page",
            url: `/student/search=${localStorage.getItem('keyword')}`
        },
        {
            label: "Booking Form",
            url: `/student/request/refid=${props.match.params.id}`
        },

    ]

    const header = <Menubar model={item} />

    return (
        <div>
            <Panel headerTemplate={header}>
                <Divider align='left'>
                    <Badge value={"Research Title Details"} severity="info"></Badge>
                </Divider>
                <div className='mb-3'>
                    <ul>
                        <li className='text-color-code mb-3'><span><b>Code</b>:  <span className='text-details'>{ResearchData.details.reference_code}</span></span></li>
                        <li className='text-color-code mb-3'><span><b>Title</b>:  <span className="text-details">{ResearchData.details.title}</span>
                            <ul className='mt-2'>
                          {(ResearchData.details.file === "undefinded") ? "" : <li className='list-result'><a href={`http://127.0.0.1:8000/${ResearchData.details.file}`} target="_blank"><FaFilePdf size={20} className="text-danger" /> <span>{ResearchData.details.title + "." + "pdf"}</span></a></li>}      
                            </ul>
                        </span></li>
                        <li className='text-color-code mb-3'><span><b>Keywords</b>:  <span className="text-details">{ResearchData.details.keywords}</span></span></li>
                        <li className='text-color-code mb-3'><span><b>Abstract</b>:  <p className='text-details'><ReactReadMoreReadLess
                            charLimit={200} readMoreText={"Read more ▼"}
                            readLessText={"Read less ▲"}
                        >
                            {ResearchData.details.description}


                        </ReactReadMoreReadLess></p></span></li>
                    </ul>
                </div>
                <Divider align='left'>
                    <Badge value={"Other Info"} severity="info"></Badge>
                </Divider>
                <div className="container">
                    <div className="row justify-content-space align-items-start">
                        <div className="col-lg-6">
                            <ul>
                                <li className='text-color-code mb-3'><span><b>Publication</b>:  <span className="text-details">{ResearchData.details.publication}</span></span></li>
                                <li className='text-color-code mb-3'><span><b>Optional Email</b>:  <span className="text-details">{ResearchData.optional_email}</span></span></li>
                                <li className='text-color-code mb-3'><span><b>Department</b>:  <span className="text-details">{ResearchData.course.department}</span></span></li>
                                <li className='text-color-code mb-3'><span><b>Course</b>:  <span className="text-details">{ResearchData.course.course}</span></span></li>
                                
                                    
                                        <li className='text-color-code mb-3'><span><b>Cite</b>:  <span className="text-details">{
                                            ResearchData.authors.map((daauthor) => {
                                                return (
                                                    <span>{daauthor.last_name + `,`} {daauthor.first_name.substring(0, 1) + `.`} {daauthor.middle_name.substring(0, 1) + `.`}  </span>
                                                )
                                            })

                                        }</span>({ResearchData.details.Year_Published}). {ResearchData.details.title}</span></li>
                                    
                                
                                <li className='text-color-code mb-3'><span><b>Published</b>:  <span className='text-info'>{moment(ResearchData.details.created_at).format("MMM DD YYYY")}</span></span></li>
                            </ul>
                        </div>
                        <div className="col-lg-6">
                            <h6 className='text-color-code'><b>Total Visits</b>: {ResearchData.numbervisits}</h6>
                            <VisitsChart uniq={props.match.params.id} />
                        </div>
                        <Divider />
                        <Readers />
                    </div>
                </div>
            </Panel>
        </div>
    )
}

export default OpenDocument