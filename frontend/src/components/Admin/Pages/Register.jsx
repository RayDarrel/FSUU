import { Panel } from 'primereact/panel'
import React, { useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import RegisterStudent from '../RegisterData/RegisterStudent';
import RegisterSubAdmin from '../RegisterData/RegisterSubAdmin';
import RegisterSub from '../RegisterData/RegisterSub';


function Register() {

    const [activeIndex, setActiveIndex] = useState(0);
    
    return (
        <div>
            <Panel header={<h4 className='text-secondary'>Register Account</h4>}>
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Students">
                        <RegisterStudent />
                    </TabPanel>
                    <TabPanel header="Library Personnel">
                        <RegisterSubAdmin/>
                    </TabPanel>
                    <TabPanel header="Faculty / Staff">
                        <RegisterSub />
                    </TabPanel>
                </TabView>
            </Panel>
        </div>
    )
}

export default Register