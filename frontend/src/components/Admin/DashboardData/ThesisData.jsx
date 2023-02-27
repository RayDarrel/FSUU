import React, { useEffect, useState } from 'react'
import { Card } from "primereact/card";
import axios from 'axios';
import swal from 'sweetalert';

function ThesisData() {

    const [rated, setrate] = useState({
        visits: "",
        rate: "",
    });
    const [error, seterror] = useState("");

    const [loading, setloading] = useState(true);
    var format_number = new Intl.NumberFormat();

    useEffect(() => {
        axios.get(`/api/RatedDocument`).then(res => {
            if (res.data.status === 200) {
                setrate({ visits: res.data.count })
            }
            else if(res.data.status === 504){
                seterror(res.data.error);
            }
            setloading(false)
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }, []);
    


    if (loading) {
        return (
            <h4>Loading...</h4>
        )
    }

    return (
        <div>
            <Card title="Overall Thesis" subTitle="List of 5 Most Visited">
                <ul className='list-group'>
                    {
                        (rated.visits === "No Data To Display") ? rated.visits :rated.visits.map((data, id) => {
                            return (
                                <li className="list-list-group" key={id}>
                                    <span className='fst-italic'>{data.name}</span>
                                    <span className="float-end badge rounded-pill bg-primary me-3">

                                    </span>
                                    <span className="float-end badge rounded-pill bg-primary me-3">
                                        {format_number.format(data.total)}
                                    </span>
                                </li>
                            )
                        })
                    }
                </ul>
            </Card>
        </div>
    )
}

export default ThesisData