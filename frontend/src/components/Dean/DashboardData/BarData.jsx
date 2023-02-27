import React from 'react'
import { useState } from 'react';
import { Chart } from 'primereact/chart';
import { useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function BarData() {

    const [BarAllData, setBar] = useState([]);

    var nametitle = [];
    var visit = [];

    useEffect(() =>{
        const data = {
            id: localStorage.getItem('auth_id'),
        }
        axios.post(`/api/BarData`,data).then(res =>{
            if(res.data.status === 200){
                setBar(res.data.analytics);
            }
        }).catch((error) =>{
            if(error.response.status === 500){
                swal("Warning",error.response.statusText,'warning');
            }
        })
    },[])

    for(let index = 0; index < BarAllData.length; index++){
        const title = BarAllData[index].title;
        const visits = BarAllData[index].visits;

        nametitle.push(title)
        visit.push(visits)
    }

    const basicData = {
        labels: nametitle,
        datasets: [
            {
                label: 'Thesis Document',
                backgroundColor: '#42A5F5',
                data: visit,
            },
        ]
    };

    const getLightTheme = () => {
        let basicOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: 'transparent'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: 'transparent'
                    }
                }
            }
        };

        return {
            basicOptions,
        }
    }
    const { basicOptions } = getLightTheme();

    return (
        <div>
            <div className="container">
            <Chart type="bar" data={basicData} options={basicOptions} />
            </div>
        </div>
    )
}

export default BarData