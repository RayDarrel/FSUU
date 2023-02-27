import axios from 'axios';
import { Badge, Card } from 'primereact'
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import swal from 'sweetalert';

function DashCard() {

    const [AllData, setData] = useState({
        thesis: "",
        all: "",
        active: "",
        notactive: "",
    });

    useEffect(() =>{
        const data ={
            id: localStorage.getItem('auth_id'),
        }
        axios.post(`/api/Dashboard`,data).then(res =>{
            if(res.data.status === 200){
                setData({
                    thesis: res.data.thesis,
                    all: res.data.all,
                    active: res.data.active,
                    notactive: res.data.not,
                })
            }
        }).catch((error) =>{
            if(error.response.status === 500){
                swal("Warning",error.response.statusText,'warning');
            }
        })
    },[]);

    return (
        <div>
            <div className="container">
                <div className="row justify-content-space">
                    <div className="col-lg-3 mb-3">
                        <Card title="Thesis Collection" subTitle="Total">
                            <Badge value={AllData.thesis} severity="warning"></Badge>
                        </Card>
                    </div>
                    <div className="col-lg-3 mb-3">
                        <Card title="All Accounts" subTitle="Total">
                            <Badge value={AllData.all} severity="info"></Badge>
                        </Card>
                    </div>
                    <div className="col-lg-3 mb-3">
                        <Card title="Active Account" subTitle="Total">
                            <Badge value={AllData.active} severity={'success'}></Badge>
                        </Card>
                    </div>
                    <div className="col-lg-3 mb-3">
                        <Card title="Deactivate Account" subTitle="Total">
                            <Badge value={AllData.notactive} severity="danger"></Badge>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashCard