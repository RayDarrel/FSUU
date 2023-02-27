import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import axios from "axios";


function BarAccounts({ id }) {
    const [DepartmentNames, setDepartment] = useState([]);
    const [AccountsTotal, setTotal] = useState([]);
    const [loading, setloading] = useState(true);
    const [filter, setfilter] = useState([]);
    var depart = [];
    var account = [];
    var colorcode = [];

    useEffect(() => {
        axios.post(`/api/AnalyticsDepartmentYear/${id}`).then((res) => {
            if (res.data.status === 200) {
                setDepartment(res.data.analytics);
                setTotal(res.data.count);
                setfilter(res.data.count);
            }
            setloading(false);
        }).catch((error) => {
            if (error.response.status === 500) {
            }
        });
    }, []);



  

    for (let index = 0; index < DepartmentNames.length; index++) {
        const element = DepartmentNames[index];
        const colorbar = DepartmentNames[index].color;
        depart.push(element.department_code);
        colorcode.push(colorbar);
    }

    for (let index = 0; index < filter.length; index++) {
        const element = filter[index];
        account.push(element.total);
    }


    const basicData = {
        labels: depart,
        datasets: [
            {
                label: "Department Accounts",
                backgroundColor: colorcode,
                data: account,
            },
        ],
    };

    const getLightTheme = () => {
        let basicOptions = {
            
            maintainAspectRatio: false,
            aspectRatio: 0.8,
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
                        color: "gray",
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

    if (loading) {
        return (
            <h4></h4>
        )
    }

    return (
        <div>
            {/* <h5 className="text-secondary">Accounts Details</h5> */}
            {
                DepartmentNames === "No Data" ? <center>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "150px" }}>
                        <h4 className="text-color-code">No Registered Account</h4>
                    </div>
                </center> :
                    <Chart type="bar" data={basicData} options={basicOptions} />
            }
        </div>
    );
}

export default BarAccounts;
