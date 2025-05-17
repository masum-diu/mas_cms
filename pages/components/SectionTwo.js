import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import instance from "../api/api_instance";
import TextEditor from "./TextEditor";

function SectionTwo() {
  const [sectionData, setSectionData] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sections: [],
  });

  const fetchSectionOne = async () => {
    try {
      const res = await instance.get("/section-two");
      const data = res?.data?.data[0];

      // Sanitize image field
      const cleanSections = data.sections.map((sec) => ({
        ...sec,
        image:
          sec.image && Object.keys(sec.image).length === 0
            ? null
            : sec.image || null,
      }));

      setSectionData(data);
      setFormData({
        title: data.title,
        description: data.description,
        sections: cleanSections,
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchSectionOne();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange1 = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const updatedSections = [...formData.sections];
    updatedSections[index].image = file;

    setFormData((prev) => ({
      ...prev,
      sections: updatedSections,
    }));
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      sections: updatedSections,
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedSections = [...formData.sections];
    updatedSections[index].image = null;
    setFormData((prev) => ({
      ...prev,
      sections: updatedSections,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const formPayload = new FormData();

      formPayload.append("title", formData.title);
      formPayload.append("description", formData.description);

      formData.sections.forEach((sec, idx) => {
        formPayload.append(`sections[${idx}][title]`, sec.title);
        formPayload.append(`sections[${idx}][short_des]`, sec.short_des);

        if (sec.image instanceof File) {
          formPayload.append(`sections[${idx}][image]`, sec.image);
        }
      });

      const res = await instance.post(
        `/section-two/${sectionData.id}`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchSectionOne();
      setOpen(false);
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
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
        <h3>Section Two :</h3>
        <Typography variant="h5" className="Medium" gutterBottom>
          {sectionData.title}
        </Typography>
        <Typography
          variant="body1"
          className="light"
          paragraph
          dangerouslySetInnerHTML={{ __html: sectionData?.description }}
        />

        <Grid container spacing={2} mt={2}>
          {sectionData.sections.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper elevation={2} sx={{ p: 2, height: 220 }}>
                {item.image && typeof item.image === "string" && (
                  <img src={item.image} alt="" width={50} />
                )}
                <Typography variant="h6" className="Medium">
                  {item.title}
                </Typography>
                <Typography variant="body2" className="light">
                  {item.short_des}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Stack direction={"row"} justifyContent="flex-end" >
        <Button
          variant="contained"
          className="Medium"
          startIcon={<EditIcon />}
          color="background2"
          sx={{ mt: 3, textTransform: "capitalize" }}
          onClick={() => setOpen(true)}
        >
          Edit Section Two
        </Button>
        </Stack>
      </Box>

      {/* Edit Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
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

            <Typography variant="h6">Sections:</Typography>

            {formData.sections.map((sec, index) => (
              <Stack key={index} spacing={1} sx={{ borderBottom: "1px solid #eee", pb: 2 }}>
                <TextField
                  label="Section Title"
                  value={sec.title}
                  onChange={(e) =>
                    handleSectionChange(index, "title", e.target.value)
                  }
                />
                <TextField
                  label="Short Description"
                  value={sec.short_des}
                  onChange={(e) =>
                    handleSectionChange(index, "short_des", e.target.value)
                  }
                />
                <TextField
                  type="file"
                  onChange={(e) => handleFileChange(e, index)}
                />
                {sec.image && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <img
                      src={
                        typeof sec.image === "string"
                          ? sec.image
                          : sec.image instanceof File
                          ? URL.createObjectURL(sec.image)
                          : ""
                      }
                      alt="Preview"
                      width={60}
                      height={60}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove Image
                    </Button>
                  </Box>
                )}
              </Stack>
            ))}

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

export default SectionTwo;
