import { Panel } from 'primereact/panel'
import { TabPanel, TabView } from 'primereact/tabview'
import React, { useState } from 'react'
import DeleteDepartment from '../Department/DeleteDepartment';

function Delete() {

    const [activeIndex, setActiveIndex] = useState(0);
    

    return (
        <div>
            <Panel>
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Remove">
                        <DeleteDepartment />
                    </TabPanel>
                </TabView>
            </Panel>
        </div>
    )
}

export default Delete