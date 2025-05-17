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

function ContactSection() {
    const [sectionData, setSectionData] = useState(null);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        description: "",

    });

    useEffect(() => {
        fetchSectionThree();
    }, []);

    const fetchSectionThree = async () => {
        try {
            const res = await instance.get("/contacts");
            const data = res?.data?.data[0];
            setSectionData(data);
            setFormData({
                email: data.email,
                description: data.description,
              
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


    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const submitData = new FormData();
            submitData.append("email", formData.email);
            submitData.append("description", formData.description);

           

            const res = await instance.post(
                `/contacts/${sectionData.id}`,
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                <h3>Contacts:</h3>
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" className="Medium" gutterBottom>
                            {sectionData.email}
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

                <Stack direction={"row"} justifyContent="flex-start">
                    <Button
                        variant="contained"
                        className="Medium"
                        color="background2"
                        startIcon={<EditIcon />}
                        sx={{ mt: 3, textTransform: "capitalize" }}
                        onClick={() => setOpen(true)}
                    >
                        Edit Contact
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
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextEditor
                            value={formData.description}
                            onChange={handleChange1}
                        />

                        

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

export default ContactSection;
