import React, { useState, useEffect } from 'react';
import {
    Button,
    Grid,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    CircularProgress,
    Divider,
    FormHelperText,
    Stack,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions
} from '@mui/material';
import { Add, Close, Delete, CloudUpload } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import instance from '../api/api_instance';

const ImageUploader = () => {
    const [colors, setColors] = useState([]);
    const [productImage, setProductImage] = useState([]);
    const [viewData, setViewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const [colorGroups, setColorGroups] = useState([
        {
            images: [
                { color_id: '', image: [], previews: [] }
            ]
        }
    ]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isSubmittingGroups, setIsSubmittingGroups] = useState([]);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState({ groupIndex: null, imgIndex: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        category_id: "",
        sub_category_id: "",
    });
    const [viewProductOpen, setViewProductOpen] = useState(false);
    const [categoriesFatch, setCategoriesFatch] = useState([]);
    const [subCategoriesFatch, setSubCategoriesFatch] = useState([]);
    const [errors, setErrors] = useState({});

    // Fetch data functions
    const ColorsFatching = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/colors");
            setColors(response?.data?.data);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const ProductImageFatching = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/product/images");
            setProductImage(response?.data?.data);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const catagroiesFatching = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/product");
            setCategoriesFatch(response?.data?.data);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        catagroiesFatching();
        ProductImageFatching();
        ColorsFatching();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === "category_id") setCategoryId(value);
    };

    // Color group management
    const addColorGroup = () => {
        setColorGroups([...colorGroups, {
            images: [
                { color_id: '', image: [], previews: [] }
            ]
        }]);
        setIsSubmittingGroups([...isSubmittingGroups, false]);
    };

    const removeColorGroup = (groupIndex) => {
        if (colorGroups.length > 1) {
            const updatedGroups = [...colorGroups];
            updatedGroups.splice(groupIndex, 1);
            setColorGroups(updatedGroups);

            const updatedSubmitting = [...isSubmittingGroups];
            updatedSubmitting.splice(groupIndex, 1);
            setIsSubmittingGroups(updatedSubmitting);

            const newErrors = { ...errors };
            delete newErrors[`color-${groupIndex}`];
            delete newErrors[`image-${groupIndex}`];
            setErrors(newErrors);
        }
    };

    const handleColorChange = (groupIndex, value) => {
        const updatedGroups = [...colorGroups];
        updatedGroups[groupIndex].images[0].color_id = value;
        setColorGroups(updatedGroups);

        if (value) {
            const newErrors = { ...errors };
            delete newErrors[`color-${groupIndex}`];
            setErrors(newErrors);
        }
    };

    const handleImageUpload = (groupIndex, files) => {
        const updatedGroups = [...colorGroups];
        const fileList = Array.from(files);
        const newPreviews = fileList.map(file => URL.createObjectURL(file));

        updatedGroups[groupIndex].images[0] = {
            ...updatedGroups[groupIndex].images[0],
            image: [...updatedGroups[groupIndex].images[0].image, ...fileList],
            previews: [...updatedGroups[groupIndex].images[0].previews, ...newPreviews]
        };

        setColorGroups(updatedGroups);

        if (fileList.length > 0) {
            const newErrors = { ...errors };
            delete newErrors[`image-${groupIndex}`];
            setErrors(newErrors);
        }
    };

    const confirmDeleteImage = (groupIndex, imgIndex) => {
        setImageToDelete({ groupIndex, imgIndex });
        setDeleteConfirmOpen(true);
    };

    const handleDeleteImage = async () => {
        const { groupIndex, imgIndex } = imageToDelete;
        const updatedGroups = [...colorGroups];
        const imageToRemove = updatedGroups[groupIndex].images[0].previews[imgIndex];

        setIsDeleting(true);

        try {
            // If the image has an ID (existing image from backend), make API call to delete
            if (imageToRemove?.id) {
                const token = localStorage.getItem("token");
                await instance.delete(`/product-images/${imageToRemove.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            // Remove from local state
            URL.revokeObjectURL(updatedGroups[groupIndex].images[0].previews[imgIndex]);
            updatedGroups[groupIndex].images[0].image.splice(imgIndex, 1);
            updatedGroups[groupIndex].images[0].previews.splice(imgIndex, 1);
            setColorGroups(updatedGroups);

        } catch (error) {
            console.error('Error deleting image:', error);
        } finally {
            setIsDeleting(false);
            setDeleteConfirmOpen(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        colorGroups.forEach((group, groupIndex) => {
            if (!group.images[0].color_id) {
                newErrors[`color-${groupIndex}`] = 'Please select a color';
            }
            if (group.images[0].image.length === 0 && group.images[0].previews.length === 0) {
                newErrors[`image-${groupIndex}`] = 'Please upload at least one image';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (groupIndex) => {
        if (!validateForm()) return;

        setIsSubmittingGroups(prev => {
            const newState = [...prev];
            newState[groupIndex] = true;
            return newState;
        });

        try {
            const token = localStorage.getItem("token");
            const form = new FormData();

            const group = colorGroups[groupIndex];
            const colorData = group.images[0];
            form.append(`images[0][color_id]`, colorData.color_id);

            colorData.image.forEach((imageFile, imgIndex) => {
                form.append(`images[0][image][${imgIndex}]`, imageFile);
            });

            const url = isEditing && editData
                ? `/product/update-image/${editData.id}`
                : `/product/image/${categoryId}`;

            const method = isEditing ? 'post' : 'post';

            const response = await instance.request({
                url,
                method,
                data: form,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // console.log('Upload successful!', response.data);
            ProductImageFatching();
            handleCloseDialog();
        } catch (error) {
            console.error('Error submitting form:', error.response?.data || error.message);
        } finally {
            setIsSubmittingGroups(prev => {
                const newState = [...prev];
                newState[groupIndex] = false;
                return newState;
            });
        }
    };

    // Dialog handlers
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setColorGroups([{ images: [{ color_id: '', image: [], previews: [] }] }]);
        setFormData({ category_id: "", sub_category_id: "" });
        setCategoryId("");
        setIsEditing(false);
        setEditData(null);
        setIsSubmittingGroups([]);
    };

    const handleAdd = () => {
        setOpenDialog(true);
        setIsEditing(false);
        setIsSubmittingGroups([false]);
    };

    const handleView = (item) => {
        setViewData({
            product_images: item.product_images,
        });
        setViewProductOpen(true);
    };

    const handleEdit = (item) => {
        // console.log('Editing item:', item);

        // Group images by color_id
        const groupedByColor = item.product_images.reduce((acc, curr) => {
            const existingGroup = acc.find(g => g.color_id === curr.color_id);

            if (existingGroup) {
                // Push the image URL and product_id as an object
                existingGroup.previews.push({
                    image: curr.image,
                    id: curr.id
                });
            } else {
                // Create new group with the first image
                acc.push({
                    color_id: curr.color_id,
                    previews: [{
                        image: curr.image,
                        id: curr.id
                    }],
                    image: [] // For new files to be uploaded
                });
            }
            return acc;
        }, []);

        const editedColorGroups = groupedByColor.map(group => ({
            images: [{
                color_id: group.color_id,
                image: group.image,
                previews: group.previews
            }]
        }));

        setFormData({
            category_id: item.category_id,
            sub_category_id: item.sub_category_id || ""
        });
        setCategoryId(item.category_id);
        setColorGroups(editedColorGroups);
        setEditData(item);
        setIsEditing(true);
        setIsSubmittingGroups(new Array(editedColorGroups.length).fill(false));
        setOpenDialog(true);
    };

    return (
        <>
            <Box sx={{ py: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" pb={2}>
                    <Typography variant="h6" className='bold'>Product Images</Typography>
                    <Button
                        variant="contained"
                        className="Medium"
                        sx={{ textTransform: "capitalize" }}
                        onClick={handleAdd}
                        color="background2"
                    >
                        Add Product
                    </Button>
                </Box>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : productImage?.map((item, index) => (
                        <Grid item xs={12} md={4} lg={4} xl={3} key={index}>
                            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                                <img
                                    src={item?.product_images[0]?.image}
                                    alt={item.name}
                                    style={{ width: '100%', borderRadius: 5 }}
                                />
                                <Typography variant="h6" sx={{ mt: 1 }}>
                                    {item.name}
                                </Typography>
                                <Stack direction="row" spacing={1} mt={2}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="background3"
                                        fullWidth
                                        className="Medium"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => handleView(item)}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        fullWidth
                                        color="background2"
                                        className="Medium"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit
                                    </Button>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
            >
                <DialogContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">
                            {isEditing ? 'Edit Product Images' : 'Add Product Images'}
                        </Typography>
                        <IconButton onClick={handleCloseDialog}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Product</InputLabel>
                        <Select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            label="Select Category"
                        >
                            {categoriesFatch?.map((cate) => (
                                <MenuItem key={cate.id} value={cate.id}>{cate.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {colorGroups.map((group, groupIndex) => (
                        <Paper key={groupIndex} elevation={2} sx={{ p: 2, mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle1">
                                    Color Group {groupIndex + 1}
                                </Typography>
                                {colorGroups.length > 1 && (
                                    <IconButton
                                        color="error"
                                        onClick={() => removeColorGroup(groupIndex)}
                                        size="small"
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth error={!!errors[`color-${groupIndex}`]}>
                                        <InputLabel>Select Color *</InputLabel>
                                        <Select
                                            value={group.images[0].color_id}
                                            onChange={(e) => handleColorChange(groupIndex, e.target.value)}
                                            label="Select Color *"
                                        >
                                            {colors.map((color) => (
                                                <MenuItem key={color.id} value={color.id}>
                                                    {color.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors[`color-${groupIndex}`] && (
                                            <FormHelperText>{errors[`color-${groupIndex}`]}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUpload />}
                                        fullWidth
                                    >
                                        Upload Images *
                                        <input
                                            type="file"
                                            hidden
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(groupIndex, e.target.files)}
                                        />
                                    </Button>
                                    {errors[`image-${groupIndex}`] && (
                                        <FormHelperText error>{errors[`image-${groupIndex}`]}</FormHelperText>
                                    )}
                                </Grid>
                            </Grid>

                            {(group.images[0].previews.length > 0) && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Grid container spacing={2}>
                                        {group.images[0].previews.map((preview, imgIndex) => {
                                            return (
                                                <Grid item xs={6} sm={4} md={3} key={imgIndex}>
                                                    <Box sx={{ position: 'relative', pt: '100%' }}>
                                                        <img
                                                            src={preview?.image}
                                                            alt={`Preview ${imgIndex}`}
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 4,
                                                                right: 4,
                                                                bgcolor: 'rgba(0,0,0,0.5)',
                                                                color: '#fff'
                                                            }}
                                                            onClick={() => confirmDeleteImage(groupIndex, imgIndex)}
                                                        >
                                                            <Close fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                    <Button
                                        variant="contained"
                                        color="background2"
                                        onClick={() => handleSubmit(groupIndex)}
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        className="Medium"
                                        disabled={isSubmittingGroups[groupIndex]}
                                        startIcon={isSubmittingGroups[groupIndex] ? <CircularProgress size={20} /> : null}
                                    >
                                        {isSubmittingGroups[groupIndex] ? (isEditing ? 'Updating...' : 'Uploading...') : (isEditing ? 'Update Images' : 'Upload Images')}
                                    </Button>
                                </>
                            )}
                        </Paper>
                    ))}

                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={addColorGroup}
                        fullWidth
                        sx={{ mt: 1 }}
                    >
                        Add Color Group
                    </Button>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog
                open={viewProductOpen}
                onClose={() => setViewProductOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogContent>
                    <Stack direction="row" justifyContent="flex-end" mb={2}>
                        <IconButton onClick={() => setViewProductOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Grid container spacing={2}>
                        {viewData?.product_images?.map((item, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <img
                                    src={item.image}
                                    alt=""
                                    style={{ width: '100%', borderRadius: 5 }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle className='Medium'>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography className='light'>Are you sure you want to delete this image?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteConfirmOpen(false)}
                        color="primary"
                        variant='outlined'
                        className='Medium'
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteImage}
                        variant='contained'
                        color="error"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={20} /> : null}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ImageUploader;