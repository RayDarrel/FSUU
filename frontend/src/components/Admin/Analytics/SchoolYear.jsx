import axios from "axios";
import { Badge, Button, Divider, Menubar } from "primereact";
import { Panel } from "primereact/panel";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import ThesisAnalytics from "./ThesisAnalytics";
import BarAccounts from "./BarAccounts";
import ThesisDatatable from "./ThesisDatatable";
import AccountsTables from "./AccountsTables";

function SchoolYear(props) {
    const [DataDetails, setDataDetails] = useState([]);
    const [schooldetails, setschool] = useState([]);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const id = props.match.params.id;

        axios.get(`/api/AccountInfoCount/${id}`).then((res) => {
            if (res.data.status === 200) {
                setDataDetails(res.data.department);
            }
            setloading(false);
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, "warning");
            }
        });
    }, [props.match.params.id]);

    useEffect(() =>{
        axios.post(`/api/SchoolYearDetails/${props.match.params.id}`).then(res =>{
            if(res.data.status === 200){
                setschool(res.data.details)
            }
            setloading(false)
        }).catch((error) =>{
            if(error.response.status === 500){
                swal("Warning",error.response.statusText,'warning');
            }
        })
    },[]);

    if (loading) {
        return <h4>Loading Data....</h4>;
    }
    const items = [
        {
            label: "Return Page",
            url: `/admin/school`,
        },
        {
            label: `School Year Details ${schooldetails.school_year}`,
            url: `/admin/yeardetails/refid=${props.match.params.id}`
        }
    ]

    const header = <Menubar model={items} end={<Link to={'/admin/school'}><Button className="p-button-sm p-button-text text-light" label="Return Page"></Button></Link>} />
    return (

        <Panel headerTemplate={header}>
            <div className="row justify-content-space">
                <Divider>
                    <Badge value="Thesis Document Data"></Badge>
                </Divider>
                <div className="col-lg-6">
                    <ThesisDatatable id={props.match.params.id} />
                </div>
                <div className="col-lg-6">
                    <ThesisAnalytics id={props.match.params.id} />
                </div>
                <Divider>
                    <Badge value="Account Details Data"></Badge>
                </Divider>
                <div className="col-lg-6">
                    {/* <ThesisDatatable /> */}
                    <AccountsTables id={props.match.params.id} />
                </div>
                <div className="col-lg-6">
                    <BarAccounts id={props.match.params.id} />
                </div>
            </div>
        </Panel>

    );
}

export default SchoolYear;
