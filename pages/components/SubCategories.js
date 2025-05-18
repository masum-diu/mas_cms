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
    Select,
    MenuItem,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import instance from "../api/api_instance";

function SubCategories() {
    const [loading, setLoading] = useState(false);
    const [slidersupdateid, setSlidersUpdateId] = useState("");
    const [deletesId, setDeletesId] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [open, setOpen] = useState(false);
    const [categoriesFatch, setCategoriesFatch] = useState([]);
    const [sliderFatch, setSliderFatch] = useState([]);
    const [categories, setCategories] = useState('');
    const [updating, setUpdating] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        image: null,
    });

    const handleChange = (event) => {
        setCategories(event.target.value);
    };

    const handleEdit = (item) => {
        setIsEditMode(true);
        setSlidersUpdateId(item.id);
        setFormData({
            name: item.name,
            image: item.image,
        });
        setCategories(item.category_id);
        setOpen(true);
    };
    const handleDeletes = (item) => {
        setDeletesId(item.id);
        setConfirmDeleteOpen(true);
    }
    const handleAdd = () => {
        setIsEditMode(false);
        setSlidersUpdateId("");
        setFormData({
            name: "",
            image: null,
        });
        setCategories("");
        setOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            image: file,
        }));
    };

    const categoriesFatching = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/categories");
            setCategoriesFatch(response?.data?.data);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const sliderFatching = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/sub-categories");
            setSliderFatch(response?.data?.data);
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

            const form = new FormData();
            form.append("name", formData.name);
            form.append("category_id", categories);
            if (formData.image instanceof File) {
                form.append("image", formData.image);
            }

            const url = isEditMode
                ? `/sub-categories/${slidersupdateid}`
                : "/sub-categories";

            const method = "post"; // both add and edit use POST

            await instance[method](url, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            sliderFatching();
            handleCloseDialog();
        } catch (error) {
            console.error("Submit failed:", error);
        } finally {
            setUpdating(false);
        }
    };
   const handleDelete = async () => {
    try {
        const token = localStorage.getItem("token");
        const url = `/sub-categories/${deletesId}`;

        await instance.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        sliderFatching();
        setConfirmDeleteOpen(false); // Close confirmation dialog
    } catch (error) {
        console.error("Delete failed:", error);
    } finally {
        setUpdating(false);
    }
};

    const handleCloseDialog = () => {
        setOpen(false);
        setFormData({ name: "", image: null });
        setCategories("");
        setIsEditMode(false);
        setSlidersUpdateId("");
    };

    useEffect(() => {
        sliderFatching();
        categoriesFatching();
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
                        <h3>Sub Categories Section :</h3>
                        <Button
                            variant="contained"
                            className="Medium"
                            sx={{ textTransform: "capitalize" }}
                            onClick={handleAdd}
                            color="background2"
                        >
                            Add Sub Category
                        </Button>
                    </Stack>

                    <Grid container spacing={2}>
                        {sliderFatch?.map((item, index) => (
                            <Grid item xs={12} md={4} lg={4} xl={3} key={index}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 2,
                                        height: 400,
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        src={item?.image}
                                        alt=""
                                        width={"100%"}
                                        height={"100%"}
                                        style={{ borderRadius: 5, objectFit: "cover" }}
                                    />
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            color: "#000",
                                            padding: 3,
                                            textAlign: "left",
                                        }}
                                    >
                                        <Typography className="bold" variant="h6">
                                            {item.name}
                                        </Typography>
                                    </Box>
                                </Paper>
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
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}

            {/* Modal Dialog */}
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: { width: "600px", maxWidth: "100%" },
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
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            fullWidth
                        />

                        <Select
                            value={categories}
                            onChange={handleChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select Category
                            </MenuItem>
                            {categoriesFatch?.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>

                        <TextField type="file" name="image" onChange={handleFileChange} />

                        {formData.image && (
                            <Box display="flex" alignItems="center" gap={2}>
                                <img
                                    style={{ borderRadius: 5 }}
                                    src={
                                        typeof formData.image === "string"
                                            ? formData.image
                                            : URL.createObjectURL(formData.image)
                                    }
                                    alt="Preview"
                                    width={100}
                                    height={60}
                                />
                            </Box>
                        )}

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
            <Dialog
    open={confirmDeleteOpen}
    onClose={() => setConfirmDeleteOpen(false)}
    fullWidth
    maxWidth="xs"
>
    <DialogContent>
        <Typography variant="h6" gutterBottom className="bold" >
            Are you sure you want to delete this sub-category?
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

export default SubCategories;
