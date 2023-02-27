import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Redirect, Route, useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import Dean from '../components/Dean/Dean';



function PrivateDean({...rest}) {

    const [Authenticated, setAuthenticated] = useState(false);
    const [loading, setloading] = useState(true);
    const history = useHistory();


    useEffect(() =>{
        axios.get(`/api/checking`).then(res =>{
            if(res.data.status === 200 && res.data.role === 3 || res.data.status === 200 && res.data.role === 5){
                setAuthenticated(true)
            }    
            setloading(false);
        }).catch((error) =>{
            if(error.response.status === 500){
                swal("Warning",error.response.statusText, 'warning');
            }
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
                // Student 
                if(error.response.data.token === 2){
                    swal("Warning",error.response.data.message,"warning");
                    history.push('/student')
                }
                // Library
                else if(error.response.data.token === 4){
                    swal("Warning",error.response.data.message,"warning");
                    history.push('/library')
                }
                // admin
                else if(error.response.data.token === 1){
                    swal("Warning",error.response.data.message, "warning");
                    history.push('/admin');
                }
                // department
                else if(error.response.data.token === 6){
                    swal("Warning",error.response.data.message, "warning");
                    history.push('/department');
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
            (<Dean {...rest} />) :
            (<Redirect to={{pathname: '/', state: {from:location}}}/>)
        }
     
     />
  )
}

export default PrivateDean