import React from 'react'
import { Divider } from 'primereact/divider';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { FaBars, FaBook, FaBuilding, FaChartLine, FaDatabase, FaDesktop, FaEnvelopeOpen, FaFileCsv, FaFolder, FaHome, FaObjectGroup, FaSearch, FaTrash, FaUsers } from 'react-icons/fa';
import { Menubar } from 'primereact/menubar';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { GoogleLogout } from 'react-google-login';
import swal from 'sweetalert';
import axios from 'axios';
import { gapi } from "gapi-script";
import AdminRoutes from '../../routes/AdminRoutes';
import { Dialog } from 'primereact/dialog';
import { Badge, InputText, Panel, Toast } from 'primereact';
import { useRef } from 'react';
import { useEffect } from 'react';


function Admin() {

    const [slide, setslide] = useState(true);
    const [visible, setVisible] = useState(false)
    const [countmsg, setcount] = useState([]);
    const toast = useRef();
    const clientId = "412304294703-02o2nablkflhb4m1tql39br8ja2588ts.apps.googleusercontent.com";
    const history = useHistory();
    const [currentyear, setyear] = useState([]);
    const [loading, setloading] = useState(false);
    const [SchoolYear, setSchool] = useState({
        newyear: "",
    });

    useEffect(() => {
        gapi.load("client:auth2", () => {
            gapi.auth2.init({ clientId: clientId });
        });
    }, []);

    useEffect(() => {
        axios.get(`/api/currentYear`).then(res => {
            if (res.data.status === 200) {
                setyear(res.data.YearData);
            }
            setloading(false);
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'status');
            }
        })
    }, []);

    // const query = useQuery('msg', async () => {
    //     const data = await axios.post(`/api/CountMsg/${localStorage.getItem("auth_id")}`);
    //     return data;
    // }, {
    // });


    const Logout = (e) => {
        axios.post(`/api/logout`).then(res => {
            if (res.data.status === 200) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_id');
                swal('Success', res.data.message, 'success');

                history.push('/');
            }
        });
    }

    const ShowModal = (e) => {
        setVisible(true)
    }

    const SideSlide = () => {
        setslide(slide => !slide);
    }

    const handleinputsy = (e) => {
        e.persist();
        setSchool({ ...SchoolYear, [e.target.name]: e.target.value });
    }



    const first = parseInt(currentyear.school_year) + 1;
    const second = parseInt(first) + 1;

    const sy = first + "-" + second;

    const NewSchool = (e) => {
        e.preventDefault();

        const data = {
            newyear: sy,
        }

        axios.post(`/api/AddYear`, data).then(res => {
            if (res.data.status === 200) {
                toast.current.show({ severity: "success", summary: res.data.success, details: "School Year Changed" });
                setTimeout(() => {
                    setVisible(false);

                }, 900);
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'status');
            }
        })
    }

    // if (query.isLoading) {
    //     return <h4></h4>
    // }


    // { query.isLoading && <h4>Loading...</h4> }
    
    const items = [
        {
            label: <span onClick={ShowModal}>New School Year</span>,
            icon: PrimeIcons.PLUS,

        },
        {
            label: "Compose Message",
            url: '/admin/message',
        },
        {
            label: <i className="pi pi-envelope p-overlay-badge" style={{ fontSize: '1.2rem' }}> <Badge className='p-badge-danger ' value={''}></Badge></i>,
            url: '/admin/inbox',
        },
        {
            label: "Sent Items",
            url: '/admin/sent'
        },

    ];


    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div className={`sidebar ${slide ? "show" : "hide"}`}>
                <div className="sidebar-top">
                    <center><h4 className='text-light fw-bold'>ADMIN</h4></center>
                    <Divider></Divider>
                </div>
                <div className="sidebar-links">
                    <ul>
                        <h5 className='text-secondary'>Pages</h5>
                        <li>
                            <Link to={'/admin/search'} className='link-color'>
                                <FaSearch className='me-3' />
                                <span className='link hide'>Search Engine</span>
                            </Link>
                        </li>
                        <li>
                            <a href='/admin/dashboard' className='link-color'>
                                <FaHome className='me-3' />
                                <span className='link hide'>Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <Link to={'/admin/collection'} className='link-color'>
                                <FaFolder className='me-3' />
                                <span className='link hide'>Thesis Collections</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/accounts'} className='link-color'>
                                <FaUsers className='me-3' />
                                <span className='link hide'>Accounts</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/school'} className='link-color'>
                                <FaDatabase className='me-3' />
                                <span className='link hide'>School Year</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/booking'} className='link-color'>
                                <FaBook className='me-3' />
                                <span className='link hide'>Booking Data</span>
                            </Link>
                        </li>
                        <br />
                        <h5 className='text-secondary'>Register Data</h5>
                        <li>
                            <Link to={'/admin/register'} className='link-color'>
                                <FaUsers className='me-3' />
                                <span className='link hide'>Accounts</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/department'} className='link-color'>
                                <FaBuilding className='me-3' />
                                <span className='link hide'>Department</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/import'} className='link-color'>
                                <FaFileCsv className='me-3' />
                                <span className='link hide'>Import CSV</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/delete'} className='link-color text-danger'>
                                <FaTrash className='me-3 text-danger' />
                                <span className='link hide text-danger'>Delete Data</span>
                            </Link>
                        </li>
                        <br />
                        <h5 className='text-secondary'>Data</h5>
                        <li>
                            <Link to={'/admin/analytics'} className='link-color'>
                                <FaChartLine className='me-3' />
                                <span className='link hide'>Analytics</span>
                            </Link>
                        </li>
                        <br />
                        <h5 className='text-secondary'>Logs</h5>
                        <li>
                            <Link to={'/admin/logs'} className='link-color'>
                                <FaDesktop className='me-3' />
                                <span className='link hide'>Activity Logs</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <section className={`main ${slide ? "on" : "off"}`}>
                <Menubar model={items}
                    start={<div>

                        <Button onClick={SideSlide} className='p-button-sm border-0 bg-transparent me-3'><FaBars className='fs-4 text-secondary' /></Button>
                        {/* <Button onClick={ShowModal} className='p-button-sm border-0 bg-transparent me-3' icon="pi pi-fw pi-plus" label='New School Year'></Button> */}
                    </div>}
                    end={<div>
                        {/* <Dropdown className='border-0 bg-transparent' placeholder='Library' /> */}
                        {/* <Button className='p-button-sm p-button-text p-button-info' icon={PrimeIcons.USER} label='Library'></Button> */}
                        <GoogleLogout
                            clientId={clientId}
                            onLogoutSuccess={Logout}
                            render={renderProps => (
                                <Button className='p-button-danger p-button-sm p-button-text' onClick={renderProps.onClick} disabled={renderProps.disabled} icon={PrimeIcons.SIGN_OUT} iconPos="right" label='Logout'></Button>
                            )}
                        >
                        </GoogleLogout>
                    </div>}
                />

                <Dialog header={<h4 className='text-secondary'>New School Year</h4>} visible={visible} position="top" style={{ width: '50vw' }} onHide={() => setVisible(false)} draggable={false} resizable={false}>
                    <Panel>
                        <form onSubmit={NewSchool} id="reset">
                            <div className="row">
                                <div className="col-lg-12 mb-3">
                                    <label htmlFor="" className='form-label text-secondary'>Previous School Year</label>
                                    <InputText className='w-100' value={currentyear.school_year} readOnly />
                                </div>
                                <div className="col-lg-12 mb-3">
                                    <label htmlFor="" className='form-label text-secondary'>New School Year</label>
                                    <InputText className='w-100' name='sy' readOnly value={sy} onChange={handleinputsy} />
                                </div>
                            </div>
                            <Button className='p-button-sm' label='New School Year'></Button>
                        </form>
                    </Panel>
                </Dialog>

                <div className="mt-3 py-2">

                </div>

                <Switch>
                    {AdminRoutes.map((route, index) => {
                        return (
                            route.component && (
                                <Route
                                    key={index}
                                    path={route.path}
                                    exact={route.exact}
                                    name={route.name}
                                    render={(props) => <route.component {...props} />}
                                />
                            )
                        );
                    })}
                    <Redirect from="/admin" to={"/admin/search"} />
                </Switch>
            </section>
        </React.Fragment>
    )
}

export default Admin