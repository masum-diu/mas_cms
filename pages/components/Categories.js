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
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import instance from "../api/api_instance";

function Categories() {
    const [loading, setLoading] = useState(false);
    const [slidersupdateid, setSlidersUpdateId] = useState("");
    const [open, setOpen] = useState(false);
    const [sliderFatch, setSliderFatch] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        image: null, // store as File

    });

    const handleEdit = (item) => {
        setSlidersUpdateId(item.id);
        setOpen(true);
        setFormData({
            name: item.name,
            image: item.image, // don't prefill file input

        });
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

    const sliderFatching = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/categories");
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

            if (formData.image instanceof File) {
                form.append("image", formData.image);
            }

            const response = await instance.post(`/categories/${slidersupdateid}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            sliderFatching();
            setOpen(false);

        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        sliderFatching();
    }, []);

    return (
        <>
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <h3>Categories Section :</h3>
                    <Grid container spacing={1}>
                        {sliderFatch?.map((item, index) => (
                            <Grid item xs={12} md={6} key={index}>
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
                                        <Typography className="bold" variant="h6" color={"#fff"}>
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
                                        onClick={() => {
                                            handleEdit(item);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>

                </>
            )}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        width: "600px",
                        maxWidth: "100%",
                    },
                }}
            >
                <DialogContent>
                    <Stack
                        direction={"row"}
                        justifyContent="flex-end"
                        alignItems="center"
                        mb={2}
                    >
                        <IconButton onClick={() => setOpen(false)}>
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
                        <TextField type="file" name="image" onChange={handleFileChange} />
                        {formData.image && (
                            <Box display="flex" alignItems="center" gap={2}>
                                <img
                                    style={{ borderRadius: 5 }}
                                    src={
                                        typeof formData.image === "string"
                                            ? formData.image
                                            : formData.image instanceof File
                                                ? URL.createObjectURL(formData.image)
                                                : ""
                                    }
                                    alt="Preview"
                                    width={100}
                                    height={60}
                                />
                                {/* <Button
                                              size="small"
                                              variant="outlined"
                                              color="error"
                                              onClick={() => handleRemoveImage(index)}
                                            >
                                              Remove Image
                                            </Button> */}
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
                            {updating ? "Updating..." : "Update"}
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Categories
