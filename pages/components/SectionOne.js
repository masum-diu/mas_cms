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

function SectionOne() {
  const [sectionData, setSectionData] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sections: [],
  });

  const fetchSectionOne = async () => {
    try {
      const res = await instance.get("/section-one");
      const data = res?.data?.data[0];

      setSectionData(data);
      setFormData({
        title: data.title,
        description: data.description,
        sections: data.sections,
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
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      sections: updatedSections,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await instance.post(
        `/section-one/${sectionData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Updated:", res.data);
      fetchSectionOne();
      setOpen(false);
    } catch (err) {
      console.error("Update Error:", err);
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
        <h3>Section One :</h3>
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
            <Grid item xs={12} md={6} key={index}>
              <Paper elevation={2} sx={{ p: 2 }}>
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
            color="background2"
            startIcon={<EditIcon />}
            sx={{ mt: 3, textTransform: "capitalize" }}
            onClick={() => setOpen(true)}
          >
            Edit Section One
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
            <IconButton aria-label="" onClick={() => setOpen(false)}>
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
            {/* <TextField
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              fullWidth
            /> */}
            <TextEditor value={formData.description}
              onChange={handleChange1} />
            <Typography variant="h6">Sections:</Typography>
            {formData.sections.map((sec, index) => (
              <Stack key={index} spacing={1}>
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

export default SectionOne;
