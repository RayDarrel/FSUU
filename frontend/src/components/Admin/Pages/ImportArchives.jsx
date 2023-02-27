import { PrimeIcons } from 'primereact/api'
import { Card } from 'primereact/card'
import { Menubar } from 'primereact/menubar'
import { Panel } from 'primereact/panel'
import React, { useEffect, useRef, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
import swal from 'sweetalert'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import ImportPreview from '../ImportPreview/ImportPreview'
import { Toast } from 'primereact/toast'
import icon from '../../../assets/user-regular.svg';
import { Mention } from 'primereact/mention';
import {FaEnvelope, FaUser} from 'react-icons/fa'

import { Calendar } from 'primereact/calendar';
 

function ImportArchives() {

    const [loading, setloading] = useState(true);
    const [date, setDate] = useState([]);
    const [FileDocs, setFileUpload] = useState([]);
    const [FileComplete, setComplete] = useState([]);
    const toast = useRef();
    const [LinkTags, setLinkTags] = useState([]);
    const [NameTags, setRemoveNames] = useState([]);
    const [course, setcourse] = useState([]);
    const [selected, setselected] = useState("");
    const [selectdata, setselectdata] = useState("");
    const [filter, setfilter] = useState([]);
    const [DataCourse, setdata] = useState([]);
    const [btndis, setbtndis] = useState(false);
    const [Tags, setTags] = useState([]);
    const [Year, setYear] = useState([]);
    const [visible, setvisible] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [UserData, setUserData] = useState([]);
    const email_user = useRef(null);
    const [emailchoose, setemailchoose] = useState("")
    const [locationfiles, setlocationfiles] = useState([]);
    const [archives, setarchives] = useState({
        title: "",
        description: "",
        author: "",
        publication: "",
        adviser: "",
        department: "",
        optional: "",
        barcode: "",
        month: "",
        city: "",
        year: "",
        error: [],
    });

    const months = [
        {label: "January", value: "January"},
        {label: "February", value: "February"},
        {label: "March", value: "March"},
        {label: "Apil", value: "Apil"},
        {label: "May", value: "May"},
        {label: "June", value: "June"},
        {label: "July", value: "July"},
        {label: "August", value: "August"},
        {label: "September", value: "September"},
        {label: "October", value: "October"},
        {label: "November", value: "November"},
        {label: "December", value: "December"},
    ]

    const handleinput = (e) => {
        e.persist();
        setarchives({ ...archives, [e.target.name]: e.target.value });

    }
    const fileHandler = (e) => {
        e.persist();
        setFileUpload({ file: e.target.files[0] });
    }
    
    const fileHandlerComplete = (e) => {
        e.persist();
        setComplete({ complete: e.target.files[0] });

    }
    useEffect(() => {
        axios.get(`/api/currentYear`).then(res => {
            if (res.data.status === 200) {
                setYear(res.data.YearData);
            }
            setloading(false)
        });
    }, []);
    useEffect(() => {
        axios.get(`/api/department`).then(res => {
            if (res.data.status === 200) {
                setcourse(res.data.department);
            }
        }).catch((err) => {
            if (err.response.status === 500) {
                swal("Warning", err.response.statusText, 'warning');

            }
        });
    }, []);
    useEffect(() => {
        axios.post(`/api/Course`).then(res => {
            if (res.data.status === 200) {
                setdata(res.data.Data)
                setfilter(res.data.Data);
            }
        });
    }, [])

    useEffect(() => {
        axios.get(`/api/UserData`).then(res => {
            if (res.data.status === 200) {
                setUserData(res.data.email);
            }
            else if (res.data.status === 504) {
                setUserData(res.data.error);
            }
            setloading(false)
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }, [])

    useEffect(() => {
        const result = DataCourse.filter(data => {
            return data.deparment_fk === selected ? selected : setselectdata("");
        })
        setfilter(result);
    }, [selected]);

    const SelectDataEmail = (e) => {
        setemailchoose(e.suggestion.email)
    }

    const EmailInput = (e) => {
        setemailchoose(e.target.value);
    }

    const AddTagNames = (e) => {


        if (NameTags.find(nameTags => nameTags === emailchoose)) {
            alert(emailchoose + " " + "Email is already registered")
            setemailchoose("")
        }
        else {
            if (emailchoose === "") {
                return false;
                // alert("Please Enter Email")
            }
            else {
                setRemoveNames([...NameTags, emailchoose]);
                setemailchoose("");
            }
        }
    }

    const AddKeyword = (e) => {
        e.preventDefault();
        if (Tags.find(keywordTags => keywordTags === document.getElementById('keyword').value)) {
            alert(document.getElementById('keyword').value + " " + "Keyword is already registered")
            document.getElementById('keyword').value = "";
        }
        else {
            if (document.getElementById('keyword').value === "") {
                return false;
            }
            else {
                setTags([...Tags, document.getElementById('keyword').value]);
                document.getElementById('keyword').value = "";
            }
        }
    }

    const RemoveTag = RemoveTag => {
        const newTagss = Tags.filter(tagChip => tagChip !== RemoveTag);
        setTags(newTagss)
    }

    const RemoveTagName = RemoveTagEmail => {
        const newTagsNames = NameTags.filter(NameChip => NameChip !== RemoveTagEmail);
        setRemoveNames(newTagsNames)
    }


    const onHide = () => {
        setvisible(false)
    }


    const items = [
        {
            label: "Thesis Collection",
            icon: PrimeIcons.FOLDER_OPEN,
            url: "/admin/collection",
        },
        {
            label: "Import Thesis",
            icon: PrimeIcons.UPLOAD,
            url: "/admin/collection/upload",
        },
    ]

    const header = <Menubar model={items} />

    const courseSelectItem = course.map((dept) => {
        return (
            {
                label: dept.department, value: dept.id,
            }
        )
    });
    const itemcourse = filter.map((dept) => {
        return (
            {
                label: dept.course, value: dept.id,
            }
        )
    });

    const locate = [
        { label: "2nd Floor Library", value: "2nd Floor Library" },
        { label: "3rd Floor Library", value: "3rd Floor Library" },
    ]

    const Upload = (e) => {
        e.preventDefault();
        if (selectdata !== "" && selected !== "") {
            setvisible(true)
        }
        else {
            alert("Please Check Department & Course")
        }
    }

    const Publish = (e) => {

        e.preventDefault();
        const data = new FormData();
        data.append('file', FileDocs.file);
        data.append('file_complete',FileComplete.complete)
        data.append('title', archives.title);
        data.append('description', archives.description);
        data.append('adviser', archives.adviser);
        data.append('department', selected);
        data.append('course', selectdata);
        data.append("names", NameTags);
        data.append('publication', archives.publication);
        data.append('adminkey', localStorage.getItem('auth_id'));
        data.append('keywords', Tags);
        data.append('optional', archives.optional);
        data.append('Year', Year.id);
        data.append('city',archives.city);
        // new data
        data.append('barcode', archives.barcode);
        data.append('year', archives.year);
        data.append('month',date);
        // data.append('location', locationfiles);

        axios.post(`/api/upload`, data).then(res => {
            if (res.data.status === 200) {
                toast.current.show({ severity: 'success', summary: res.data.success, detail: 'Published' });
                setTags([]);
                setRemoveNames([]);
                setLinkTags([])
                setselected([])
                setselectdata([]);
                setlocationfiles([]);
                setbtndis(false)
                setvisible(false)
                archives.adviser = "";
                archives.description = "";
                archives.optional = "";
                archives.publication = "";
                archives.title = "";
                archives.barcode = "";
                archives.year = "";

            }
            else {
                setarchives({ ...archives, error: res.data.error });
                setbtndis(false)
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
                setbtndis(false)
            }
        })
    }
    const footer = (
        <div className=''>
            <Button label="Publish" icon="pi pi-check" className='p-button-sm p-button' onClick={Publish} />
            <Button label="Cancel" icon="pi pi-times" className='p-button-sm p-button-danger' onClick={onHide} />
        </div>
    );





    if (loading) {
        return (
            <h4>Loading...</h4>
        )
    }
    const onSearch = (e) => {
        setTimeout(() => {
            const query = e.query;
            let suggestions;
            if (UserData === "No Accounts") {
                return false;
            }
            else {
                if (!query.trim().length) {
                    suggestions = [...UserData];
                }
                else {
                    suggestions = UserData.filter((email) => {
                        return email.email.toLowerCase().startsWith(query.toLowerCase());
                    });
                }
                setSuggestions(suggestions);
            }
        }, 250);
    }
    const itemTemplate = (suggestion) => {
        return (
            <div className="flex align-items-center">
                <span className="flex flex-column ml-2">
                    <li className='list-item mb-2'><FaUser /> {suggestion.name}</li>
                    <li className='list-item mb-2'> <FaEnvelope /> {suggestion.email}</li>
                    <li className='list-item mb-2'>Department: {suggestion.department}</li>
                    <li className='list-item mb-2'>Course: {suggestion.course}</li>
                </span>
            </div>
        );
    }





    return (
        <div>
            <Toast ref={toast} />
            <Panel headerTemplate={header}>
                {/* <Card className='bg-transparent border-0' title="Thesis Info" subTitle=""> */}
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Author Information">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    {
                                        NameTags.map((NameChip, index) => {
                                            return (
                                                // <span key={index} title={NameChip} className="me-2 bg-primary badge">{NameChip} <FaTimes className='align-middle cursor-pointer' onClick={() => RemoveTagName(NameChip)}></FaTimes></span>
                                                <Badge className='me-3' key={index} value={NameChip} severity="info" onClick={() => RemoveTagName(NameChip)}>{NameChip}</Badge>
                                            )
                                        })
                                    }
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="" className='form-label'>Author Email</label>
                                    <div className="p-inputgroup">
                                        {/* <InputText placeholder="sample.xxx.@urios.edu.ph" keyfilter="email" id='email_user' name='names' /> */}
                                        <Mention className='p-mention p-mention-items' scrollHeight="400px" itemTemplate={itemTemplate} value={emailchoose} onSelect={SelectDataEmail} trigger="@" suggestions={suggestions} id='email_user' name="names" onChange={EmailInput} onSearch={onSearch} field="email" placeholder="Please enter @ Searching Emails" />
                                        <Button icon="pi pi-plus" className="p-button" onClick={AddTagNames} />
                                    </div>
                                </div>

                                <div className="col-md-6 mb-2">
                                    <Dropdown value={selected} id="department" required className="w-100" options={courseSelectItem} onChange={(e) => setselected(e.value)} placeholder="Select Department" />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Dropdown value={selectdata} required className="w-100" placeholder='Choose Course' options={itemcourse} onChange={(e) => setselectdata(e.value)} />
                                </div>
                                <div className="col-md-12 mb-2">
                                    <label htmlFor="" className="form-label text-secondary">
                                        Thesis Adviser
                                    </label>
                                    <InputText keyfilter={/^[^#<>*!]+$/} name="adviser" value={archives.adviser} onChange={handleinput} className="w-100" />
                                    <span className='text-danger'>{archives.error.adviser}</span>
                                </div>
                                <div className="col-md-12 mb-2">
                                    <label className='form-label text-secondary'>Optional Email </label>
                                    <InputText keyfilter="email" name='optional' value={archives.optional} onChange={handleinput} className="w-100" />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Research Information">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12 mb-2">
                                    <label htmlFor="" className="form-label text-secondary">
                                        Title of Study
                                    </label>
                                    {/* <input type="text" name='title' onChange={handleinput} className='form-control' /> */}
                                    <InputText placeholder='' keyfilter={/^[^#<>*!]+$/} name='title' value={archives.title} onChange={handleinput} className="w-100" />
                                    <span className='text-danger'>{archives.error.title}</span>
                                </div>
                                <div className="col-md-12">
                                    {
                                        Tags.map((tagChip, index) => {
                                            return (

                                                <span key={index} className='me-3' onClick={() => RemoveTag(tagChip)}><Badge key={index} className="" value={tagChip}></Badge></span>

                                            )
                                        })
                                    }

                                </div>
                                <div className="col-md-12  mt-3 mb-3">
                                    <label htmlFor="" className='form-label text-secondary'>Keyword (<span className='text-danger'>*<small className='text-info'>Enter atleast 3 Keywords</small>  </span>
                                        <span className='text-danger'>*<small className='text-info'>Please Enter After Inputting Data</small></span>)</label>
                                    <div className="p-inputgroup">
                                        <Button icon="pi pi-plus" className="p-button" onClick={AddKeyword} />
                                        <InputText placeholder="Keyword" id='keyword' name='keyword' />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-1">
                                    <label htmlFor="" className="form-label text-secondary">
                                        BarCode
                                    </label>
                                    {/* <input type="text" name='title' onChange={handleinput} className='form-control' /> */}
                                    <InputText placeholder='3FSUU000####' maxLength={14} keyfilter={/^[^#<>*!]+$/} name='barcode' value={archives.barcode} onChange={handleinput} className="w-100" />
                                    <span className='text-danger'>{archives.error.title}</span>
                                </div>
                                <div className="col-md-3 mb-1">
                                    <label htmlFor="" className="form-label text-secondary">
                                        Month Published
                                    </label>
                                   
                                    <Dropdown className='w-100' required value={date} options={months} onChange={(e) => setDate(e.target.value)} placeholder="Month"></Dropdown>
                                </div>
                                <div className="col-md-3 mb-1">
                                    <label htmlFor="" className="form-label text-secondary">
                                        Year Published
                                    </label>
                                    {/* <input type="text" name='title' onChange={handleinput} className='form-control' /> */}
                                    <InputText placeholder='Year' maxLength={4} keyfilter="int" name='year' value={archives.year} onChange={handleinput} className="w-100" />
                                    <small className=''>EX - (2020)</small>
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label htmlFor="" className="form-label text-secondary">
                                        Abstract
                                    </label>
                                    <InputTextarea name="description" className='w-100 resize-none' value={archives.description} rows={5} cols={5} onChange={handleinput} />
                                    <span className='text-danger'>{archives.error.description}</span>
                                    <span className='text-danger'>*<small className='text-info'>Enter atleast 1000 words</small></span>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel header="Other Info">

                        <div className="container">
                            <form onSubmit={Upload} encType="multipart/form-data">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="" className="form-label text-secondary">
                                            Place of Publications
                                        </label>

                                        <InputText keyfilter={/^[^#<>*!]+$/} name='publication' value={archives.publication} onChange={handleinput} className='w-100' />
                                        <span className='text-danger'>{archives.error.publication}</span>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="" className="form-label text-secondary">
                                            City
                                        </label>
                                        <InputText placeholder='City' name='city' className='w-100' onChange={handleinput} />
                                        {/* <Dropdown className='w-100' name='location' value={locationfiles} options={locate} onChange={(e) => setlocationfiles(e.target.value)} required placeholder='Library Location'>

                                        </Dropdown> */}
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label for="floatingInput" className='text-secondary'>School Year </label>
                                        <InputText readOnly disabled value={Year.school_year} className="w-100" />
                                    </div>
                                    <div className="col-md-6 mt-3">
                                        <label htmlFor="" className="form-label">
                                            Limited PDF
                                        </label>
                                        <br />
                                        <input type="file" onChange={fileHandler} name='file' className='form-file' />
                                        {/* <span className='font-s'><span className='text-danger'>*</span><small className='text-info'>Please Attach PDF File Only</small></span> */}
                                    </div>
                                    <div className="col-md-6 mt-3">
                                        <label htmlFor="" className="form-label">
                                            Full Text PDF
                                        </label>
                                        <br />
                                        <input type="file" onChange={fileHandlerComplete} name='complete' className='form-file' />
                                        {/* <span className='font-s'><span className='text-danger'>*</span><small className='text-info'>Please Attach PDF File Only</small></span> */}
                                    </div>
                                </div>
                                <Button label="Preview" disabled={btndis} className='mt-3 p-button-info p-button-sm' />
                            </form>
                        </div>
                    </TabPanel>
                </TabView>
                {/* </Card> */}
            </Panel>
            <Dialog header={<h4>Preview Details</h4>} visible={visible} footer={footer} onHide={onHide} draggable={false} position="top" breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }}>
                <ImportPreview
                    barcode={archives.barcode}
                    year={archives.year}
                    month={date}
                    location={locationfiles}
                    filename={FileDocs.file}
                    title={archives.title}
                    optional={archives.optional}
                    publication={archives.publication}
                    adviser={archives.adviser}
                    department={selected}
                    course={selectdata}
                    SY={Year.school_year}
                    // filear={FileDocs.file}
                    description={archives.description}
                    nameperson={NameTags}
                    keyword={Tags} />
            </Dialog>
        </div>
    )
}

export default ImportArchives