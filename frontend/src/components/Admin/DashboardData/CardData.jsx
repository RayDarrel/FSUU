import React, {useEffect, useState} from 'react'
import { Card } from 'primereact/card';
import axios from 'axios';
import { Badge } from 'primereact/badge';


function CardData() {


    const [Data, setData] = useState({
        Files: "",
        Accounts: "",
        Locked: "",
        Active: "",
    });

    useEffect(() => {
        axios.get(`/api/CountAll`).then(res => {
            if (res.data.status === 200) {
                setData({
                    Files: res.data.files,
                    Accounts: res.data.all,
                    Active: res.data.active,
                    Locked: res.data.notactive,
                });
            }
        }).catch((error) => {
            if (error.response.status === 500) {

            }
        })
    }, []);

    return (
        <div className='mt-1'>
            <div className="row justify-content-space align-items-center">
                <div className="col-lg-3 mb-3">
                    <Card title="Thesis Collections" subTitle="Total Data">
                    <Badge value={Data.Files} severity="warning" size="normal"></Badge>
                    </Card>
                </div>
                <div className="col-lg-3 mb-3">
                    <Card title="All Accounts" subTitle="Total Data">
                    <Badge value={Data.Accounts} severity="info" size="normal"></Badge>
                    </Card>
                </div>
                <div className="col-lg-3 mb-3">
                    <Card title="Active Accounts" subTitle="Total Data">
                    <Badge value={Data.Active} severity="success" size="normal"></Badge>
                    </Card>
                </div>
                <div className="col-lg-3 mb-3">
                    <Card title="Inactive Accounts" subTitle="Total Data">
                    <Badge value={Data.Locked} severity="danger" size="normal"></Badge>
                    </Card>
                </div>
            </div>

        </div>
    )
}

export default CardData