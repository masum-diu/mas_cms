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
    TableRow,
    TableCell,
    TableHead,
    Table,
    TableContainer,
    TableBody, ButtonGroup,
    Switch,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import instance from "../api/api_instance";
import TextEditor from "./TextEditor";
import { set } from "date-fns";

function Products() {
    const [loading, setLoading] = useState(false);
    const [loadingCate, setLoadingCate] = useState(false);
    const [slidersupdateid, setSlidersUpdateId] = useState("");
    const [deletesId, setDeletesId] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [open, setOpen] = useState(false);
    const [sliderFatch, setSliderFatch] = useState([]);
     console.log(sliderFatch, "sliderFatch")
    const [updating, setUpdating] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [viewProductOpen, setViewProductOpen] = useState(false);
    const [viewData, setViewData] = useState([]);
    const [sizesFatch, setsizesFatch] = useState([]);
    const [colorsFatch, setcolorsFatch] = useState([]);
    const [categoriesFatch, setCategoriesFatch] = useState([]);
    const [subCategoriesFatch, setSubCategoriesFatch] = useState([]);
    const [selectedCate, setSelectedCate] = useState("all");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "",
        sub_category_id: "",
        fit: "",
        care: "",
        price: "",
        discount_price: "",
        discount_amount: "",
        tags: [{ name: '', description: '' }],
        size_guides: [{ name: "", chest: "", body: "" }],
        availability: [{ size_id: "", color_id: "", quantity: 0 }],
        isNew: true,
    });
    console.log(formData)

    const handleTagChange = (index, e) => {
        const { name, value } = e.target;
        const tags = [...formData.tags];
        tags[index][name] = value;
        setFormData((prev) => ({ ...prev, tags }));
    };

    const handleTagEditorChange = (index, val) => {
        const tags = [...formData.tags];
        tags[index].description = val;
        setFormData((prev) => ({ ...prev, tags }));
    };

    const handletagsadd = () => {
        setFormData((prev) => ({
            ...prev,
            tags: [...(prev.tags || []), { name: '', description: '' }],
        }));
    };

    const handleTagesDelete = (index) => {
        const tags = [...formData.tags];
        if (tags.length > 1) {
            tags.splice(index, 1);
            setFormData((prev) => ({ ...prev, tags }));
        }
    };

    const handleSizeGuideChange = (index, e) => {
        const { name, value } = e.target;
        const size_guides = [...formData.size_guides];
        size_guides[index][name] = value;
        setFormData(prev => ({ ...prev, size_guides }));
    };

    const handleAddSizeGuide = () => {
        setFormData(prev => ({
            ...prev,
            size_guides: [...prev.size_guides, { name: "", chest: "", body: "" }]
        }));
    };

    const handleDeleteSizeGuide = (index) => {
        const size_guides = [...formData.size_guides];
        if (size_guides.length > 1) {
            size_guides.splice(index, 1);
            setFormData(prev => ({ ...prev, size_guides }));
        }
    };

    const handleAvailabilityChange = (index, e) => {
        const { name, value } = e.target;
        const availability = [...formData.availability];
        availability[index][name] = value;
        setFormData(prev => ({ ...prev, availability }));
    };

    const handleAddAvailability = () => {
        setFormData(prev => ({
            ...prev,
            availability: [...prev.availability, { size_id: "", color_id: "", quantity: 0 }]
        }));
    };

    const handleDeleteAvailability = (index) => {
        const availability = [...formData.availability];
        if (availability.length > 1) {
            availability.splice(index, 1);
            setFormData(prev => ({ ...prev, availability }));
        }
    };

    const handleEdit = (item) => {
        setIsEditMode(true);
        setSlidersUpdateId(item.id);
        const categoryId = item.category?.id || "";
        const subCategoryId = item.subCategory?.id || "";
        
        // Handle size guides - check multiple possible property names
        // Laravel returns hasMany relationships as the method name (sizeGuide)
        let sizeGuidesData = [];
        
        // Check if sizeGuide exists and is an array/collection
        if (item.sizeGuide) {
            if (Array.isArray(item.sizeGuide)) {
                sizeGuidesData = item.sizeGuide;
            } else if (item.sizeGuide && typeof item.sizeGuide === 'object') {
                // If it's an object, try to convert to array
                sizeGuidesData = Object.values(item.sizeGuide);
            }
        } else if (item.size_guide) {
            if (Array.isArray(item.size_guide)) {
                sizeGuidesData = item.size_guide;
            } else if (typeof item.size_guide === 'object') {
                sizeGuidesData = Object.values(item.size_guide);
            }
        } else if (item.sizeGuides) {
            if (Array.isArray(item.sizeGuides)) {
                sizeGuidesData = item.sizeGuides;
            } else if (typeof item.sizeGuides === 'object') {
                sizeGuidesData = Object.values(item.sizeGuides);
            }
        }
        
        // Format size guides - ensure we have at least one empty entry if none exist
        // Filter out any invalid entries and map to the correct format
        const formattedSizeGuides = sizeGuidesData && Array.isArray(sizeGuidesData) && sizeGuidesData.length > 0 
            ? sizeGuidesData
                .filter(sg => sg && (sg.name || sg.chest || sg.body)) // Filter out completely empty entries
                .map(sg => ({
                    name: sg?.name || "",
                    chest: sg?.chest || "",
                    body: sg?.body || ""
                }))
            : [];
        
        // If no valid size guides, add one empty entry
        if (formattedSizeGuides.length === 0) {
            formattedSizeGuides.push({ name: "", chest: "", body: "" });
        }
        
        // Handle availability - ensure proper format
        const availabilityData = item.availability || [];
        const formattedAvailability = availabilityData.length > 0
            ? availabilityData.map(avail => ({
                size_id: avail.size_id || "",
                color_id: avail.color_id || "",
                quantity: avail.quantity || 0
            }))
            : [{ size_id: "", color_id: "", quantity: 0 }];
        
        setFormData({
            category_id: categoryId,
            sub_category_id: subCategoryId,
            fit: item.fit || "",
            care: item.care || "",
            price: item.price || "",
            discount_price: item.discount_price || "",
            discount_amount: item.discount_amount || "",
            name: item.name || "",
            description: item.description || "",
            tags: item.tags?.length > 0 ? item.tags : [{ name: '', description: '' }],
            size_guides: formattedSizeGuides,
            availability: formattedAvailability,
            isNew: item.isNew !== undefined ? item.isNew : true,
        });

        // Fetch subcategories for the selected category
        if (categoryId) {
            handlesubcartegory(categoryId);
        } else {
            setSubCategoriesFatch([]);
        }
        setOpen(true);
    };

    const handleDeletes = (item) => {
        setDeletesId(item.id);
        setConfirmDeleteOpen(true);
    }

    const handleView = (item) => {
        setViewData({
            name: item.name,
            description: item.description,
            fit: item.fit,
            product_images: item.productImages,
            care: item.care,
            price: item.price,
            tags: item.tags,
            size_guides: item.size_guides
        });
        setViewProductOpen(true);
    }

    const handleAdd = () => {
        setIsEditMode(false);
        setSlidersUpdateId("");
        setFormData({
            category_id: "",
            sub_category_id: "",
            name: "",
            fit: "",
            care: "",
            price: "",
            discount_price: "",
            discount_amount: "",
            description: "",
            tags: [{ name: '', description: '' }],
            size_guides: [{ name: "", chest: "", body: "" }],
            availability: [{ size_id: "", color_id: "", quantity: 0 }],
            isNew: true,
        });
        setOpen(true);
        setSubCategoriesFatch([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // If category is changed, reset sub_category_id and fetch subcategories
        if (name === "category_id") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                sub_category_id: "", // Reset sub category when category changes
            }));
            handlesubcartegory(value);
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleChange1 = (value) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };

    const sliderFatching = async () => {
        setLoading(true);
        try {
            const url = selectedCate === "all" ? "/product" : `/product?category=${selectedCate}`;
            const response = await instance.get(url);
            setSliderFatch(response?.data?.data);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const catagroiesFatching = async () => {
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

    const sizesFatching = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/sizes");
            setsizesFatch(response?.data?.data);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const ColorsFatching = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/colors");
            setcolorsFatch(response?.data?.data);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // 4. Update the handlesubcartegory function
    const handlesubcartegory = async (categoryId) => {
        if (!categoryId) {
            setSubCategoriesFatch([]); // Clear subcategories if no category selected
            return;
        }

        setLoadingCate(true);
        try {
            const response = await instance.get(`sub-categories?category=${categoryId}`);
            setSubCategoriesFatch(response?.data?.data || []);
        } catch (error) {
            console.error("Fetch failed:", error);
            setSubCategoriesFatch([]); // Clear on error
        } finally {
            setLoadingCate(false);
        }
    };

    const handleSubmit = async () => {
        setUpdating(true);
        try {
            const token = localStorage.getItem("token");
            const form = new FormData();

            form.append("name", formData.name);
            form.append("fit", formData.fit);
            form.append("care", formData.care);
            form.append("price", formData.price || "");
            form.append("discount_price", formData.discount_price || "");
            form.append("discount_amount", formData.discount_amount || "");
            form.append("description", formData.description);
            form.append("category_id", formData.category_id);
            form.append("sub_category_id", formData.sub_category_id);
            // Convert boolean to string "1" or "0" for FormData (Laravel will convert it to boolean)
            form.append("isNew", formData.isNew ? "1" : "0");

            // Filter out empty size guides before sending
            const validSizeGuides = formData.size_guides.filter(
                (size) => size.name && size.name.trim() !== "" && 
                         size.chest && size.chest.trim() !== "" && 
                         size.body && size.body.trim() !== ""
            );
            
            validSizeGuides.forEach((size, index) => {
                form.append(`size_guides[${index}][name]`, size.name);
                form.append(`size_guides[${index}][chest]`, size.chest);
                form.append(`size_guides[${index}][body]`, size.body);
            });

            // Filter out empty tags before sending
            const validTags = formData.tags.filter(
                (tag) => tag.name && tag.name.trim() !== ""
            );
            
            validTags.forEach((tag, index) => {
                form.append(`tags[${index}][name]`, tag.name);
                form.append(`tags[${index}][description]`, tag.description || "");
            });

            formData.availability.forEach((avail, index) => {
                form.append(`availability[${index}][size_id]`, avail.size_id);
                form.append(`availability[${index}][color_id]`, avail.color_id);
                form.append(`availability[${index}][quantity]`, avail.quantity);
            });

            const url = isEditMode ? `/product/update/with-availability/${slidersupdateid}` : "/product/with-availability";
            const method = isEditMode ? "post" : "post";

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
            const url = `/product/${deletesId}`;

            await instance.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            sliderFatching();
            setConfirmDeleteOpen(false);
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleSeletewizeData = (id) => {
        setSelectedCate(id);
    }

    const handleCloseDialog = () => {
        setOpen(false);
        setFormData({
            category_id: "",
            sub_category_id: "",
            name: "",
            fit: "",
            care: "",
            price: "",
            discount_price: "",
            discount_amount: "",
            description: "",
            tags: [{ name: '', description: '' }],
            size_guides: [{ name: "", chest: "", body: "" }],
            availability: [{ size_id: "", color_id: "", quantity: 0 }],
            isNew: true,
        });
        setIsEditMode(false);
        setSlidersUpdateId("");
    };

    useEffect(() => {
        sliderFatching();
        sizesFatching();
        ColorsFatching();
        catagroiesFatching();
    }, [selectedCate]);
    return (
        <>
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <Stack direction={"row"} justifyContent="space-between" alignItems="center" mb={2}>
                        <h3>Products Section :</h3>
                        <Button
                            variant="contained"
                            className="Medium"
                            sx={{ textTransform: "capitalize" }}
                            onClick={handleAdd}
                            color="background2"
                        >
                            Add Product
                        </Button>
                    </Stack>
                    <Stack direction={"row"} spacing={1} py={2}>
                        <ButtonGroup variant="contained" color="primary">
                            <Button
                                className="Medium"
                                onClick={() => handleSeletewizeData("all")}
                                aria-label="All Products"
                                sx={{
                                    textTransform: 'capitalize',
                                    backgroundColor: selectedCate === "all" ? 'background2.main' : 'primary.main',
                                    '&:hover, &:focus, &:active': {
                                        backgroundColor: selectedCate === "all" ? 'background2.main' : 'primary.main'
                                    }
                                }}
                            >
                                All Products
                            </Button>
                            {categoriesFatch?.slice()?.reverse()?.map((catsList, index) => (
                                <Button
                                    className="Medium"
                                    onClick={() => handleSeletewizeData(catsList.id)}
                                    aria-label=""
                                    sx={{
                                        textTransform: 'capitalize',
                                        backgroundColor: selectedCate === catsList.id ? 'background2.main' : 'primary.main',
                                        '&:hover, &:focus, &:active': {
                                            backgroundColor: selectedCate === catsList.id ? 'background2.main' : 'primary.main'
                                        }
                                    }}
                                    key={index}
                                >
                                    {catsList?.name}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </Stack>

                    {/* Category Header */}
                    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="h6" className="Medium">
                            {selectedCate === "all"
                                ? "All Products"
                                : `Products in ${categoriesFatch?.find(cat => cat.id === selectedCate)?.name || 'Selected Category'}`
                            }
                            <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                                ({sliderFatch?.length || 0} products)
                            </Typography>
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        {sliderFatch?.map((item, index) => (
                            <Grid item xs={12} md={4} lg={4} xl={3} key={index}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        padding: 2,
                                        borderRadius: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <img
                                            src={item?.product_images?.[0]?.image || "/placeholder-image.jpg"}
                                            alt={item.name || "Product Image"}
                                            loading="lazy"
                                            style={{ width: "100%", borderRadius: 5 }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {item.name}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    backgroundColor: item.category?.name?.toLowerCase() === 'wholesale' ? '#4caf50' : '#2196f3',
                                                    color: 'white',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {item.category?.name || 'Unknown'}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            mt={1}
                                            sx={{ whiteSpace: "pre-line" }}
                                        >
                                            {item.description?.replace(/<[^>]+>/g, "").slice(0, 100)} ...
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={1} mt={2} justifyContent="space-between" width={"100%"}>
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
                                        <Button
                                            size="small"
                                            variant="contained"
                                            fullWidth
                                            color="background4"
                                            className="Medium"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeletes(item)}
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                </Paper>
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
                maxWidth="md"
            // PaperProps={{
            //     sx: { width: "600px", maxWidth: "100%" },
            // }}
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
                            size="small"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            fullWidth
                        />
                        <TextField
                            label="Fit"
                            name="fit"
                            size="small"
                            value={formData.fit}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            fullWidth
                        />
                        <TextField
                            label="Care"
                            name="care"
                            size="small"
                            value={formData.care}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            fullWidth
                        />
                        <TextField
                            label="Price"
                            name="price"
                            size="small"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter product price"
                            fullWidth
                        />
                        <Stack direction={"row"} spacing={1}>
                            <TextField
                                label="Discount Price"
                                name="discount_price"
                                size="small"
                                value={formData.discount_price}
                                onChange={handleInputChange}
                                placeholder="Enter discount price"
                                fullWidth
                                helperText="Price after discount"
                            />
                            <TextField
                                label="Discount Amount"
                                name="discount_amount"
                                size="small"
                                value={formData.discount_amount}
                                onChange={handleInputChange}
                                placeholder="Enter discount amount"
                                fullWidth
                                helperText="Discount percentage or fixed amount"
                            />
                        </Stack>
                        <TextEditor
                            value={formData.description}
                            placeholder={"Enter your description"}
                            onChange={handleChange1}
                        />
                        <Stack direction={"row"} spacing={1} alignItems="center">
                            <Select
                                fullWidth
                                size="small"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                MenuProps={{ PaperProps: { style: { maxHeight: 224 } } }}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select Category
                                </MenuItem>
                                {categoriesFatch?.map((cate) => (
                                    <MenuItem key={cate.id} value={cate.id}>{cate.name}</MenuItem>
                                ))}
                            </Select>

                            <Select
                                fullWidth
                                size="small"
                                name="sub_category_id"
                                value={formData.sub_category_id}
                                onChange={handleInputChange}
                                MenuProps={{ PaperProps: { style: { maxHeight: 224 } } }}
                                disabled={!formData.category_id || loadingCate}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    {!formData.category_id 
                                        ? "Select category first" 
                                        : loadingCate 
                                        ? "Loading subcategories..." 
                                        : subCategoriesFatch?.length === 0
                                        ? "No subcategories available"
                                        : "Select Sub Category"}
                                </MenuItem>
                                {!loadingCate && subCategoriesFatch?.map((subCategor) => (
                                    <MenuItem key={subCategor.id} value={subCategor.id}>
                                        {subCategor.name}
                                    </MenuItem>
                                ))}
                            </Select> 
                        </Stack>
                        <Typography variant="body1" className="Medium" color="initial">Tags :</Typography>
                        {formData?.tags?.map((item, index) => (
                            <Stack key={index} direction={"column"} spacing={2}>
                                <TextField
                                    label="Tag Name"
                                    name="name"
                                    size="small"
                                    fullWidth
                                    value={item.name}
                                    onChange={(e) => handleTagChange(index, e)}
                                />
                                <TextEditor
                                    value={item.description}
                                    onChange={(val) => handleTagEditorChange(index, val)}
                                    placeholder={"Enter your description"}
                                />
                                <Stack direction={"row"} spacing={1}>

                                    {formData.tags.length > 1 && (

                                        <IconButton onClick={() => handleTagesDelete(index)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    )}
                                </Stack>
                            </Stack>
                        ))}

                        <Button
                            onClick={handletagsadd}
                            variant="contained"
                            color="background3"
                            startIcon={<AddIcon />}
                            className="Medium"
                            sx={{ textTransform: "capitalize", maxWidth: 130 }}
                        >
                            More Tag
                        </Button>


                        <Stack direction={"column"} spacing={2}>
                            <Typography variant="body1" className="Medium" color="initial">Availability :</Typography>

                            {formData?.availability?.map((item, index) => {
                                // console.log(item, "item")
                                return (
                                    <Stack key={index} direction={"row"} spacing={1} alignItems="center">
                                        <Select
                                            fullWidth
                                            size="small"
                                            name="size_id"
                                            MenuProps={{ PaperProps: { style: { maxHeight: 224 } } }}
                                            value={item.size_id}
                                            onChange={(e) => handleAvailabilityChange(index, e)}
                                        >
                                            {sizesFatch?.map((size) => (
                                                <MenuItem key={size.id} value={size.id}>{size.name}</MenuItem>
                                            ))}
                                        </Select>

                                        <Select
                                            fullWidth
                                            size="small"
                                            name="color_id"
                                            value={item.color_id}
                                            MenuProps={{ PaperProps: { style: { maxHeight: 224 } } }}
                                            onChange={(e) => handleAvailabilityChange(index, e)}
                                        >
                                            {colorsFatch?.map((color) => (
                                                <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>
                                            ))}
                                        </Select>

                                        <TextField
                                            label="Quantity"
                                            size="small"
                                            name="quantity"
                                            type="number"
                                            fullWidth
                                            value={item.quantity}
                                            onChange={(e) => handleAvailabilityChange(index, e)}
                                        />

                                        {formData.availability.length > 1 && (
                                            <IconButton
                                                onClick={() => handleDeleteAvailability(index)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </Stack>
                                )
                            })}

                            <Button
                                variant="contained"
                                color="background3"
                                startIcon={<AddIcon />}
                                className="Medium"
                                sx={{ textTransform: "capitalize", maxWidth: 180 }}
                                onClick={handleAddAvailability}
                            >
                                Add Availability
                            </Button>
                        </Stack>
                        <Stack direction={"column"} spacing={2}>
                            <Typography variant="body1" className="Medium" color="initial">Size Guides :</Typography>

                            {formData?.size_guides?.map((size, index) => (
                                <Stack key={index} direction={"row"} spacing={1}>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        size="small"
                                        fullWidth
                                        value={size.name}
                                        onChange={(e) => handleSizeGuideChange(index, e)}
                                    />
                                    <TextField
                                        label="Chest"
                                        name="chest"
                                        size="small"
                                        fullWidth
                                        value={size.chest}
                                        onChange={(e) => handleSizeGuideChange(index, e)}
                                    />
                                    <TextField
                                        label="Body"
                                        size="small"
                                        name="body"
                                        fullWidth
                                        value={size.body}
                                        onChange={(e) => handleSizeGuideChange(index, e)}
                                    />
                                    {formData.size_guides.length > 1 && (
                                        <IconButton onClick={() => handleDeleteSizeGuide(index)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    )}
                                </Stack>
                            ))}

                            <Button
                                variant="contained"
                                color="background3"
                                startIcon={<AddIcon />}
                                className="Medium"
                                sx={{ textTransform: "capitalize", maxWidth: 180 }}
                                onClick={handleAddSizeGuide}
                            >
                                Add Size Guide
                            </Button>
                            <Stack direction={"row"} alignItems={"center"} spacing={1}> 
                                <Typography variant="body2" className="Medium">
                                    New Arrival product
                                </Typography>
                                <Switch
                                    checked={formData.isNew}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isNew: e.target.checked, 
                                        }))
                                    }
                                />
                            </Stack>
                        </Stack>
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
                open={viewProductOpen}
                onClose={() => setViewProductOpen(false)}
                // onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
            // PaperProps={{
            //     sx: { width: "600px", maxWidth: "100%" },
            // }}
            >
                <DialogContent>
                    <Stack direction={"row"} justifyContent="flex-end" alignItems="center" mb={2}>
                        <IconButton onClick={() => setViewProductOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>



                    <Stack direction={"column"} spacing={2}>
                        <Grid container spacing={0}>
                            <Stack direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"center"}>
                                {viewData?.product_images?.slice(0, 4)?.map((item, index) =>
                                    <Grid item xs={12} md={3} lg={3} xl={3} key={index}>
                                        <img src={item.image} alt="" style={{ width: "100%", borderRadius: 10, objectFit: "contain" }} />

                                    </Grid>)}


                            </Stack>

                        </Grid>

                        <Typography variant="h6" className="bold">
                            {viewData?.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            className="light"
                            color="text.secondary"
                            mt={1}
                            sx={{ whiteSpace: "pre-line" }}
                        >
                            {viewData?.description?.replace(/<[^>]+>/g, "")}

                        </Typography>
                        <Typography
                            variant="body2"
                            className="light"
                            color="text.secondary"
                            mt={1}
                            sx={{ whiteSpace: "pre-line" }}
                        >
                            <span className="bold" >Fit :</span>  {viewData?.fit}

                        </Typography>
                        <Typography
                            variant="body2"
                            className="light"
                            color="text.secondary"
                            mt={1}
                            sx={{ whiteSpace: "pre-line" }}
                        >
                            <span className="bold" >Care :</span>  {viewData?.care}

                        </Typography>
                        <Typography
                            variant="body2"
                            className="light"
                            color="text.secondary"
                            mt={1}
                            sx={{ whiteSpace: "pre-line" }}
                        >
                            <span className="bold" >Price :</span>  {viewData?.price}

                        </Typography>
                        {viewData?.tags?.length > 0 && viewData.tags.map((item) => {


                            return (
                                <Box key={item.id} mb={2}>
                                    <Typography variant="subtitle2" className="bold">Tags :</Typography>
                                    <Typography variant="subtitle2" className="Medium">{item.name}</Typography>
                                    <Typography variant="body2" color="text.secondary" className="light" sx={{ whiteSpace: "pre-line" }}>
                                        {item.description?.replace(/<[^>]+>/g, "")}
                                    </Typography>
                                </Box>
                            );
                        })}
                        {viewData?.size_guides?.length > 0 && <>  <Typography variant="body2" className="bold" >Size Guides :</Typography>
                            <TableContainer component={Paper} sx={{ mt: 2 }}>

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Size</strong></TableCell>
                                            <TableCell><strong>Chest (cm)</strong></TableCell>
                                            <TableCell><strong>Body Length (cm)</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {viewData?.size_guides?.map((size) => (
                                            <TableRow key={size.id}>
                                                <TableCell>{size.name}</TableCell>
                                                <TableCell>{size.chest}</TableCell>
                                                <TableCell>{size.body}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer></>}

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
                        Are you sure you want to delete this Product?
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

export default Products;
