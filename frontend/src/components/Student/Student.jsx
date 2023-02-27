import React from 'react'
import { Divider } from 'primereact/divider';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { FaBars, FaBook, FaBuilding, FaChartLine, FaCode, FaDatabase, FaDownload, FaEnvelopeOpen, FaFileCsv, FaFolder, FaHeart, FaHome, FaObjectGroup, FaPen, FaSearch, FaTrash, FaUsers } from 'react-icons/fa';
import { Menubar } from 'primereact/menubar';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { GoogleLogout } from 'react-google-login';
import swal from 'sweetalert';
import axios from 'axios';
import StudentRoutes from '../../routes/StudentRoutes';
import {InputText} from 'primereact/inputtext'
import { useEffect } from 'react';

function Student() {

    const [slide, setslide] = useState(true);
    const [userdata , setUser] = useState([]);
    const clientId = "412304294703-02o2nablkflhb4m1tql39br8ja2588ts.apps.googleusercontent.com";
    const history = useHistory();

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

    useEffect(() =>{
        axios.post(`/api/StudentInfo/${localStorage.getItem('auth_id')}`).then(res =>{
            if(res.data.status === 200){
                setUser(res.data.Data);
            }
        }).catch((error) =>{
            if(error.response.status === 500){

            }
        })
    },[]);



    const SideSlide = () => {
        setslide(slide => !slide);

    }

    return (
        <React.Fragment>
            <div className={`sidebar ${slide ? "show" : "hide"}`}>
                <div className="sidebar-top">
                    <center><h4 className='text-light'>Student</h4></center>
                    <Divider></Divider>
                </div>
                <div className="sidebar-links">
                    <ul>
                        <h5 className='text-secondary'>Pages</h5>
                        <li>
                            <Link to={'/student/search'} className='link-color'>
                                <FaSearch className='me-3' />
                                <span className='link hide'>Search Engine</span>
                            </Link>
                        </li>
                        {/* <li>
                            <a href='/student/dashboard' className='link-color'>
                                <FaHome className='me-3' />
                                <span className='link hide'>Dashboard</span>
                            </a>
                        </li> */}
                        
                        {/* <li>
                            <Link to={'/student/code'} className='link-color'>
                                <FaCode className='me-3' />
                                <span className='link hide'>BARCODE</span>
                            </Link>
                        </li> */}
                        {/* <li>
                            <Link to={'/student/code'} className='link-color'>
                                <FaHeart className='me-3' />
                                <span className='link hide'>Favorite</span>
                            </Link>
                        </li> */}
                        
                        <br />
                        <h5 className='text-secondary'>Message</h5>
                        <li>
                            <Link to={'/student/compose'} className='link-color'>
                                <FaPen className='me-3' />
                                <span className='link hide'>Compose Message</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/student/inbox'} className='link-color'>
                                <FaEnvelopeOpen className='me-3' />
                                <span className='link hide'>Inbox</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/student/items'} className='link-color'>
                                <FaDownload className='me-3' />
                                <span className='link hide'>Sent Items</span>
                            </Link>
                        </li>
                        <br />
                        <h5 className='text-secondary'>Booking</h5>
                        <li>
                            <Link className='link-color' to={'/student/status'}>
                            <FaBook className='me-3' />
                                <span className='link hide'>Status</span>
                            </Link>
                        </li>
                        <br />
                        <h5 className='text-secondary'>Logs</h5>
                        <li>
                            <Link className='link-color' to={'/student/logs'}>
                            <FaBook className='me-3' />
                                <span className='link hide'>Activity Logs</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <section className={`main ${slide ? "on" : "off"}`}>
                <Menubar
                    start={<div><Button onClick={SideSlide} className='p-button-sm border-0 bg-transparent me-3'><FaBars className='fs-4 text-secondary' /></Button>
                    
                    </div>}
                    end={<div>
                        {/* <Dropdown className='border-0 bg-transparent' placeholder='Library' /> */}
                        <Link to={'/student/account'}><Button className='p-button-sm p-button-text p-button-info' icon={PrimeIcons.USER} label={userdata.name}></Button></Link>
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

                <div className="mt-3 py-2">
                    
                </div>
                
                <Switch>
                    {StudentRoutes.map((route, index) => {
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
                    <Redirect from="/student" to={"/student/search"} />
                </Switch>
            </section>
        </React.Fragment>
    )
}

export default Student