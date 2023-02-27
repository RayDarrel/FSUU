import React, { useEffect, useRef, useState } from 'react'
import { Panel } from 'primereact/panel'
import { Menubar } from 'primereact/menubar'
import { PrimeIcons } from 'primereact/api'
import DataTable, { createTheme, Media } from 'react-data-table-component'
import moment from "moment/moment";
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaFolder } from 'react-icons/fa'
import { Badge } from 'primereact/badge'
import { InputText } from 'primereact/inputtext';
import differenceBy from "lodash.differenceby";
import { Button } from 'primereact/button'
 

function ThesisCollection() {

    const [Data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [toggleCleared, setToggleCleared] = React.useState(false);
    const [searchData, setsearchData] = useState("");
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

    useEffect(() => {
        const id = localStorage.getItem('auth_id');
        axios.get(`/api/archivesdean/${id}`).then((res) => {
            if (res.data.status === 200) {
                setData(res.data.data);
                setfilter(res.data.data);
            }
        });
    }, []);

    const handleRowSelected = React.useCallback((state) => {
        setSelectedRows(state.selectedRows);
    }, []);

    const contextActions = React.useMemo(() => {
        const handleDelete = (e) => {
            if (
                window.confirm(
                    `Are you sure you want to delete:\r ${selectedRows.map(
                        (row) => row.id
                    )}?`
                )
            ) {
                const data = selectedRows.map((row) => row.id);
                axios.post(`/api/RemoveArchive/${data}`).then((res) => {
                    console.log(res);
                    if (res.data.status === 200) {
                        setToggleCleared(!toggleCleared);
                        setfilter(differenceBy(filter, selectedRows, "title"));
                        // swal("Success", res.data.message, 'success');
                        toast.current.show({
                            severity: "success",
                            summary: res.data.message,
                            detail: "Deleted",
                        });
                    }
                });
            }
        };

        return (
            <>

                <Button 
                    key="delete"
                    className='p-button-sm p-button-danger'
                    onClick={(e) => handleDelete(e)}
                    icon={PrimeIcons.TRASH}
                    label="Delete"
                />
            </>
        );
    }, [filter, selectedRows, toggleCleared]);


   

    useEffect(() => {
        const result = Data.filter((data) => {
            return data.reference_code.match(searchData.toLowerCase());
        });
        setfilter(result);
        // eslint-disable-next-line
    }, [searchData]);


    const columns = [
        {
            name: "Title",
            selector: (row) => (
                <div>
                    <FaFolder
                        size={20}
                        className="align-content-center align-middle text-secondary me-1"
                    ></FaFolder>{" "}
                    <span className="align-middle">{row.title}</span>
                </div>
            ),
            sortable: true,
        },
        {
            name: "BarCode",
            selector: (row) => row.reference_code,
            sortable: true,
        },
        {
            name: "Published",
            selector: (row) => moment(row.created_at).format("MMM  YYYY"),
            sortable: true,
            hide: Media.MD,
        },
        {
            name: "View as",
            selector: (row) =>
                row.is_active_docu === 1 ? (
                    <Badge value={"User"} severity="success" />
                ) : (
                    <Badge value={"Admin"} severity="danger" />
                ),
        },
        {
            name: "Action",
            cell: (row) => <Link to={`/faculty/collection/refid=${row.uniq_key}`}><Badge value="Details" severity='info' /></Link>,
            sortable: true,
        },
    ];



    const items = [
        {
            label: "Thesis Collection",
            icon: PrimeIcons.FOLDER_OPEN,
            url: "/dean/collection",
        },
    ]

    const header = <Menubar model={items} />



    return (
        <div>
            <Panel headerTemplate={header}>
                <DataTable
                    title="Thesis"
                    columns={columns}
                    data={filter}
                    pagination
                    selectableRows
                    contextActions={contextActions}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                    subHeader
                    subHeaderComponent={
                        <InputText className='p-inputtext w-100' placeholder='BarCode #' value={searchData}
                        onChange={(e) => setsearchData(e.target.value)} />
                    }
                    subHeaderAlign=""
                    theme='solarized'
                />
            </Panel>
        </div>
    )
}

export default ThesisCollection