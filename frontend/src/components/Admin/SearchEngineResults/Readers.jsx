import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Chart } from 'primereact/chart';
import swal from 'sweetalert';
import DataTable, {createTheme} from 'react-data-table-component';

function Readers() {

    const [readers, setReaders] = useState([]);

    var type_readers = [];
    var total_readers = [];

    createTheme('solarized', {
        text: {

            // text row color
            primary: '#424242',
            // footer text color
            secondary: '#2aa198',
        },
        background: {
            // background Datable
            default: 'transparent',
        },
        context: {

            // contect background color
            background: '#24262e',
            text: '#FFFFFF',
        },
        divider: {

            // Lines 
            default: '#BBBBBB',
        },
        action: {
            button: 'rgba(0,0,0,.54)',
            hover: 'rgba(0,0,0,.08)',
            disabled: 'rgba(0,0,0,.12)',
        },
    }, 'dark');


    useEffect(() => {
        axios.get(`/api/Readers`).then(res => {
            if (res.data.status === 200) {
                setReaders(res.data.readers);
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }, []);

    const column = [
        {
            name: "Readers",
            selector: row => row.Readers,
            sortable: true,
        },
        {
            name: "Total Readers",
            selector: row => row.total,
            sortable: true,
        },
    ]

    for (let index = 0; index < readers.length; index++) {
        const type = readers[index].Readers;
        const total = readers[index].total;

        type_readers.push(type)
        total_readers.push(total);
    }


    const basicData = {
        labels: type_readers,
        datasets: [
            {
                label: "Readers",
                backgroundColor: '#2654AE',
                data: total_readers,
            },
        ],
    }

    const getLightTheme = () => {
        let basicOptions = {
            indexAxis: 'y',
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

    const { basicOptions } = getLightTheme();

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <DataTable 
                            title="Readers Data"
                            columns={column}
                            responsive={true}
                            data={readers}
                            theme="solarized"
                            selectableRows
                        />
                    </div>
                    <div className="col-lg-6">
                        <Chart type="bar" data={basicData} options={basicOptions} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Readers