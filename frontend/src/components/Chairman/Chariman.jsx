import React from 'react'
import { Divider } from 'primereact/divider';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { FaBars, FaBuilding, FaChartLine, FaDatabase, FaEnvelopeOpen, FaFileCsv, FaFolder, FaHeart, FaHome, FaObjectGroup, FaSearch, FaTrash, FaUsers } from 'react-icons/fa';
import { Menubar } from 'primereact/menubar';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { GoogleLogout } from 'react-google-login';
import swal from 'sweetalert';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Badge, InputText, Panel, Toast } from 'primereact';
import { useRef } from 'react';
import { useEffect } from 'react';
import ChairmanRoutes from '../../routes/ChairmanRoutes';

function Chariman() {

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

    
   


    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div className={`sidebar ${slide ? "show" : "hide"}`}>
                <div className="sidebar-top">
                    <center><h4>Chairman</h4></center>
                    <Divider></Divider>
                </div>
                <div className="sidebar-links">
                    <ul>
                        <h5 className='text-secondary'>Pages</h5>
                        <li>
                            <a href='/staff/search' className='link-color'>
                                <FaSearch className='me-3' />
                                <span className='link hide'>Search Engine</span>
                            </a>
                        </li>
                        {/* <li>
                            <a href='/staff/dashboard' className='link-color'>
                                <FaHome className='me-3' />
                                <span className='link hide'>Dashboard</span>
                            </a>
                        </li> */}
                        <li>
                            <Link to={'/staff/collection'} className='link-color'>
                                <FaFolder className='me-3' />
                                <span className='link hide'>Thesis Collections</span>
                            </Link>
                        </li>
                        {/* <li>
                            <Link to={'/staff/school'} className='link-color'>
                                <FaDatabase className='me-3' />
                                <span className='link hide'>School Year</span>
                            </Link>
                        </li> */}
                        {/* <li>
                            <Link to={'/staff/school'} className='link-color'>
                                <FaHeart className='me-3' />
                                <span className='link hide'>Favorite</span>
                            </Link>
                        </li> */}
                        <br />
                        
                  
                        <br />
                        <h5 className='text-secondary'>Data</h5>
                        <li>
                            <Link to={'/staff/analytics'} className='link-color'>
                                <FaChartLine className='me-3' />
                                <span className='link hide'>Analytics</span>
                            </Link>
                        </li>
                   
                    </ul>
                </div>
            </div>
            <section className={`main ${slide ? "on" : "off"}`}>
                <Menubar
                    start={<div>

                        <Button onClick={SideSlide} className='p-button-sm border-0 bg-transparent me-3'><FaBars className='fs-4' /></Button>
                        {/* <Button onClick={ShowModal} className='p-button-sm border-0 bg-transparent me-3' icon="pi pi-fw pi-plus" label='New School Year'></Button> */}
                    </div>}
                    end={<div>
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
                    {ChairmanRoutes.map((route, index) => {
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
                    <Redirect from="/staff" to={"/staff/search"} />
                </Switch>
            </section>
        </React.Fragment>
    )
}

export default Chariman