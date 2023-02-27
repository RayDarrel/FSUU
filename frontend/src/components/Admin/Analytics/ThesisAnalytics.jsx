import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import axios from "axios";

function ThesisAnalytics({ id }) {
    const [AccountsTotal, setTotal] = useState([]);
    var depart = [];
    var account = [];
    var color = [];

    useEffect(() => {
        axios.post(`/api/AnalyticsDocuments/${id}`).then((res) => {
            if (res.data.status === 200) {
                setTotal(res.data.DocumentsTotal);
            }
        }).catch((error) => {
            if (error.response.status === 500) {
            }
        });
    }, []);

    for (let index = 0; index < AccountsTotal.length; index++) {
        const element = AccountsTotal[index].department_code;
        depart.push(element);
    }
    for (let index = 0; index < AccountsTotal.length; index++) {
        const element = AccountsTotal[index];
        account.push(element.totaldocuments);
        color.push(element.color_code);

    }

  


    const chartData = {
        labels: depart,
        datasets: [
            {
                data: account,
                backgroundColor: color,
            },
        ],
    };

    const [lightOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: "gray",
                },
            },
        },
    });

    return (
        <div>
            {/* <h5 className="text-secondary">Thesis Collection</h5> */}
            {
                AccountsTotal === "No Data" ? <center>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "150px" }}>
                        <h4 className="text-color-code">There are no records to display</h4>
                    </div>
                </center> : <Chart
                    type="doughnut"
                    data={chartData}
                    options={lightOptions}
                    style={{
                        position: "relative",
                        width: "60%",
                        margin: "auto auto",
                    }}
                />
            }
        </div>
    );
}

export default ThesisAnalytics;
