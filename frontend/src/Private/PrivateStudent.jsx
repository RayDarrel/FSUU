import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Redirect, Route, useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import Student from '../components/Student/Student'


function PrivateStudent({...rest}) {

    const [Authenticated, setAuthenticated] = useState(false);
    const [loading, setloading] = useState(true);
    const history = useHistory();


    useEffect(() =>{
        axios.get(`/api/checkingAuthenticate`).then(res =>{
            if(res.data.status === 200 && res.data.role === 2){
                setAuthenticated(true)
            }
            setloading(false);
        });

        return () =>{
            setAuthenticated(false);
        }
    },[]);


    // Unauthorized code
    axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
        if(err.response.status === 401){
            swal("Unauthorized",err.response.data.message,'warning');
            history.push('/');
        }
        return Promise.reject(err);
    });
    axios.interceptors.response.use(function(response) {   
            return response
        }, function (error) {
            // Forbidden
            if(error.response.status === 403){

                // admin
                if(error.response.data.token === 1){
                    swal("Warning",error.response.data.message,"warning");
                    history.push('/admin')
                }
                // Library
                else if(error.response.data.token === 4){
                    swal("Warning",error.response.data.message,"warning");
                    history.push('/library')
                }
                // Dean
                else if(error.response.data.token === 3){
                    swal("Warning",error.response.data.message,"warning");
                    history.push('/faculty')
                }
            }   
            // Page Not Found
            else if(error.response.status === 404){
                swal('Error',"Page Not Found",'error');
                history.push('/')
            }
         
            return Promise.reject(error);
        }
    );


    if(loading){
        return <h4>Loading...</h4>
    }

  return (
     <Route {...rest}
        render={({props,location}) =>
            Authenticated ?
            (<Student {...rest}/>) :
            (<Redirect to={{pathname: '/', state: {from:location}}}/>)
        }
     
     />
  )
}

export default PrivateStudent