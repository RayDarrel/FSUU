import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Redirect, Route, useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import Admin from '../components/Admin/Admin';



function PrivateAdmin({ ...rest }) {

    const [Authenticated, setAuthenticated] = useState(false);
    const [loading, setloading] = useState(true);
    const history = useHistory();
    useEffect(() => {
        axios.get(`/api/checkingAuthenticated`).then(res => {
            if (res.data.status === 200 && res.data.role === 1) {
                setAuthenticated(true)
            }
            setloading(false);
        }).catch((err) => {
            if (err.response.status === 500) {
                swal("Warning", err.response.statusText, 'warning');
                history.push('/');
            }
        });

        return () => {
            setAuthenticated(false);
        }
        // eslint-disable-next-line
    }, []);


    // Unauthorized code
    axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
        if (err.response.status === 401) {
            swal("Unauthorized", err.response.data.message, 'warning');
            history.push('/');
        }
        return Promise.reject(err);
    });
    axios.interceptors.response.use(function (response) {
        return response
    }, function (error) {

        // Forbidden
        if (error.response.status === 403) {
            // Student
            if (error.response.data.token === 2) {
                swal("Warning", error.response.data.message, "warning");
                history.push('/student')
            }
            // Dean
            else if (error.response.data.token === 3) {
                swal("Warning", error.response.data.message, "warning");
                history.push('/faculty');
            }
        }
        // Page Not Found
        else if (error.response.status === 404) {
            swal('Error', "Page Not Found", 'error');
            history.push('/')
        }
        return Promise.reject(error);
    }
    );


    if (loading) {
        return <h4></h4>
    }

    return (
        <Route {...rest}
            render={({ props, location }) =>
                Authenticated ?
                    (<Admin {...rest} />) :
                    (<Redirect to={{ pathname: '/', state: { from: location } }} />)
            }

        />
    )
}

export default PrivateAdmin