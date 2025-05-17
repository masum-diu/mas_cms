import React, { useEffect, useState } from "react";
import {
    Typography,
    Box,
    Stack,
    Button,
    TextField,
    Dialog,
    DialogContent,
    IconButton,
    CircularProgress,
    Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import instance from "../api/api_instance";
import TextEditor from "./TextEditor";

function SectionThree() {
    const [sectionData, setSectionData] = useState(null);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
    });

    useEffect(() => {
        fetchSectionThree();
    }, []);

    const fetchSectionThree = async () => {
        try {
            const res = await instance.get("/section-three");
            const data = res?.data?.data[0];
            setSectionData(data);
            setFormData({
                title: data.title,
                description: data.description,
                image: data.image,
            });
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChange1 = (value) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            image: file,
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const submitData = new FormData();
            submitData.append("title", formData.title);
            submitData.append("description", formData.description);

            if (formData.image instanceof File) {
                submitData.append("image", formData.image);
            }

            const res = await instance.post(
                `/section-three/${sectionData.id}`,
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            fetchSectionThree();
            setOpen(false);
        } catch (err) {
            console.error("Update Error:", err.response?.data || err);
        }
    };

    if (!sectionData)
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </div>
        );

    return (
        <>
            <Box sx={{ mt: 3 }}>
                <h3>Section Three:</h3>
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" className="Medium" gutterBottom>
                            {sectionData.title}
                        </Typography>
                        <Typography
                            variant="body1"
                            className="light"
                            paragraph
                            dangerouslySetInnerHTML={{ __html: sectionData?.description }}
                        />

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <img src={sectionData.image} alt="" width={"100%"} style={{borderRadius:5}} />
                    </Grid>
                </Grid>

                <Stack direction={"row"} justifyContent="flex-end">
                    <Button
                        variant="contained"
                        className="Medium"
                        color="background2"
                        startIcon={<EditIcon />}
                        sx={{ mt: 3, textTransform: "capitalize" }}
                        onClick={() => setOpen(true)}
                    >
                        Edit Section Three
                    </Button>
                </Stack>
            </Box>

            {/* Edit Modal */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogContent>
                    <Stack direction={"row"} justifyContent="flex-end" mb={2}>
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    <Stack spacing={2}>
                        <TextField
                            name="title"
                            label="Title"
                            value={formData.title}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextEditor
                            value={formData.description}
                            onChange={handleChange1}
                        />

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
                            className="Medium"
                            color="background2"
                            onClick={handleSubmit}
                        >
                            Update
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default SectionThree;
