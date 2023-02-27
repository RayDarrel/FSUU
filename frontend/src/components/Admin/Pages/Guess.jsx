import axios from 'axios'
import moment from 'moment'
import { Badge, InputText } from 'primereact'
import React, { useEffect, useState } from 'react'
import DataTable, {createTheme} from 'react-data-table-component'
import { Link } from 'react-router-dom'
import swal from 'sweetalert'

function Guess() {


    createTheme('solarized',{
        background: {
            default: "transparent",
        }
    })

    const [guess, setGuess] = useState([])
    const [searchData, setSearchData] = useState("");
    const [filter, setFilter] = useState([]);

    useEffect(() => {
        axios.post(`/api/guessdata`).then(res => {
            if (res.data.status === 200) {
                setGuess(res.data.guest);
                setFilter(res.data.guest);
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }, [])

    const column = [
        {
            name: "Book Number",
            selector: row => (row.role === 1) ? "GUEST"+"-"+row.bookid : "STUDENT"+"-"+row.bookid,
            sortable: true,
        },
        {
            name: "Email",
            selector: row => row.email,
            sortable: true,
        },
        {
            name: "From",
            selector: row => (row.fromdate === null) ? "" : moment(row.fromdate).format("ll"),
            sortable: true,
        },
        {
            name: "End",
            selector: row => (row.enddate === null) ? "" : moment(row.enddate).format("ll"),
            sortable: true,
        },
        {
            name: "Action",
            cell: row => <Link to={`/admin/book/refid=${row.bookid}`}><Badge value={"Open"} severity="info" /></Link>,
            sortable: true,
        },
        {
            name: "Status",
            selector: row => (row.status === 0) ? <Badge value="No Schedule" severity='danger' /> : (row.status === 1) ? <Badge value="OPEN" severity='success' /> : <Badge value="CLOSED" severity='warning' />,
            sortable: true,
        }
    ]

    useEffect(() =>{
        const result = guess.filter(data =>{
            return data.bookid.match(searchData.toLowerCase());
        })

        setFilter(result)
    },[searchData]);

    return (
        <div>
            <DataTable
                title="Guest Book Data"
                columns={column}
                data={filter}
                noDataComponent="No Guess Data"
                // selectableRows
                pagination
                theme='solarized'
                subHeaderAlign='right'
                subHeader
                subHeaderComponent={
                    <InputText placeholder='Search Book Number' className='w-100' value={searchData} onChange={(e) => setSearchData(e.target.value)} />
                }
            />
        </div>
    )
}

export default Guess