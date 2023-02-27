import axios from 'axios'
import moment from 'moment/moment';
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import DataTable, { createTheme } from 'react-data-table-component';
import swal from 'sweetalert';
import differenceBy from 'lodash.differenceby';
import { useRef } from 'react';
import { Toast } from 'primereact';

function RecordThesis(id) {

    const [Record, setRecord] = useState([]);
    const [Error, setError] = useState("")
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [toggleCleared, setToggleCleared] = React.useState(false);
    const [filter, setfilter] = useState([])
    const toast = useRef();

    
    createTheme('solarized', {
        text: {

            // text row color
            primary: '#BFC3CD',
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
            default: '#073642',
        },
        action: {
            button: 'rgba(0,0,0,.54)',
            hover: 'rgba(0,0,0,.08)',
            disabled: 'rgba(0,0,0,.12)',
        },
    }, 'dark');


    useEffect(() => {
        axios.get(`/api/RecordAccess/${id.id}`).then(res => {
            if (res.data.status === 200) {
                setRecord(res.data.record)
                setfilter(res.data.record)
            }
            else if (res.data.status === 504) {
                setError(res.data.record)
            }
        }).catch((err) => {
            if (err.response.status === 500) {
                swal("Error", err.response.statusText, "error");
            }
        });
    }, [])

    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    const contextActions = React.useMemo(() => {
        const handleDelete = (e) => {

            if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(row => row.id)}?`)) {
                const data = selectedRows.map((row) => row.id);
                axios.post(`/api/deleteAccess/${data}`).then(res => {
                    if (res.data.status === 200) {
                        setToggleCleared(!toggleCleared);
                        setfilter(differenceBy(Record, selectedRows, 'id'));
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
    }, [selectedRows, toggleCleared]);


    const column = [
        {
            name: "Thesis Title",
            selector: row => row.title,
        },
        {
            name: "BarCode",
            selector: row => row.reference_code,
        },
        {
            name: "Date Created",
            selector: row => moment(row.created_at).format("MMM D YYYY"),
        }
    ]

    return (
        <div>
            <Toast ref={toast} />
            {
                Error === "No Data" ? <h4>No Data To Display</h4> : <DataTable
                    title="Record Access"
                    columns={column}
                    data={filter}
                    pagination
                    theme='solarized'
                    selectableRows
                    contextActions={contextActions}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                />
            }

        </div>
    )
}

export default RecordThesis