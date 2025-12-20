import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { Eye, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const FeedbackPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const columns = [
        { id: 'title', label: 'Subject' },
        { id: 'companyName', label: 'Company', render: (row) => row.companyName || 'Unassigned' },
        { id: 'issueCategory', label: 'Category' },
        {
            id: 'status', label: 'Status', render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    row.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                        row.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-800'
                    }`}>
                    {row.status.replace('_', ' ')}
                </span>
            )
        },
        { id: 'routeName', label: 'Route', render: (row) => row.routeName || 'N/A' },
        { id: 'incidentLocationName', label: 'Location', render: (row) => row.incidentLocationName || 'N/A' },
        { id: 'createdAt', label: 'Date', render: (row) => row.createdAt || 'N/A' }
    ].filter(col => user?.role === 'USER' ? col.id !== 'companyName' : true);

    const [selectedFeedback, setSelectedFeedback] = React.useState(null);
    const [response, setResponse] = React.useState('');
    const [newStatus, setNewStatus] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const handleView = (row) => {
        setSelectedFeedback(row);
        setResponse(row.adminResponse || '');
        setNewStatus(row.status);
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedFeedback) return;
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('status', newStatus);
            if (response) params.append('response', response);

            await api.put(`/feedback/${selectedFeedback.feedbackId}/status?${params.toString()}`);
            setIsModalOpen(false);
            alert('Status updated successfully!');
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        {user?.role === 'SUPER_ADMIN' ? 'System-wide Reports' : 'Reports & Feedback'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {user?.role === 'SUPER_ADMIN'
                            ? 'Oversee all reported issues and company responses across the network'
                            : user?.role === 'USER'
                                ? 'Track your reported issues and view resolutions'
                                : 'View and manage issues reported for your routes'}
                    </p>
                </div>
                {user?.role === 'USER' && (
                    <Button onClick={() => navigate('/dashboard/feedbacks/new')} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Report Issue
                    </Button>
                )}
            </div>

            <DataTable
                key={refreshTrigger}
                title="Feedbacks"
                fetchUrl="/feedback/paginated"
                columns={columns}
                onEdit={handleView}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Respond to Feedback"
            >
                {selectedFeedback && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Subject</label>
                                <p className="text-slate-800 font-medium">{selectedFeedback.title}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Company</label>
                                <p className="text-slate-800 font-medium">{selectedFeedback.companyName || 'Unassigned'}</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-500">Description</label>
                            <div className="text-slate-700 bg-slate-50 p-3 rounded-lg text-sm whitespace-pre-wrap break-words">
                                {selectedFeedback.description}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Current Status</label>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${selectedFeedback.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    selectedFeedback.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                                        selectedFeedback.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                            'bg-slate-100 text-slate-800'
                                    }`}>
                                    {selectedFeedback.status.replace('_', ' ')}
                                </span>
                            </div>
                            {user?.role !== 'USER' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Update Status</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="IN_REVIEW">In Review</option>
                                        <option value="RESOLVED">Resolved</option>
                                        <option value="CLOSED">Closed</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {user?.role !== 'USER' ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Response / Comment</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all min-h-[100px]"
                                    placeholder="Add a comment or resolution details..."
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                />
                                <div className="mt-4 flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button onClick={handleUpdateStatus} disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Feedback'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-500">Admin Response</label>
                                <p className={`p-3 rounded-lg text-sm ${selectedFeedback.status === 'RESOLVED' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {selectedFeedback.adminResponse || (selectedFeedback.status === 'PENDING' ? "Waiting for response..." : "Status updated by admin.")}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default FeedbackPage;
