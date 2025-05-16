import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Grid,
  Typography,
  Paper,
  Box,
  Stack,
  Button,
  Dialog,
  DialogContent,
  TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import instance from "../api/api_instance";

function SectionTwo() {
  const [loading, setLoading] = useState(false);
  const [sectionData, setSectionData] = useState(null);
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const fetchSectionTwo = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/section-two");
      const data = res?.data?.data?.[0];
      setSectionData(data);
      setFormData({
        title: data.title,
        description: data.description,
      });
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await instance.put(
        `/section-two/${sectionData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSectionTwo();
      setOpen(false);
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchSectionTwo();
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <h3>Section Two :</h3>
          <Box mb={3} display="flex" justifyContent="space-between">
            <Typography variant="h4" className="Medium">
              {sectionData?.title}
            </Typography>
          </Box>
          <Typography variant="body1" className="light" paragraph>
            {sectionData?.description}
          </Typography>

          <Grid container spacing={2}>
            {sectionData?.sections?.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    width="50px"
                    // height="150"
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                  <Typography variant="h6" className="Medium" mt={1}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" className="light">
                    {item.short_des}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="background2"
            className="Medium"
            sx={{ mt: 3, textTransform: "capitalize" }}
            onClick={() => setOpen(true)}
          >
            Edit Section Two
          </Button>
          {/* Update Modal */}
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogContent>
              <Stack spacing={2}>
                <TextField
                  name="title"
                  label="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                />
                <Button
                  variant="contained"
                  color="background2"
                  className="Medium"
                  sx={{ textTransform: "capitalize" }}
                  onClick={handleUpdate}
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update"}
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export default SectionTwo;
