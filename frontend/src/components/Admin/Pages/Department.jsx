import { Panel } from 'primereact/panel';
import React, { useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import NewDepartment from '../Department/NewDepartment';
import NewCourse from '../Department/NewCourse';

function Department() {
    
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div>
            <Panel header={<h4 className='text-secondary'>Add Department & Course</h4>}>
                <TabView>
                    <TabPanel header="Department">
                        <NewDepartment />
                    </TabPanel>
                    <TabPanel header="Course">
                        <NewCourse />
                    </TabPanel>
                </TabView>
            </Panel>
        </div>
    )
}

export default Department