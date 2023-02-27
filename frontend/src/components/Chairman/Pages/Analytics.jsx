import { async } from 'citation-js'
import React from 'react'
import { useQuery } from 'react-query'
import axios from 'axios';
import { Chart } from 'primereact/chart';
import PieChartData from '../Analytics/PieChartData';
import LineChart from '../Analytics/LineChart';

function Analytics() {

    var department = [];
    var total = [];
    var deptcolor = [];

    const query = useQuery('all', async () => {
        const data = await axios.get(`/api/AllAccountsSchoolYearstaff`);
        return data;
    }, {

    })

    if (query.isLoading) {
        return <h4>Loading</h4>
    }

    for (let index = 0; index < query.data.data.details.length; index++) {
        const element = query.data.data.details[index].department_code;
        const countdata = query.data.data.details[index].total;
        const colorcode = query.data.data.details[index].color;
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
                        color: 'white'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#d4d4d4'
                    },
                    grid: {
                        color: 'transparent'
                    }
                },
                y: {
                    ticks: {
                        color: '#d4d4d4'
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