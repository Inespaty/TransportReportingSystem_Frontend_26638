import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const RoutesPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const columns = [
        { id: 'routeNumber', label: 'Route No.' },
        { id: 'startPoint', label: 'Start Point', render: (row) => row.startPoint || row.startLocation },
        { id: 'endPoint', label: 'End Point', render: (row) => row.endPoint || row.endLocation },
        { id: 'company', label: 'Operator', render: (row) => row.company?.companyName || 'N/A' }
    ];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Route Management</h1>
                    <p className="text-slate-500 mt-1">Manage transport routes and their details</p>
                </div>
                {user?.role === 'COMPANY_ADMIN' && (
                    <Button variant="primary" onClick={() => navigate('/dashboard/routes/new')} className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Route
                    </Button>
                )}
            </div>

            <DataTable
                title="Routes"
                fetchUrl="/routes/paginated"
                columns={columns}
                onEdit={user?.role === 'COMPANY_ADMIN' ? (row) => navigate(`/dashboard/routes/edit/${row.routeId}`) : null}
                onDelete={user?.role === 'COMPANY_ADMIN' ? (row) => console.log("Delete", row.routeId) : null}
            />
        </div>
    );
};

export default RoutesPage;
