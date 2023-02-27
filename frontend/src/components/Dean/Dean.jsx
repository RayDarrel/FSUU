import React from 'react'
import { Divider } from 'primereact/divider';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { FaBars, FaDesktop, FaFileCsv, FaFolder, FaHome, FaSearch, FaUsers } from 'react-icons/fa';
import { Menubar } from 'primereact/menubar';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { GoogleLogout } from 'react-google-login';
import swal from 'sweetalert';
import axios from 'axios';
import { Badge, InputText, Panel, Toast } from 'primereact';
import { useRef } from 'react';
import {
    useQuery
} from 'react-query'
import { async } from 'citation-js';
import DeanRoutes from '../../routes/DeanRoutes';
import { useEffect } from 'react';


function Dean() {

    const [slide, setslide] = useState(true);
    const [visible, setVisible] = useState(false)
    const [countmsg, setcount] = useState([]);
    const toast = useRef();
    const clientId = "412304294703-02o2nablkflhb4m1tql39br8ja2588ts.apps.googleusercontent.com";
    const history = useHistory();
    const [UserData, setUser] = useState([]);
    const [loading, setloading] = useState(false);


    useEffect(() =>{
        axios.post(`/api/getinfo/${localStorage.getItem("auth_id")}`).then(res =>{
            if(res.data.status === 200){
                setUser(res.data.Info);
            }
        }).catch((error) =>{
            if(error.response.status === 500){

            }
        })
    },[]);

    // const query = useQuery('info', async () => {
    //     const data = await axios.post(`/api/getinfo/${localStorage.getItem("auth_id")}`);
    //     return data;
    // }, {
        
    // })


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



  

    
   
    
    const items = [
        {
            label: "Compose Message",
            url: '/faculty/message',
        },
        {
            label: <i className="pi pi-envelope p-overlay-badge" style={{ fontSize: '1.2rem' }}> <Badge className='p-badge-danger ' value={''}></Badge></i>,
            url: '/faculty/inbox',
        },
        {
            label: "Sent Items",
            url: '/faculty/sent'
        },

    ];


    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div className={`sidebar ${slide ? "show" : "hide"}`}>
                <div className="sidebar-top">
                    <center><h4 className='text-light'>{UserData.position} - {UserData.department_code}</h4></center>
                    <Divider></Divider>
                </div>
                <div className="sidebar-links">
                    <ul>
                        <h5 className='text-secondary'>Pages</h5>
                        <li>
                            <Link to={'/faculty/search'} className='link-color'>
                                <FaSearch className='me-3' />
                                <span className='link hide'>Search Engine</span>
                            </Link>
                        </li>
                        <li>
                            <a href='/faculty/dashboard' className='link-color'>
                                <FaHome className='me-3' />
                                <span className='link hide'>Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <Link to={'/faculty/collection'} className='link-color'>
                                <FaFolder className='me-3' />
                                <span className='link hide'>Thesis Collections</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/faculty/accounts'} className='link-color'>
                                <FaUsers className='me-3' />
                                <span className='link hide'>Accounts</span>
                            </Link>
                        </li>
                        <br />
                        <h5 className='text-secondary'>Add Data</h5>
                        <li>
                            <Link to={'/faculty/register'} className='link-color'>
                                <FaUsers className='me-3' />
                                <span className='link hide'>Accounts</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/faculty/import'} className='link-color'>
                                <FaFileCsv className='me-3' />
                                <span className='link hide'>Import CSV</span>
                            </Link>
                        </li>
                        <br />
                        <h5 className='text-secondary'>Logs</h5>
                        <li>
                            <Link to={'/faculty/logs'} className='link-color'>
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
                         <Link to={`/faculty/account`}><Button className='p-button-sm p-button-text p-button-info' icon={PrimeIcons.USER} label={UserData.name}></Button></Link>
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
                    {DeanRoutes.map((route, index) => {
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
                    <Redirect from="/faculty" to={"/faculty/search"} />
                </Switch>
            </section>
        </React.Fragment>
    )
}

export default Dean