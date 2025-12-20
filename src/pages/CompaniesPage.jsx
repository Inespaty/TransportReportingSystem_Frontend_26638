import React from 'react';
import DataTable from '../components/DataTable';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const CompaniesPage = () => {
    const navigate = useNavigate();

    const columns = [
        { id: 'companyName', label: 'Company Name' },
        { id: 'contactEmail', label: 'Contact Email', render: (row) => row.contactInfo || row.contactEmail || 'N/A' }, // Handle field ambiguity
        { id: 'description', label: 'Description' }
    ];

    const handleEdit = (row) => {
        navigate(`/dashboard/companies/edit/${row.companyId}`);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Company Management</h1>
                    <p className="text-slate-500 mt-1">Manage transport companies and operators</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/dashboard/companies/new')} className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add New Company
                </Button>
            </div>

            <DataTable
                title="Companies"
                fetchUrl="/companies/paginated"
                columns={columns}
                onEdit={handleEdit}
                onDelete={(row) => console.log("Delete", row.companyId)}
            />
        </div>
    );
};

export default CompaniesPage;
