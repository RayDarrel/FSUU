import React, { useEffect, useRef, useState } from 'react'
import DataTable, {createTheme} from 'react-data-table-component'
import { Link } from 'react-router-dom';
import axios from 'axios';
import differenceBy from 'lodash.differenceby';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';


function Student() {
    const [TextBtn, setTextBtn] = useState("Upload");
    const [btndis, setbtndis] = useState(false);
    const [students, setstudent] = useState([]);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [toggleCleared, setToggleCleared] = React.useState(false);
    const [searchData, setSearchData] = useState("");
    const [filter, setfilter] = useState([]);

    const toast = useRef();


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

    const StudentData = async () => {
        try {
            await axios.get('/api/StudentData').then(res => {
                if (res.data.status === 200) {
                    setstudent(res.data.Data);
                    setfilter(res.data.Data);
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    const contextActions = React.useMemo(() => {
        const handleDelete = (e) => {

            if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(row => row.id)}?`)) {
                const data = selectedRows.map((row) => row.id);
                axios.post(`/api/delete/${data}`).then(res => {
                    if (res.data.status === 200) {
                        setToggleCleared(!toggleCleared);
                        setfilter(differenceBy(filter, selectedRows, 'email'));
                        toast.current.show({ severity: 'success', summary: res.data.message, detail: 'Deleted' });
                    }
                });
            }
        };
        return (
            <button key="delete" className='btn btn-sm btn-danger' onClick={(e) => handleDelete(e)} style={{ backgroundColor: 'red' }} icon="true">
                Delete
            </button>
        );
    }, [filter, selectedRows, toggleCleared]);

    useEffect(() => {
        const result = students.filter(data => {
            return data.idnumber.match(searchData.toLowerCase());
        })
        setfilter(result);
        // eslint-disable-next-line  
    }, [searchData]);


    useEffect(() => {
        StudentData();
    }, []);
    const columns = [
        {
            name: "ID Number",
            selector: (row) => row.idnumber,
            sortable: true,
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Status",
            cell: (row) => row.is_active === 1 ? <Badge value="Active" severity='success'></Badge> : <Badge value={"Deactivated"} severity="danger"></Badge>,
            sortable: true
        },
        {
            name: "Action",
            cell: row => <Link to={`/admin/account/refid=${row.id}`}><Badge value="Details" severity='info'></Badge></Link>,
            sortable: true,
        },
    ]



    return (
        <React.Fragment>
            <Toast ref={toast} />
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-md-12">
                            <DataTable
                                title="Student's Account"
                                noDataComponent={"No Student Account"}
                                columns={columns}
                                data={filter}
                                selectableRows
                                contextActions={contextActions}
                                onSelectedRowsChange={handleRowSelected}
                                clearSelectedRows={toggleCleared}
                                pagination
                                theme='solarized'
                                subHeader
                                subHeaderComponent={
                                    <InputText placeholder='Search ID Number' value={searchData} onChange={(e) => setSearchData(e.target.value)} />
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Student