import axios from 'axios';
import { Panel } from 'primereact/panel';
import React, { useEffect, useRef, useState } from 'react'
import { MagnifyingGlass } from 'react-loader-spinner'
import moment from 'moment/moment';
import ReactReadMoreReadLess from "react-read-more-read-less";
import { Menubar } from 'primereact/menubar';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import swal from 'sweetalert';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

function DocumentDetails(props) {


    var key = [];
    const [activeIndex, setActiveIndex] = useState();
    const [loading, setloading] = useState(true);
    const [Data, setData] = useState([]);
    const [statusview, setstatusview] = useState([]);
    const [Course, setCourse] = useState([]);
    const [authors, setauthor] = useState([])
    const toast = useRef();

    useEffect(() => {
        const data = {
            key: props.match.params.id,
        }
        axios.post(`/api/DetailsDocu`,data).then(res => {
            if (res.data.status === 200) {
                setData(res.data.document)
                setCourse(res.data.course)
                setauthor(res.data.author)
            }
            setloading(false)
        })
    }, [props.match.params.id]);


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
    const items = [
        {
            label: 'Return Page',
            url: '/faculty/collection',
        },
    ];
    const handleChangeSave = (e) => {
        const data = {
            view: e.target.value,
        };

        const tmpid = props.match.params.id;
        axios.put(`/api/UpdateStatus/${tmpid}`, data).then(res => {
            if (res.data.status === 200) {
                toast.current.show({ severity: "success", summary: "Status Updated", detail: "Change View as" + " " + e.target.value })
                setTimeout(() => {
                    window.location.href = `/admin/collection/refid=${props.match.params.id}`;
                }, 1500);
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }
    const header = <Menubar model={items} />



    const splitwords = Data.keywords.split(",");

    for (let index = 0; index < splitwords.length; index++) {
        const element = splitwords[index].replace(""," ");

        key.push(element)
    }


    return (

        <Panel headerTemplate={header}>
            <Toast ref={toast} />
            <Divider align='left'>
                <Badge value={"Research Title Details"} severity="info"></Badge>
            </Divider>
            <div className='mb-3'>
                <ul>
                    <li className='text-color-code mb-3'><span><b>BarCode</b>:  <span className='text-details'>{Data.reference_code}</span></span></li>
                    <li className='text-color-code mb-3'><span><b>Thesis Title</b>:  <span className="text-details">{Data.title}</span></span></li>
                    <li className='text-color-code mb-3'><span><b>Subject Terms</b>:  <span className="text-details">{key}</span></span></li>
                    <li className='text-color-code mb-3'><span><b>Document Type</b>: <a className='text-danger' rel="noreferrer" href={`http://127.0.0.1:8000/${Data.information.file}`} target="_blank">{Data.title + "." + "pdf"}</a></span></li>
                    <li className='text-color-code mb-3'><span><b>Abstract</b>:  <p className='text-details'><ReactReadMoreReadLess
                        charLimit={200} readMoreText={"Read more ▼"}
                        readLessText={"Read less ▲"}
                    >
                        {Data.description}
                    </ReactReadMoreReadLess></p></span></li>
                    <li className='text-color-code mb-3'><span><b>Cite</b>:  <span className="text-details">{
                        authors.map((daauthor) =>{
                            return (
                                <span>{daauthor.last_name+`,`} {daauthor.first_name.substring(0,1)+`.`} {daauthor.middle_name.substring(0,1)+`.`}  </span>
                            )
                        })

                    }</span>({Data.Year_Published}). {Data.title}</span></li>
                </ul>
            </div>
            <Divider align='left'>
                <Badge value={"Other Info"} severity="info"></Badge>
            </Divider>
            <div className='mb-3'>
                <ul>
                    <li className='text-color-code mb-3'><span><b>Place of Publication</b>:  <span className='text-details'>{Data.information.publication}</span></span></li>
                    <li className='text-color-code mb-3'><span><b>Location</b>:  <span className='text-details'>{Data.information.location}</span></span></li>
                    <li className='text-color-code mb-3'><span><b>Department</b>:  <span className="text-details">{Course.dept}</span></span></li>
                    <li className='text-color-code mb-3'><span><b>Course</b>:  <span className="text-details">{Course.cours}</span></span></li>
                    <li className='text-color-code mb-3'><span><b>Researcher</b>:  <span className="text-details">{Data.information.adviser}</span></span></li>
                    <li className='text-color-code mb-3'><span><b>View As</b>:  <span className="text-details">{Data.is_active_docu === 1 ? <Badge value="User" severity='success' /> : <Badge value="Admin" severity='danger' />}</span></span></li>
                    <li className='text-color-code mb-3'><span><b>Date of Import</b>:  <span className='text-info'>{moment(Data.created_at).format('MMM D YYYY ')}</span></span></li>
                    <li className='text-color-code mb-3'><span><b>Date of Published</b>:  <span className='text-info'>{Data.date_published}</span></span></li>
                </ul>
            </div>
        </Panel>
    )
}

export default DocumentDetails