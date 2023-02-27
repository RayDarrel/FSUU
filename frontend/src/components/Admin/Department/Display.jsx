import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import differenceBy from "lodash.differenceby";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import swal from "sweetalert";
import {useHistory } from "react-router-dom";

function Display({ selected, setselected }) {
    const [CourseData, setCourseData] = useState([]);
    const [loading, setloading] = useState(true);
    const [toggleCleared, setToggleCleared] = React.useState(false);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const history = useHistory();

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
        axios.post(`/api/filterCourse/${selected}`).then((res) => {
            if (res.data.status === 200) {
                setCourseData(res.data.Course);
            }
            setloading(false);
        });
    }, [selected]);

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
                axios.post(`/api/deleteCourse/${data}`).then((res) => {
                    if (res.data.status === 200) {
                        setToggleCleared(!toggleCleared);
                        setCourseData(differenceBy(CourseData, selectedRows, "course"));
                        toast.current.show({
                            severity: "success",
                            summary: res.data.success,
                            detail: "Deleted",
                        });
                    }
                });
            }
        };
        return (
            <button
                key="delete"
                className="btn btn-sm btn-danger"
                onClick={(e) => handleDelete(e)}
                style={{ backgroundColor: "red" }}
                icon="true"
            >
                Delete
            </button>
        );
    }, [CourseData, selectedRows, toggleCleared]);

    const DeleteDepartment = (e) => {
        axios
            .post(`/api/removeDepartment/${selected}`)
            .then((res) => {
                if (res.data.status === 200) {
                    swal("Success", res.data.message, "success");
                    history.push("/admin");
                } else {
                }
            })
            .catch((err) => {
                if (err.response.status === 500) {
                    swal("Warning", err.response.statusText, "warning");
                }
            });
    };

    if (loading) {
        return <h4>Loading Data...</h4>;
    }
 

    const column = [
        {
            name: "Course",
            selector: (row) => row.course,
            sortable: true,
        },
    ];

    return (
        <DataTable
            title="Department"
            columns={column}
            data={CourseData}
            selectableRows
            pagination
            theme="solarized"
            contextActions={contextActions}
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
            actions={
                <Button className="p-button-sm p-button-danger" label="Remove Department" value={selected} onClick={(e) => DeleteDepartment(e)}></Button>
            }
        />
    );
}

export default Display;
