import React, { useEffect, useState } from 'react'
import { Chart } from 'primereact/chart';
import axios from 'axios';
import swal from 'sweetalert';
import { useQuery } from 'react-query';


function PieChartData() {

    var depart = [];
    var account = [];
    var color = [];
    const query = useQuery('document', async () =>{
        const data = axios.get(`/api/AllAnalyticsDocumentstaff`);
        return data;
    })


    if(query.isLoading){
        return <h4></h4>
    }
    for (let index = 0; index < query.data.data.DocumentsTotal.length; index++) {
        const element = query.data.data.DocumentsTotal[index];
        depart.push(element.department_code)
        account.push(element.totaldocuments);
        color.push(element.color_code)
    }
    const chartData = {
        labels: depart,
        datasets: [
            {
                data: account,
                backgroundColor: color,
            }]
    };


    const lightOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#d4d4d4'
                }
            }
        }
    };

    return (
        <div>
            <h5 className='text-secondary'>Document Details</h5>
            <Chart type="doughnut" id='chart-pie' data={chartData} options={lightOptions} />
        </div>
    )
}

export default PieChartData