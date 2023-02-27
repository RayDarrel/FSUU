import React, { useState } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';
import { useQuery } from 'react-query';




export default function LineChart() {

    const [RateData, setrate] = useState([])
    const documentStyle = getComputedStyle(document.documentElement);
    const surfaceBorder = documentStyle.getPropertyValue('#207ED6');
    var title = [];
    var visits_count = [];



    const query = useQuery('linedata', async () => {
        const data = await axios.get(`/api/RatedDocumentstaff`);
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
        title.push(element)
        visits_count.push(count)
    }

    const basicData = {
        labels: title,
        datasets: [
            {
                label: "Most Visited Thesis",
                backgroundColor: surfaceBorder,
                data: visits_count,
            },
        ],
    };

    const getLightTheme = () => {
        let basicOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: "white",
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
                        color: "white",
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

    const { basicOptions } = getLightTheme();


    return (
        <div className="">
            {
                RateData === "No Data To Display" ? <center><h4 className='text-light'>No Data To Display</h4></center> : <Chart type="bar" data={basicData} options={basicOptions} />
            }

        </div>
    )
}
