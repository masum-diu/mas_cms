import React, { useEffect, useState } from "react";
import CrmLayout from "./components/CrmLayout";
import instance from "./api/api_instance";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SectionOne from "./components/SectionOne";
import SectionTwo from "./components/SectionTwo";

function Home() {
  const [loading, setLoading] = useState(false);
  const [slidersupdateid, setSlidersUpdateId] = useState("");
  const [open, setOpen] = useState(false);
  const [sliderFatch, setSliderFatch] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: null, // store as File
    status: "active",
  });

  const handleEdit = (item) => {
    setSlidersUpdateId(item.id);
    setOpen(true);
    setFormData({
      title: item.title,
      image: null, // don't prefill file input
      status: item.status,
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
      const response = await instance.get("/sliders");
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
      form.append("title", formData.title);
      form.append("status", formData.status);
      if (formData.image instanceof File) {
        form.append("image", formData.image);
      }

      const response = await instance.put(`/sliders/${slidersupdateid}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data) {
        sliderFatching();
        setOpen(false);
      }
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
      <CrmLayout>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <h3>Sliders Section :</h3>
            <Grid container spacing={1}>
              {sliderFatch?.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      height: 200,
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
                        {item.title}
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
            <SectionOne />
            <SectionTwo />
          </>
        )}
      </CrmLayout>

      {/* Modal */}
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
          <Stack direction={"column"} spacing={2}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter your title"
              fullWidth
            />
            <input type="file" name="image" onChange={handleFileChange} />
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
  );
}

export default Home;
