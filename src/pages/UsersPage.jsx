import React from 'react';
import DataTable from '../components/DataTable';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const UsersPage = () => {
    const navigate = useNavigate();

    const columns = [
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'role', label: 'Role' },
        { id: 'phone', label: 'Phone' },
        { id: 'companyName', label: 'Company', render: (row) => row.companyName || 'N/A' }
    ];

    const handleEdit = (row) => {
        navigate(`/dashboard/users/edit/${row.userId}`);
    };

    const handleDelete = (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
            // Call delete API
            console.log("Delete", row.userId);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Users Management</h1>
                    <p className="text-slate-500 mt-1">Manage system users and their roles</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/dashboard/users/new')} className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add New User
                </Button>
            </div>

            <DataTable
                title="Users"
                fetchUrl="/users/paginated"
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default UsersPage;
