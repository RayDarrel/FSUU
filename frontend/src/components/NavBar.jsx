import React, { useEffect } from 'react'
import { FaGooglePlusG } from 'react-icons/fa'
import GoogleLogin from 'react-google-login';
import { gapi } from "gapi-script";
import { Menubar } from 'primereact/menubar';
import imglogo from '../assets/fsuulogo1.png';
import swal from 'sweetalert';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function NavBar() {

    const history = useHistory();
    const clientId = "412304294703-02o2nablkflhb4m1tql39br8ja2588ts.apps.googleusercontent.com";
    useEffect(() => {
        gapi.load("client:auth2", () => {
            gapi.auth2.init({ clientId: clientId });
        });
    }, []);

    const responseGoogle = (response) => {
        const data = {
            firstname: response.profileObj.givenName,
            lastname: response.profileObj.familyName,
            email: response.profileObj.email,
            ID: response.profileObj.googleId,
        }

        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/login`, data).then(res => {
                if (res.data.status === 200) {
                    swal("Success", res.data.message, "success");
                    // Admin as library
                    if (res.data.role === 1) {
                        history.push("/admin");
                        localStorage.setItem("auth_token", res.data.token);
                        localStorage.setItem("auth_id", res.data.id);
                    }

                    // Students
                    else if (res.data.role === 2) {
                        localStorage.setItem("auth_token", res.data.token);
                        localStorage.setItem("auth_id", res.data.id);
                        history.push('/student');
                    }

                    // Dean
                    else if (res.data.role === 3 || res.data.role === 5) {
                        localStorage.setItem("auth_token", res.data.token);
                        localStorage.setItem("auth_id", res.data.id);
                        history.push('/faculty');
                    }
                }
                else if (res.data.status === 504) {
                    swal("Error", res.data.message, 'error');
                }
                else if (res.data.status === 404) {
                    swal("Warning", res.data.error, "warning");
                }
            }).catch((err) => {
                console.log(err)
                if (err.response.status === 500) {
                    swal("Error", "Internal Server", "error");
                }
            });
        }).catch((error) => {
            if (error.code === "ERR_NETWORK") {
                swal("Error", error.message, "error");
            }
        });
    }

    const items = [
        {
            label: "About",
            url: "/about"
        },
        {
            label: "Contact",
            url: "/contact"
        },
        {
            label: <GoogleLogin
                clientId={clientId}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                theme="light"
                render={renderProps => (
                    <span className='text-danger fw-bold' onClick={renderProps.onClick} disabled={renderProps.disabled}><FaGooglePlusG />Login</span>
                )}
                cookiePolicy={'single_host_origin'} />
        }
    ];

    return (
        <React.Fragment>
            <Menubar model={items} start={
                <div>
                    <a href="/"> <img src={imglogo} alt="Logo" className='img-responsive' width={200}></img></a>
                </div>
            } />
        </React.Fragment>
    )
}

export default NavBar