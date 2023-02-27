import React from 'react'
import CardData from '../DashboardData/CardData';
import DashboardTable from '../DashboardData/DashboardTable';
import ThesisData from '../DashboardData/ThesisData';

function Dashboard() {
    return (
        <div>
            <CardData></CardData>
            <div className="mt-1">
                <div className="row">
                    <div className="col-lg-6">
                        <DashboardTable></DashboardTable>
                    </div>
                    <div className="col-lg-6">
                        <ThesisData></ThesisData>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard