import React from 'react'
import { useState } from 'react';
import { Chart } from 'primereact/chart';
import { useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import moment from 'moment';

function VisitsChart({uniq}) {

    const [DataVisits, setVisits] = useState([]);
    const date = [];
    const views = [];
    useEffect(() =>{
        const id =uniq;

        axios.get(`/api/Visitorsdean/${id}`).then(res =>{
            if(res.data.status === 200){
                setVisits(res.data.data);
            }
        }).catch((error) =>{
            if(error.response.status === 500){
                swal("Warning",error.response.statusText,'warning');
            }
        })
    },[])

    for (let index = 0; index < DataVisits.length; index++) {
        const element = DataVisits[index].date;
        date.push(moment(element).format("MMM-D-YYYY"));
    }

    for (let index = 0; index < DataVisits.length; index++) {
        const total = DataVisits[index].views;
        views.push(total)
    }

    const basicData = {
        labels: date,
        datasets: [
            {
                label: 'Visits',
                data: views,
                fill: true,
                borderColor: '#d4d4d4',
                backgroundColor: "#678CA4",
                tension: 0.2,

            },
        ]
    };

    const getLightTheme = ()=>{
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: .6,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
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
            basicOptions
        }
    }

    const { basicOptions } = getLightTheme();

    return (
        <div>
            <h5 className='text-details'>Every Day Visits </h5>
                <Chart type="line" data={basicData} options={basicOptions} style={{height: "300px"}} />
        </div>
    )
}

export default VisitsChart