import React, { useRef, useState } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';
import { useQuery } from 'react-query';
import {Bar, getElementAtEvent} from 'react-chartjs-2'

export default function LineChart() {

    const [RateData, setrate] = useState([])
    const documentStyle = getComputedStyle(document.documentElement);
    const surfaceBorder = documentStyle.getPropertyValue('#207ED6');
    const chartref = useRef();
    var title = [];
    var visits_count = [];
    var linksaccess = [];


    const query = useQuery('linedata', async () => {
        const data = await axios.get(`/api/RatedDocument`);
        return data;

    }, {
        // staleTime: 0,
        // refetchOnMount: 'always'
    })
    // console.log(query.data.data.count)
    if (query.isLoading) {
        return <h4></h4>
    }

    for (let index = 0; index < query.data.data.count.length; index++) {
        const element = query.data.data.count[index].name;
        const count = query.data.data.count[index].total;
        const access = `/admin/document/refid=${query.data.data.count[index].uniq_key}`;
        title.push(element)
        visits_count.push(count)
        linksaccess.push(access)
    }

    const basicData = {
        labels: title,
        datasets: [
            {
                label: "Most Visited Thesis",
                backgroundColor: '#2654AE',
                data: visits_count,
                links: linksaccess,
            },
        ],
        
    };


    const getLightTheme = () => {
        let basicOptions = {
            indexAxis: 'x',
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    labels: {
                        color: "gray",
                    },

                },
            },
            scales: {
                x: {
                    ticks: {
                        color: "#495057",
                    },
                    grid: {
                        color: "transparent",
                    },
                },
                y: {
                    ticks: {
                        color: "gray",
                    },
                    grid: {
                        color: "transparent",
                    },
                },
            },
           
        };
        return {
            basicOptions,
        };
    };

    const display = (e) =>{
        if(getElementAtEvent(chartref.current, e).length > 0){
            const datasetIndex = getElementAtEvent(chartref.current,e)[0].datasetIndex;
            const datapoints = getElementAtEvent(chartref.current,e)[0].index;

            // console.log(basicData.datasets[datasetIndex].links[datapoints]);
            window.open(
                basicData.datasets[datasetIndex].links[datapoints],
                '_blank'
            )
        }
        else{
            return false;
        }
    }

    const { basicOptions } = getLightTheme();


    return (
        <div className="">
            {
                RateData === "No Data To Display" ? <center><h4 className='text-light'>No Data To Display</h4></center> : <Bar type="bar" ref={chartref} onClick={display} data={basicData} options={basicOptions} />
            }

        </div>
    )
}
