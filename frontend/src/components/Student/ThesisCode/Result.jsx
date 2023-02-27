import axios from 'axios';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import ReactReadMoreReadLess from 'react-read-more-read-less'
import moment from 'moment';
import VisitsChart from '../SeachEngineFiles/VisitsChart';
import { FaFilePdf } from 'react-icons/fa';

function Result(props) {

    var keywords = [];
    const [Document, setDocument] = useState([]);
    const [otherinfo, setother] = useState({
        course: "",
        author: "",
    })
    const [loading, setloadin] = useState(true);
    const [search, setsearch] = useState({
        fsuu_code: "",
        error: [],
    });
    const handleInput = (e) => {
        e.persist();
        setsearch({ ...search, [e.target.name]: e.target.value });
    }



    useEffect(() => {
        const id = localStorage.getItem('thesis')
        axios.post(`/api/CodeChecking/${id}`).then((res) => {
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


    const Search = (e) => {
        e.preventDefault();
        if (search.fsuu_code === "") {
            alert("Please Input the BarCode Code 🔏 ")
        }
        else {
            const code = "3FSUU" + "" + search.fsuu_code;

            const data = {
                fsuu_code: code,
                id: localStorage.getItem('auth_id'),
            };
            axios.post(`/api/searchCode`, data).then(res => {
                if (res.data.status === 200) {
                    localStorage.setItem('thesis', data.fsuu_code);
                    window.location.href = `/student/code/search=${data.fsuu_code}`;
                }
                else if(res.data.status === 505){
                    swal("Warning",res.data.error,'error');
                }
                else if (res.data.status === 404) {
                    swal("Warning", res.data.error, 'error');

                }
                else {
                    setsearch({ ...search, error: res.data.error });

                }
            });
        }
    }


    if (loading) {
        return (
            <h5></h5>
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
                <form onSubmit={Search}>
                    <div className="p-inputgroup">
                        <Button disabled label='3FSUU' />
                        <InputText keyfilter={'int'} name='fsuu_code' onChange={handleInput} placeholder="Thesis Code" />
                        <Button icon="pi pi-search" className="p-button-primary" />
                    </div>
                </form>

                <Divider align='left'>
                    <Badge value={"Research Title Details"} severity="info"></Badge>
                </Divider>
                <div className='mb-3'>
                    <ul>
                        <li className='text-light mb-3'><span>Research Code:  <span className='text-details'>{Document.reference_code}</span></span></li>
                        <li className='text-light mb-3'><span>Research Title:  <span className="text-details">{Document.title}</span>
                            <ul className='mt-2'>
                                <li className='list-result'><a href={`http://127.0.0.1:8000/${Document.file}`} target="_blank"><FaFilePdf size={20} className="text-danger" /> <span>{Document.title + "." + "pdf"}</span></a></li>
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

export default Result