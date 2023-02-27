import { Badge, Button, Editor, InputText, Menubar, Panel, PrimeIcons, Toast } from 'primereact'
import React, { useRef } from 'react'


function Message() {
    const item = [
        {
            label: "Compose",
            icon: PrimeIcons.PENCIL,
            url: '/admin/message',
        },
        {
            label: <i className="pi pi-envelope p-overlay-badge" style={{ fontSize: '1.2rem' }}> <Badge className='p-badge-danger' value="" /></i>,
            url: '/admin/inbox',
        },
        {
            label: "Sent Items",
            // icon: PrimeIcons.ARROW_DOWN,
            url: '/admin/sent'
        },
    ];

    const header = <Menubar model={item} />

    return (
        <div>
            {/* <Panel headerTemplate={header}>
               
            </Panel> */}
        </div>
    )
}

export default Message