import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate} from 'react-router-dom'
import { addProductAsync, resetProductAddStatus, selectProductAddStatus,updateProductByIdAsync } from '../../products/ProductSlice'
import { 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    Stack, 
    TextField, 
    Typography, 
    useMediaQuery, 
    useTheme, 
    Box, 
    Paper, 
    Divider, 
    InputAdornment, 
    Alert, 
    CircularProgress, 
    IconButton 
} from '@mui/material'
import { useForm } from "react-hook-form"
import { selectBrands, fetchAllBrandsAsync } from '../../brands/BrandSlice'
import { selectCategories, fetchAllCategoriesAsync } from '../../categories/CategoriesSlice'
import { toast } from 'react-toastify'
import { CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material'
import PriceBreakupSection from './PriceBreakupSection'
import LiveRateDisplay from './LiveRateDisplay'

export const AddProduct = () => {
    const {register, handleSubmit, reset, watch, setValue, formState: { errors }} = useForm()
    const dispatch = useDispatch()
    const brands = useSelector(selectBrands)
    const categories = useSelector(selectCategories)
    const productAddStatus = useSelector(selectProductAddStatus)
    const navigate = useNavigate()
    const theme = useTheme()
    const is1100 = useMediaQuery(theme.breakpoints.down(1100))
    const is480 = useMediaQuery(theme.breakpoints.down(480))
    const imageInputRef = useRef();
    const thumbnailInputRef = useRef();
    const [selectedImages, setSelectedImages] = React.useState([]);
    const [selectedThumbnail, setSelectedThumbnail] = React.useState(null);

    useEffect(() => {
        if (productAddStatus === 'fulfilled') {
            reset()
            setSelectedImages([])
            setSelectedThumbnail(null)
            toast.success("✨ Product added successfully! Your jewelry item is now available in the shop.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: {
                    backgroundColor: '#4caf50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            })
            navigate("/admin")
        } else if (productAddStatus === 'rejected') {
            toast.error("❌ Error adding product. Please check all required fields and try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: {
                    backgroundColor: '#f44336',
                    color: 'white',
                    fontWeight: 'bold'
                }
            })
        }
    }, [productAddStatus])

    useEffect(() => {
        return () => {
            dispatch(resetProductAddStatus())
        }
    }, [dispatch])

    // Fetch brands and categories on component mount
    useEffect(() => {
        dispatch(fetchAllBrandsAsync())
        dispatch(fetchAllCategoriesAsync())
    }, [dispatch])

    const handleAddProduct = (data) => {
        console.log('Form Data Being Sent:', data);
        
        // Validate required fields for dynamic pricing
        if (!data.productWeight || !data.makingCost || !data.wastageCost || !data.gstPercentage) {
            toast.error("Please fill in all required fields: Product Weight, Making Cost, Wastage Cost, and GST Percentage");
            return;
        }
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            // Skip the plain thumbnail text field; we'll append the actual file below
            if (key === 'thumbnail') return;

            // Map gstPercentage (used in the form) to gst (expected by backend)
            if (key === 'gstPercentage') {
                formData.append('gst', value);
                return;
            }

            formData.append(key, value);
        });
        
        // Add thumbnail file
        if (selectedThumbnail) {
            formData.append('thumbnail', selectedThumbnail);
        }
        
        // Add product images
        selectedImages.forEach((file, idx) => {
            formData.append('images', file);
        });
        
        // Add pricing strategy
        formData.append('pricingStrategy', 'dynamic');
        formData.append('isPreciousMetal', data.brand && (
            data.brand.includes('gold') || 
            data.brand.includes('silver') ||
            data.brand === 'diamond'
        ) ? 'true' : 'false');
        
        dispatch(addProductAsync(formData));
    }

    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Thumbnail image must be less than 5MB");
                return;
            }
            setSelectedThumbnail(file);
        }
    };

    const handleImagesChange = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast.error(`${file.name} is too large. Max size is 10MB`);
                return false;
            }
            return true;
        });
        setSelectedImages(validFiles);
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeThumbnail = () => {
        setSelectedThumbnail(null);
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
    };

    const renderAlert = () => {
        if (productAddStatus === 'pending') {
            return (
                <Alert 
                    severity="info" 
                    sx={{ 
                        mb: 3,
                        backgroundColor: '#e3f2fd',
                        border: '1px solid #2196f3',
                        '& .MuiAlert-icon': {
                            color: '#2196f3'
                        }
                    }}
                >
                    <Typography variant="body1" fontWeight={600}>
                        🎨 Adding your jewelry product to the collection...
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Please wait while we process your product details and images.
                    </Typography>
                </Alert>
            )
        }
        return null
    }

    return (
        <Stack spacing={4}>
            {renderAlert()}
            <form onSubmit={handleSubmit(handleAddProduct)} style={{ width: '100%' }}>
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 1 }}>
                    <Typography variant='h5' fontWeight={600} gutterBottom sx={{ color: '#1976d2', mb: 3 }}>
                        Add New Product
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                        Fill in the details below to add a new product to your catalog.
                    </Typography>
                    <Stack flexDirection={is480 ? 'column' : 'row'} spacing={2} sx={{
                        width: '100%',
                        '& > *': {
                            flex: 1,
                            minWidth: '200px'
                        }
                    }}>
                        <Stack flex={1} sx={{
                            width: '100%',
                            '& .MuiFormControl-root': {
                                width: '100%'
                            }
                        }}>
                            <Typography variant='body1' fontWeight={500} gutterBottom>Product Name *</Typography>
                            <TextField 
                                placeholder="e.g., 'The Duchess' Diamond Ring"
                                {...register("title",{
                                    required: 'Product name is required',
                                    maxLength: {
                                        value: 100,
                                        message: 'Product name must be less than 100 characters'
                                    }
                                })}
                                fullWidth
                                error={!!errors.title}
                                helperText={errors.title?.message}
                            />
                        </Stack>
                        <Stack flex={1} sx={{
                            width: '100%',
                            '& .MuiFormControl-root': {
                                width: '100%'
                            }
                        }}>
                            <Typography variant='body1' fontWeight={500} gutterBottom>SKU *</Typography>
                            <TextField 
                                placeholder="e.g., SKU-DR-001"
                                {...register("sku",{
                                    required: 'SKU is required',
                                    pattern: {
                                        value: /^[A-Z0-9-]+$/i,
                                        message: 'SKU must contain only letters, numbers, and hyphens'
                                    }
                                })}
                                fullWidth
                                error={!!errors.sku}
                                helperText={errors.sku?.message}
                            />
                        </Stack>
                    </Stack>

                    {/* Description */}
                    <Stack>
                        <Typography variant='body1' fontWeight={500} gutterBottom>Description *</Typography>
                        <TextField 
                            multiline 
                            rows={4} 
                            placeholder="Describe the product in detail..."
                            {...register("description",{required:"Description is required"})}
                            fullWidth
                        />
                    </Stack>

                    {/* Material Specifications and Dimensions */}
                    <Stack flexDirection={is480 ? 'column' : 'row'} spacing={2} sx={{
                        width: '100%',
                        '& > *': {
                            flex: 1,
                            minWidth: '200px'
                        }
                    }}>
                        <Stack flex={1} sx={{
                            width: '100%',
                            '& .MuiFormControl-root': {
                                width: '100%'
                            }
                        }}>
                            <Typography variant='body1' fontWeight={500} gutterBottom>Material Specifications *</Typography>
                            <TextField 
                                placeholder="e.g., 18k White Gold"
                                {...register("materialSpecs",{required:'Material specifications required'})}
                                fullWidth
                            />
                        </Stack>
                        <Stack flex={1} sx={{
                            width: '100%',
                            '& .MuiFormControl-root': {
                                width: '100%'
                            }
                        }}>
                            <Typography variant='body1' fontWeight={500} gutterBottom>Dimensions</Typography>
                            <TextField 
                                placeholder="e.g., 20mm x 15mm x 5mm"
                                {...register("dimensions")}
                                fullWidth
                            />
                        </Stack>
                    </Stack>

                    {/* Material and Category */}
                    <Stack flexDirection={is480 ? 'column' : 'row'} spacing={2} sx={{
                        width: '100%',
                        '& > *': {
                            flex: 1,
                            minWidth: '200px'
                        }
                    }}>
                        <Stack flex={1} sx={{
                            width: '100%',
                            '& .MuiFormControl-root': {
                                width: '100%'
                            }
                        }}>
                            <Typography variant='body1' fontWeight={500} gutterBottom>Material *</Typography>
                            <FormControl fullWidth>
                                <InputLabel>Select Material</InputLabel>
                                <Select
                                    {...register("brand", {required: "Material is required"})}
                                    label="Select Material"
                                    defaultValue=""
                                >
                                    {/* Gold Materials */}
                                    <MenuItem value="24k-gold">24K Gold</MenuItem>
                                    <MenuItem value="22k-gold">22K Gold</MenuItem>
                                    <MenuItem value="18k-gold">18K Gold</MenuItem>
                                    
                                    {/* Silver Materials */}
                                    <MenuItem value="999-silver">Pure Silver (999)</MenuItem>
                                    
                                    {/* Diamond Materials */}
                                    <MenuItem value="diamond">Diamond</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack flex={1} sx={{
                            width: '100%',
                            '& .MuiFormControl-root': {
                                width: '100%'
                            }
                        }}>
                            <Typography variant='body1' fontWeight={500} gutterBottom>Category *</Typography>
                            <FormControl fullWidth>
                                <InputLabel>Select Category</InputLabel>
                                <Select
                                    {...register("category", {required: "Category is required"})}
                                    label="Select Category"
                                    defaultValue=""
                                >
                                    <MenuItem value="rings">Rings</MenuItem>
                                    <MenuItem value="necklaces">Necklaces</MenuItem>
                                    <MenuItem value="earrings">Earrings</MenuItem>
                                    <MenuItem value="bracelets">Bracelets</MenuItem>
                                    <MenuItem value="chains">Chains</MenuItem>
                                    <MenuItem value="pendants">Pendants</MenuItem>
                                    <MenuItem value="anklets">Anklets</MenuItem>
                                    <MenuItem value="watches">Watches</MenuItem>
                                    <MenuItem value="brooches">Brooches</MenuItem>
                                    <MenuItem value="cufflinks">Cufflinks</MenuItem>
                                    <MenuItem value="nose-pins">Nose Pins</MenuItem>
                                    <MenuItem value="toe-rings">Toe Rings</MenuItem>
                                    <MenuItem value="hair-accessories">Hair Accessories</MenuItem>
                                    <MenuItem value="sets">Jewelry Sets</MenuItem>
                                    <MenuItem value="other">Other Jewelry</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>

                    {/* Live Rate Display */}
                    <LiveRateDisplay selectedMaterial={watch('brand')} />

                    {/* Stock Quantity */}
                    <Stack>
                            <Typography variant='body1' fontWeight={500} gutterBottom>Stock Quantity *</Typography>
                            <TextField 
                                type='number'
                                placeholder="e.g., 100"
                            {...register("stockQuantity",{
                                    required: 'Stock quantity is required',
                                    min: {
                                        value: 0,
                                        message: 'Stock quantity must be at least 0'
                                    }
                                })}
                                fullWidth
                                error={!!errors.stock}
                                helperText={errors.stock?.message}
                            />
                        </Stack>

                    {/* Thumbnail Image Upload */}
                    <Stack>
                            <Typography variant='body1' fontWeight={500} gutterBottom>Thumbnail Image *</Typography>
                        <Box 
                            sx={{ 
                                border: '2px dashed #ccc', 
                                borderRadius: 2, 
                                p: 3, 
                                textAlign: 'center',
                                bgcolor: '#fafafa',
                                position: 'relative'
                            }}
                        >
                            {selectedThumbnail ? (
                                <Box>
                                    <img 
                                        src={URL.createObjectURL(selectedThumbnail)} 
                                        alt="thumbnail preview" 
                                        style={{ 
                                            maxWidth: '200px', 
                                            maxHeight: '200px', 
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }} 
                                    />
                                    <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={removeThumbnail}
                                        >
                                            Remove
                                        </Button>
                        </Stack>
                                </Box>
                            ) : (
                                <Box>
                                    <UploadIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                                    <Typography variant='body1' color='primary' sx={{ mb: 1 }}>
                                        Upload thumbnail image
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                                        PNG, JPG, GIF up to 5MB
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<UploadIcon />}
                                    >
                                        Select Thumbnail
                                        <input
                                            ref={thumbnailInputRef}
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleThumbnailChange}
                                        />
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Stack>

                    {/* Gemstone Details */}
                    <Stack>
                        <Typography variant='body1' fontWeight={500} gutterBottom>Gemstone Details</Typography>
                        <TextField 
                            placeholder="e.g., 1.5 Carat, VVS1, G Color Diamond"
                            {...register("gemstoneDetails")}
                            fullWidth
                        />
                    </Stack>

                    {/* Price Breakup Section */}
                    <PriceBreakupSection 
                        watch={watch}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                    />
                    
                    {/* Dynamic Pricing Information */}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant='h6' fontWeight={600} gutterBottom>Dynamic Pricing Information</Typography>
                    
                    <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            <strong>Pricing will be calculated automatically based on:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            • <strong>Normal Users:</strong> Live metal rate × Total weight + Making charges + Wastage charges + GST
                        </Typography>
                        <Typography variant="body2">
                            • <strong>Members (Chit Plan):</strong> Live metal rate × Total weight (no additional charges)
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <em>Prices will update automatically with live market rates</em>
                        </Typography>
                    </Alert>

                    {/* Product Images */}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant='h6' fontWeight={600} gutterBottom>Product Images</Typography>
                    <Box 
                        sx={{ 
                            border: '2px dashed #ccc', 
                            borderRadius: 2, 
                            p: 4, 
                            textAlign: 'center',
                            bgcolor: '#fafafa'
                        }}
                    >
                        <UploadIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                        <Typography variant='body1' color='primary' sx={{ mb: 1 }}>
                            Upload product images
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                            PNG, JPG, GIF up to 10MB each. You can select multiple images.
                        </Typography>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<UploadIcon />}
                        >
                            Select Images
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={handleImagesChange}
                            />
                        </Button>
                        {selectedImages.length > 0 && (
                            <Stack direction="row" spacing={2} mt={2} justifyContent="center" flexWrap="wrap">
                                {selectedImages.map((file, idx) => (
                                    <Box key={idx} sx={{ 
                                        position: 'relative',
                                        width: 80, 
                                        height: 80, 
                                        border: '1px solid #eee', 
                                        borderRadius: 1, 
                                        overflow: 'hidden', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        bgcolor: '#fff' 
                                    }}>
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            alt={`preview-${idx}`} 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover' 
                                            }} 
                                        />
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 2,
                                                right: 2,
                                                bgcolor: 'rgba(255,255,255,0.8)',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                            }}
                                            onClick={() => removeImage(idx)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Box>

                    {/* Image Alt Text */}
                    <Stack>
                        <Typography variant='body1' fontWeight={500} gutterBottom>Image Alt Text</Typography>
                        <TextField 
                            placeholder="Enter descriptive alt text for each image, separated by commas."
                            {...register("imageAltText")}
                            fullWidth
                            helperText="Provide comma-separated descriptions for accessibility. E.g., 'Ring on a velvet box, Close-up of diamond, Model wearing the ring'"
                        />
                    </Stack>
                </Paper>
                <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={is480?1:2}>
                    <Button 
                        size={is480?'medium':'large'} 
                        variant='contained' 
                        type='submit'
                        disabled={productAddStatus === 'pending'}
                        sx={{
                            backgroundColor: '#1a1a1a',
                            color: 'white',
                            fontWeight: 600,
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: '#000000'
                            },
                            '&:disabled': {
                                backgroundColor: '#666',
                                color: '#ccc'
                            }
                        }}
                        startIcon={productAddStatus === 'pending' ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {productAddStatus === 'pending' ? 'Adding Jewelry Product...' : 'Add Jewelry Product'}
                    </Button>
                    <Button 
                        size={is480?'medium':'large'} 
                        variant='outlined' 
                        color='error' 
                        component={Link} 
                        to={'/admin'}
                        sx={{
                            borderColor: '#d4af37',
                            color: '#d4af37',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                borderColor: '#b8860b',
                                color: '#b8860b',
                                backgroundColor: '#fff8e1'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
}

export default AddProduct;
