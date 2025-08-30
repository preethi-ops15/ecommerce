import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { clearSelectedProduct, fetchProductByIdAsync,resetProductUpdateStatus, selectProductUpdateStatus, selectSelectedProduct, updateProductByIdAsync } from '../../products/ProductSlice'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery, useTheme, Alert, CircularProgress, Paper, Box } from '@mui/material'
import { useForm } from "react-hook-form"
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import { toast } from 'react-toastify'

export const ProductUpdate = () => {

    const {register,handleSubmit,watch,formState: { errors }} = useForm()

    const {id}=useParams()
    const dispatch=useDispatch()
    const selectedProduct=useSelector(selectSelectedProduct)
    const brands=useSelector(selectBrands)
    const categories=useSelector(selectCategories)
    const productUpdateStatus=useSelector(selectProductUpdateStatus)
    const navigate=useNavigate()
    const theme=useTheme()
    const is1100=useMediaQuery(theme.breakpoints.down(1100))
    const is480=useMediaQuery(theme.breakpoints.down(480))


    useEffect(()=>{
        if(id){
            dispatch(fetchProductByIdAsync(id))
        }
    },[id])

    useEffect(()=>{
        if(productUpdateStatus==='fulfilled'){
            toast.success("Product updated successfully! ✨")
            navigate("/admin")
        }
        else if(productUpdateStatus==='rejected'){
            toast.error("Error updating product, please try again later")
        }
    },[productUpdateStatus])

    useEffect(()=>{
        return ()=>{
            dispatch(clearSelectedProduct())
            dispatch(resetProductUpdateStatus())
        }
    },[])

    const handleProductUpdate=(data)=>{
        const productUpdate={...data,_id:selectedProduct._id,images:[data?.image0,data?.image1,data?.image2,data?.image3]}
        delete productUpdate?.image0
        delete productUpdate?.image1
        delete productUpdate?.image2
        delete productUpdate?.image3

        dispatch(updateProductByIdAsync(productUpdate))
    }

    const renderAlert = () => {
        if (productUpdateStatus === 'pending') {
            return (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Updating product... Please wait
                    <CircularProgress size={20} sx={{ ml: 2 }} />
                </Alert>
            )
        }
        return null
    }

    if (!selectedProduct) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

  return (
    <Stack spacing={4}>
        {renderAlert()}
        
        <Typography variant="h4" fontWeight={600}>
            Update Product
        </Typography>

        <Paper elevation={1} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit(handleProductUpdate)}>
                <Stack spacing={3}>
                    <Stack>
                        <Typography variant='h6' fontWeight={500} gutterBottom>Title</Typography>
                        <TextField 
                            {...register("title",{required:'Title is required',value:selectedProduct.title})}
                            fullWidth
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />
                    </Stack> 

                    <Stack flexDirection={is480 ? 'column' : 'row'} spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel id="brand-selection">Brand</InputLabel>
                            <Select 
                                defaultValue={selectedProduct.brand?._id} 
                                {...register("brand",{required:"Brand is required"})} 
                                labelId="brand-selection" 
                                label="Brand"
                            >
                                {brands.map((brand)=>(
                                    <MenuItem key={brand._id} value={brand._id}>{brand.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="category-selection">Category</InputLabel>
                            <Select 
                                defaultValue={selectedProduct.category?._id} 
                                {...register("category",{required:"category is required"})} 
                                labelId="category-selection" 
                                label="Category"
                            >
                                {categories.map((category)=>(
                                    <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    <Stack>
                        <Typography variant='h6' fontWeight={500} gutterBottom>Description</Typography>
                        <TextField 
                            multiline 
                            rows={4} 
                            {...register("description",{required:"Description is required",value:selectedProduct.description})}
                            fullWidth
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                    </Stack>

                    <Stack flexDirection={is480 ? 'column' : 'row'} spacing={2}>
                        <Stack flex={1}>
                            <Typography variant='h6' fontWeight={500} gutterBottom>Price</Typography>
                            <TextField 
                                type='number' 
                                {...register("price",{required:"Price is required",value:selectedProduct.price})}
                                fullWidth
                                error={!!errors.price}
                                helperText={errors.price?.message}
                            />
                        </Stack>
                        <Stack flex={1}>
                            <Typography variant='h6' fontWeight={500} gutterBottom>Discount Percentage</Typography>
                            <TextField 
                                type='number' 
                                {...register("discountPercentage",{required:"discount percentage is required",value:selectedProduct.discountPercentage})}
                                fullWidth
                                error={!!errors.discountPercentage}
                                helperText={errors.discountPercentage?.message}
                            />
                        </Stack>
                    </Stack>

                    <Stack>
                        <Typography variant='h6' fontWeight={500} gutterBottom>Stock Quantity</Typography>
                        <TextField 
                            type='number' 
                            {...register("stockQuantity",{required:"Stock Quantity is required",value:selectedProduct.stockQuantity})}
                            fullWidth
                            error={!!errors.stockQuantity}
                            helperText={errors.stockQuantity?.message}
                        />
                    </Stack>
                    
                    <Stack>
                        <Typography variant='h6' fontWeight={500} gutterBottom>Thumbnail</Typography>
                        <TextField 
                            {...register("thumbnail",{required:"Thumbnail is required",value:selectedProduct.thumbnail})}
                            fullWidth
                            error={!!errors.thumbnail}
                            helperText={errors.thumbnail?.message}
                        />
                    </Stack>

                    <Stack>
                        <Typography variant='h6' fontWeight={500} gutterBottom>Product Images</Typography>
                        <Stack spacing={2}>
                            {selectedProduct.images?.map((image,index)=>(
                                <TextField 
                                    key={index}
                                    {...register(`image${index}`,{required:"Image is required",value:image})}
                                    fullWidth
                                    error={!!errors[`image${index}`]}
                                    helperText={errors[`image${index}`]?.message}
                                    placeholder={`Image ${index + 1} URL`}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </Stack>

                <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={is480?1:2} mt={3}>
                    <Button 
                        size={is480?'medium':'large'} 
                        variant='contained' 
                        type='submit'
                        disabled={productUpdateStatus === 'pending'}
                    >
                        {productUpdateStatus === 'pending' ? 'Updating...' : 'Update Product'}
                    </Button>
                    <Button 
                        size={is480?'medium':'large'} 
                        variant='outlined' 
                        color='error' 
                        component={Link} 
                        to={'/admin'}
                    >
                        Cancel
                    </Button>
                </Stack>
            </form>
        </Paper>
    </Stack>
  )
}
