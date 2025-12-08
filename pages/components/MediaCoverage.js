import React, { useEffect, useState } from "react";
import {
    CircularProgress,
    Paper,
    Grid,
    Stack,
    Button,
    Box,
    Typography,
    Dialog,
    DialogContent,
    TextField,
    IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import instance from "../api/api_instance";
import TextEditor from "./TextEditor";

function MediaCoverage() {
    const [loading, setLoading] = useState(false);
    const [updateId, setUpdateId] = useState("");
    const [deletesId, setDeletesId] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [open, setOpen] = useState(false);
    const [mediaCoverageList, setMediaCoverageList] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    const handleEdit = (item) => {
        setIsEditMode(true);
        setUpdateId(item.id);
        setFormData({
            title: item.title || "",
            description: item.description || "",
        });
        setOpen(true);
    };

    const handleDeletes = (item) => {
        setDeletesId(item.id);
        setConfirmDeleteOpen(true);
    };

    const handleAdd = () => {
        setIsEditMode(false);
        setUpdateId("");
        setFormData({
            title: "",
            description: "",
        });
        setOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDescriptionChange = (value) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };

    const fetchMediaCoverage = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/media-coverage");
            setMediaCoverageList(response?.data?.data || []);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setUpdating(true);
        try {
            const token = localStorage.getItem("token");

            const url = isEditMode
                ? `/media-coverage/${updateId}`
                : "/media-coverage";

            const method = isEditMode ? "put" : "post";

            await instance[method](url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            fetchMediaCoverage();
            handleCloseDialog();
        } catch (error) {
            console.error("Submit failed:", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        setUpdating(true);
        try {
            const token = localStorage.getItem("token");
            const url = `/media-coverage/${deletesId}`;

            await instance.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchMediaCoverage();
            setConfirmDeleteOpen(false);
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setFormData({
            title: "",
            description: "",
        });
        setIsEditMode(false);
        setUpdateId("");
    };

    useEffect(() => {
        fetchMediaCoverage();
    }, []);

    return (
        <>
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <Stack direction={"row"} justifyContent="space-between" alignItems="center" mb={2}>
                        <h3>Media Coverage Section :</h3>
                        <Button
                            variant="contained"
                            className="Medium"
                            sx={{ textTransform: "capitalize" }}
                            onClick={handleAdd}
                            color="background2"
                        >
                            Add Media Coverage
                        </Button>
                    </Stack>

                    <Grid container spacing={2}>
                        {mediaCoverageList?.length > 0 ? (
                            mediaCoverageList.map((item, index) => (
                                <Grid item xs={12} md={6} lg={4} key={index}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 3,
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box>
                                            <Typography className="bold" variant="h6" mb={2}>
                                                {item.title || "Untitled"}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    whiteSpace: "pre-line",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 5,
                                                    WebkitBoxOrient: "vertical",
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: item.description
                                                        ? item.description.replace(/<[^>]+>/g, "").slice(0, 200)
                                                        : "No description"
                                                }}
                                            />
                                        </Box>
                                        <Stack
                                            mt={2}
                                            direction={"row"}
                                            spacing={1}
                                            justifyContent={"flex-end"}
                                            alignItems={"center"}
                                        >
                                            <Button
                                                className="Medium"
                                                size="small"
                                                variant="contained"
                                                color="background2"
                                                sx={{ textTransform: "capitalize" }}
                                                startIcon={<EditIcon />}
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                className="Medium"
                                                size="small"
                                                variant="contained"
                                                color="background4"
                                                sx={{ textTransform: "capitalize" }}
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeletes(item)}
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 4, textAlign: "center" }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No media coverage found. Click "Add Media Coverage" to create one.
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </>
            )}

            {/* Modal Dialog */}
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: { width: "800px", maxWidth: "100%" },
                }}
            >
                <DialogContent>
                    <Stack direction={"row"} justifyContent="flex-end" alignItems="center" mb={2}>
                        <IconButton onClick={handleCloseDialog}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    <Stack direction={"column"} spacing={2}>
                        <TextField
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter media coverage title"
                            fullWidth
                        />

                        <Box>
                            <Typography variant="body2" className="Medium" mb={1}>
                                Description
                            </Typography>
                            <TextEditor
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                placeholder="Enter media coverage description"
                            />
                        </Box>

                        <Button
                            variant="contained"
                            color="background2"
                            className="Medium"
                            sx={{ textTransform: "capitalize" }}
                            onClick={handleSubmit}
                            disabled={updating}
                        >
                            {updating
                                ? isEditMode
                                    ? "Updating..."
                                    : "Adding..."
                                : isEditMode
                                    ? "Update"
                                    : "Add"}
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogContent>
                    <Typography variant="h6" gutterBottom className="bold">
                        Are you sure you want to delete this media coverage?
                    </Typography>
                    <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
                        <Button
                            variant="outlined"
                            onClick={() => setConfirmDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                            disabled={updating}
                        >
                            {updating ? "Deleting..." : "Delete"}
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default MediaCoverage;

