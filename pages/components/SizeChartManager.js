import React, { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Stack,
    Typography,
    TableContainer,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import instance from '../api/api_instance';

const SizeChartManager = () => {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [mode, setMode] = useState('view'); // 'view' | 'add' | 'edit'
    const [entries, setEntries] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        chest: '',
        body: '',
        category_id: '',
        sub_category_id: '',
    });
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAdd = async () => {
        setSubmitting(true);
        try {
            if (mode === 'edit' && editingId) {
                await instance.put(`/size-guide/${editingId}`, formData);
            } else {
                await instance.post('/size-guide', formData);
            }

            await fetchData();
            resetForm();
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await instance.delete(`/size-guide/${id}`);
            await fetchData();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleEdit = (entry) => {
        setFormData({
            name: entry.name,
            chest: entry.chest,
            body: entry.body,
            category_id: entry.category_id || '',
            sub_category_id: entry.sub_category_id || '',
        });
        setEditingId(entry.id);
        setMode('edit');
    };

    const resetForm = () => {
        setFormData({
            name: '',
            chest: '',
            body: '',
            category_id: '',
            sub_category_id: '',
        });
        setEditingId(null);
        setMode('view');
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/size-guide");
            setEntries(response?.data?.data || []);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <Paper sx={{ p: 4, mt: 4 }}>
            <Stack direction="row" spacing={2} mb={3} justifyContent="space-between" alignItems="center">
                <Typography variant="h5" gutterBottom textAlign="center">
                    Size Guide Chart
                </Typography>

                {mode === 'view' ? (
                    <Button variant="contained" sx={{ textTransform: "capitalize" }} color="background2" onClick={() => setMode('add')}>
                        Add New Size-Guide
                    </Button>
                ) : (
                    <Button variant="outlined" color="error" onClick={resetForm}>
                        Back
                    </Button>
                )}
            </Stack>

            {(mode === 'add' || mode === 'edit') && (
                <Stack spacing={2} component="form" onSubmit={(e) => { e.preventDefault(); handleAdd(); }} >
                    <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
                    <TextField label="Chest" name="chest" value={formData.chest} onChange={handleChange} required />
                    <TextField label="Body Length" name="body" value={formData.body} onChange={handleChange} required />
                    <TextField label="Category ID" name="category_id" value={formData.category_id} onChange={handleChange} />
                    <TextField label="Sub Category ID" name="sub_category_id" value={formData.sub_category_id} onChange={handleChange} />
                    <Button
                        type="submit"
                        variant="contained"
                        color='background2'
                        fullWidth
                        disabled={submitting}
                    >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : (mode === 'edit' ? 'Update Size Guide' : 'Add Size Guide')}
                    </Button>
                </Stack>
            )}

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                    <CircularProgress />
                </div>
            ) : mode === 'view' && entries.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell align="center"><strong>Name</strong></TableCell>
                                <TableCell align="center"><strong>Chest</strong></TableCell>
                                <TableCell align="center"><strong>Body Length</strong></TableCell>
                                <TableCell align="center"><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {entries.map((entry, index) => (
                                <TableRow key={entry.id || index} sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : 'white' }}>
                                    <TableCell align="center">{entry.name}</TableCell>
                                    <TableCell align="center">{entry.chest}</TableCell>
                                    <TableCell align="center">{entry.body}</TableCell>
                                    <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                             className="Medium"
                                            color="background2"
                                            startIcon={<EditIcon />}
                                            sx={{ textTransform: "capitalize" }}
                                            onClick={() => handleEdit(entry)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            className="Medium"
                                            color="background4"
                                            sx={{ textTransform: "capitalize" }}
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(entry.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : mode === 'view' && entries.length === 0 ? (
                <Typography align="center" sx={{ mt: 4 }}>
                    No size guide entries available.
                </Typography>
            ) : null}

        </Paper>
    );
};

export default SizeChartManager;
