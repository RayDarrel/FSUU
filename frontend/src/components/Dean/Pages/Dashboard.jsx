import { Card } from 'primereact'
import React from 'react'
import BarData from '../DashboardData/BarData'
import DashCard from '../DashboardData/DashCard'
import PieChartdata from '../DashboardData/PieChartdata'

function Dashboard() {
    return (
        <div>
            <DashCard/>
            <div className="mt-3">
                <div className="row justify-content-space">
                    <div className="col-lg-12">
                    <BarData>
                    
                    </BarData>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard