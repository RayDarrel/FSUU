import React, { useState } from 'react'
import { Chart } from 'primereact/chart';
import AccountAnalytics from '../Analytics/ThesisAnalytics';
import PieChartData from '../Analytics/PieChartData';
import LineChart from '../Analytics/LineChart';
import { useEffect } from 'react';
import axios from 'axios';

function Analytics() {

    const [AllData, setAll] = useState([]);
    var department = [];
    var total= [];
    var deptcolor = [];

    const [loading, setlaoding] = useState(false);

    useEffect(() =>{
        axios.get(`/api/AllAccountsSchoolYear`).then(res =>{
            if(res.data.status === 200){
                setAll(res.data.details)
            }
            setlaoding(false);
        }).catch((error) =>{
            if(error.response.status  === 500){

            }
        })
    },[]);

    for (let index = 0; index < AllData.length; index++) {
        const element = AllData[index].department_code;
        const countdata = AllData[index].total;
        const colorcode = AllData[index].color;
        department.push(element);
        total.push(countdata);
        deptcolor.push(colorcode);
    }

    const basicData = {
        labels: department,
        datasets: [
            {
                label: 'Department Account',
                backgroundColor: deptcolor,
                data: total,
            },
        ]
    };
    const getLightTheme = () => {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                legend: {
                    labels: {
                        color: 'gray'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'gray'
                    },
                    grid: {
                        color: 'transparent'
                    }
                },
                y: {
                    ticks: {
                        color: 'gray'
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


    if(loading){
        return (
            <h4></h4>
        )
    }

    return (
        <div>
            <div className="container">
                <div className="row justify-content-space align-items-center">
                    <div className="col-lg-12">
                        <LineChart />
                    </div>
                    <div className="col-lg-6">
                        <PieChartData />
                    </div>
                    <div className="col-lg-6">
                        <Chart type="bar" data={basicData} options={basicOptions} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics