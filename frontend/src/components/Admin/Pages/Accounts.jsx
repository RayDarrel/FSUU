import { Panel } from 'primereact/panel'
import React, { useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import Student from '../Accounts/Student';
import Dean from '../Accounts/Dean';
import Chairtman from '../Accounts/Chairtman';
import Library from '../Accounts/Library';


function Accounts() {

    const [activeIndex, setActiveIndex] = useState(0);
    

    return (
        <div>
            <Panel>
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Student Account">
                        <Student />
                    </TabPanel>
                    <TabPanel header="Dean Account">
                        <Dean />
                    </TabPanel>
                    <TabPanel header="Chairman Account">
                        <Chairtman />
                    </TabPanel>
                    <TabPanel header="Library Account">
                        <Library />
                    </TabPanel>
                
                </TabView>

            </Panel>
        </div>
    )
}

export default Accounts