import React from 'react';
import DataTable from '../components/DataTable';
import { Plus, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const LocationsPage = () => {
    const navigate = useNavigate();

    const columns = [
        { id: 'locationId', label: 'ID' },
        { id: 'locationName', label: 'Name' },
        { id: 'locationType', label: 'Type' },
        { id: 'parentLocationName', label: 'Parent Location', render: (row) => row.parentLocationName || 'N/A' }
    ];

    const handleEdit = (row) => {
        navigate(`/dashboard/locations/edit/${row.locationId}`);
    };

    const handleDelete = (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.locationName}?`)) {
            // Delete logic would go here
            console.log("Delete Location", row.locationId);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        <h1 className="text-3xl font-bold text-slate-800">Locations Management</h1>
                    </div>
                    <p className="text-slate-500">Manage provinces, districts, sectors, and villages</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/dashboard/locations/new')} className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add New Location
                </Button>
            </div>

            <DataTable
                title="Locations"
                fetchUrl="/locations/paginated"
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default LocationsPage;
