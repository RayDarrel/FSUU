import axios from 'axios';
import moment from 'moment';
import { Badge, Divider, Panel } from 'primereact';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import ReactReadMoreReadLess from 'react-read-more-read-less'
import VisitsChart from '../SeachEngineFiles/VisitsChart';

function View(props) {

    
    var keywords = [];
    const [Document, setDocument] = useState([]);
    const [otherinfo, setother] = useState({
        course: "",
        author: "",
    })
    const [loading, setloadin] = useState(true);
    
    useEffect(() => {
        const id = props.match.params.id;
        axios.post(`/api/AccessChecking/${id}`).then((res) => {
            if (res.data.status === 200) {
                setDocument(res.data.data);
                setother({
                    course: res.data.course,
                    author: res.data.author,
                })

            }
            setloadin(false);
        });
        // eslint-disable-next-line
    }, [props.match.params.id]);
    

    if(loading){
        return (
            <h4>Loading...</h4>
        )
    }

    const separate_keywords = Document.keywords.split(",");
    for (let index = 0; index < separate_keywords.length; index++) {
        const element = separate_keywords[index].replace("", " ");

        keywords.push(element);
    }


    return (
        <div>
            
            <Panel>
                <Divider align='left'>
                    <Badge value={"Research Title Details"} severity="info"></Badge>
                </Divider>
                <div className='mb-3'>
                    <ul>
                        <li className='text-light mb-3'><span>Research Code:  <span className='text-details'>{Document.reference_code}</span></span></li>
                        <li className='text-light mb-3'><span>Research Title:  <span className="text-details">{Document.title}</span>
                            <ul className='mt-2'>
                                <li className='list-result'><a href={`http://127.0.0.1:8000/${Document.information.file}`} target="_blank"><FaFilePdf size={20} className="text-danger" /> <span>{Document.title + "." + "pdf"}</span></a></li>
                            </ul>
                        </span></li>
                        <li className='text-light mb-3'><span>Research Keywords:  <span className="text-details">{keywords}</span></span></li>
                        <li className='text-light mb-3'><span>Abstract:  <p className='text-details'><ReactReadMoreReadLess
                            charLimit={200}
                        >
                            {Document.description}

                        </ReactReadMoreReadLess></p></span></li>
                    </ul>
                </div>
                
                <Divider align='left'>
                    <Badge value={"Other Info"} severity="info"></Badge>
                </Divider>
                <div className="mb-3">
                    <div className="container">
                        <div className="row justify-content-space align-items-start">
                            <div className="col-lg-6">
                                <ul>
                                    <li className='text-light mb-3'><span>Publication:  <span className='text-details'>{Document.publication}</span></span></li>
                                    <li className='text-light mb-3'><span>Department:  <span className="text-details">{otherinfo.course[0].department}</span></span></li>
                                    <li className='text-light mb-3'><span>Course:  <span className="text-details">{otherinfo.course[0].course}</span></span></li>
                                    <li className='text-light mb-3'><span>Author Info  <span className="text-details">
                                        <ul>
                                            {
                                                otherinfo.author.map((authname, id) => {
                                                    return (
                                                        <li className='list-result' key={id}>
                                                            <span className='fs-italic'><em>Name:  {authname.name} - <br /> Email: {authname.email}</em></span>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </span></span></li>
                                    <li className='text-light mb-3'><span>Published:  <span className='text-info'>{moment(Document.created_at).format('MMM D YYYY')}</span></span></li>
                                </ul>
                            </div>
                            <div className="col-lg-6">
                                <VisitsChart uniq={Document.uniq_key} />
                            </div>
                            
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    )
}

export default View