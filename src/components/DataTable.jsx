import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import api from '../services/api';
import Button from './Button';

const DataTable = ({ fetchUrl, columns, onEdit, onDelete, title }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // Search State
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [error, setError] = useState(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Backend pagination usually uses 0-based index
                const params = {
                    page: page,
                    size: rowsPerPage,
                    search: debouncedSearch // Assuming backend supports ?search= parameter for basic filtering
                };
                const response = await api.get(fetchUrl, { params });

                if (response.data.content) {
                    // Spring Page<T> response structure
                    setData(response.data.content);
                    setTotal(response.data.totalElements);
                } else if (Array.isArray(response.data)) {
                    // Fallback for non-paginated arrays (client-side pagination support if needed)
                    setData(response.data);
                    setTotal(response.data.length);
                }
            } catch (error) {
                console.error(`Failed to fetch data for ${title}`, error);
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [fetchUrl, page, rowsPerPage, debouncedSearch]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const totalPages = Math.ceil(total / rowsPerPage);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder={`Search ${title}...`}
                    className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 border border-red-200">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    {columns.map((col) => (
                                        <th key={col.id} className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                                            {col.label}
                                        </th>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row) => (
                                    <tr
                                        key={row.id || row.userId || row.companyId || row.routeId}
                                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                    >
                                        {columns.map((col) => (
                                            <td key={col.id} className="py-4 px-4 text-sm text-slate-600">
                                                {col.render ? col.render(row) : row[col.id]}
                                            </td>
                                        ))}
                                        {(onEdit || onDelete) && (
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {onEdit && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onEdit(row)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {onDelete && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onDelete(row)}
                                                            className="p-2 text-red-600 hover:bg-red-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="py-12 text-center text-slate-500">
                                            No records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                            Showing {data.length > 0 ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, total)} of {total} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                            </select>
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(0)}
                                    disabled={page === 0}
                                    className="text-slate-600 border-slate-300 hover:bg-slate-50"
                                >
                                    First
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 0}
                                    className="text-slate-600 border-slate-300 hover:bg-slate-50"
                                >
                                    Previous
                                </Button>
                                <span className="px-3 py-1.5 text-sm text-slate-700 flex items-center">
                                    Page {page + 1} of {totalPages || 1}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages - 1}
                                    className="text-slate-600 border-slate-300 hover:bg-slate-50"
                                >
                                    Next
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(totalPages - 1)}
                                    disabled={page >= totalPages - 1}
                                    className="text-slate-600 border-slate-300 hover:bg-slate-50"
                                >
                                    Last
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DataTable;
