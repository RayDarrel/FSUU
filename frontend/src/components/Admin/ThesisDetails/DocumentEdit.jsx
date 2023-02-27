import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Menubar } from 'primereact/menubar';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

function DocumentEdit(props) {

    const [Info, setInfo] = useState([]);
    const [loading, setloading] = useState(true)
    const history = useHistory();
    const toast = useRef();

    useEffect(() => {
        const id = props.match.params.id;
        axios.get(`/api/documentsDetails/${id}`).then(res => {
            if (res.data.status === 200) {
                setInfo(res.data.Details)
            }
            else {
                swal("Warning", res.data.error, 'warning');
                history.push('/admin/collection');
            }
            setloading(false)
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }, []);

    const handleInput = (e) => {
        e.persist();
        setInfo({ ...Info, [e.target.name]: e.target.value });
    }

    const items = [
        {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            url: `/admin/collection/edit/refid=${props.match.params.id}`
        },
        {
            label: 'Return Page',
            url: `/admin/collection/refid=${props.match.params.id}`,
        },
    ];
    const header = <Menubar model={items} />

    const UpdateDocument = (e) =>{
        e.preventDefault();

        const data = Info;
        const id = props.match.params.id;

        axios.put(`/api/UpdateData/${id}`,data).then(res =>{
            if(res.data.status === 200){
                toast.current.show({severity: "success", summary: res.data.message, details: "Update Data!"});
                setTimeout(() =>{
                    history.push(`/admin/collection/refid=${props.match.params.id}`)
                },1400)
            }
        }).catch((error) =>{
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }

    if (loading) {
        return (
            <h4></h4>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <Panel headerTemplate={header}>
                <div className="container">
                    <form onSubmit={UpdateDocument}>
                        <div className="row">
                            <div className="col-lg-12 mb-3">
                                <label htmlFor="" className='form-label'>Title</label>
                                <InputText className='w-100' name='title' onChange={handleInput} value={Info.title} />
                            </div>
                            <div className="col-lg-12 mb-3">
                                <label htmlFor="" className='form-label'>Keywords</label>
                                <InputText value={Info.keywords} name="keywords" onChange={handleInput} className='w-100' />
                            </div>
                            <div className="col-lg-12 mb-3">
                                <label htmlFor="" className="form-label">
                                    Abstract
                                </label>
                                <InputTextarea name='description' onChange={handleInput} value={Info.description} className='w-100' cols={6} rows={10} />
                            </div>
                            <div className="mt-3">
                                <Button className='p-button-sm p-button' label='Update' />
                            </div>
                        </div>
                    </form>
                </div>
            </Panel>
        </div>
    )
}

export default DocumentEdit