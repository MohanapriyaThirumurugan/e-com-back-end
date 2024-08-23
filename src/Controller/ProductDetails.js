import Productdatabase from "../Models/ProductDetailsdatabase.js"
import ErrorHandler from "../Common/errorHandler.js";
import errorhandlerasync from "../Common/Asyncerrorhandler.js"
import asyncerrorhandler from "../Common/Asyncerrorhandler.js";
import apifeature from '../utils/apifeature.js'
import cloudinary from "../cloudinary.js";
import mongoose from "mongoose";

// const getproductall = async (req, res, next) => {
//     try {
//       const resPerPage = 10;
  
//       // Build the query function
//       const buildqurey = () => {
//         return new apifeature(Productdatabase.find(), req.query)
//           .search()
//           .filter();
//       };
  
//       console.log("Request Query:", req.query);
  
//       // First build the query to get the count of filtered products
//       const filterQuery = buildqurey();
//       const filterproduct = await filterQuery.query.countDocuments({});
//       const totalproduct = await Productdatabase.countDocuments({});
  
//       let productcount = totalproduct;
//       if (filterproduct !== totalproduct) {
//         productcount = filterproduct;
//       }
  
//       // Log the product counts
//       console.log("Filtered Product Count:", filterproduct);
//       console.log("Total Product Count:", totalproduct);
  
//       // Build the query again for fetching the actual products with pagination
//       const paginatedQuery = buildqurey().paginate(resPerPage);
//       const products = await paginatedQuery.query;
  
//       // Log the products to debug
//       console.log("Fetched Products:", products);
  
//       res.status(200).send({
//         success: true,
//         count: productcount,
//         resPerPage,
//         products,
//       });
//     } catch (error) {
//       res.status(500).send({
//         success: false,
//         message: "Error fetching products",
//         error: error.message,
//       });
//     }
//   };

// const getproductall = async (req, res, next) => {
//     try {
//         const resPerPage = 3;

//         // Build the initial query
//         let query = Productdatabase.find();

//         // Initialize APIFeatures with the query and request query
//         const apiFeatures = new apifeature(query, req.query);

//         // Apply search, price filter, and category filter sequentially
//         apiFeatures
//             .search()
//             .filterByPrice()
//             .filterByCategory()
//             .paginate(resPerPage);

//         // Execute the query to get filtered and paginated results
//         const products = await apiFeatures.query;
//         const totalCount = await Productdatabase.countDocuments(apiFeatures.query._conditions);

//         res.status(200).json({
//             success: true,
//             count: products.length,
//             resPerPage,
//             totalProducts: totalCount,
//             products
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching products',
//             error: error.message
//         });
//     }
// };

const getAllProduct = async (req, res) => {
    try {
      const products = await Productdatabase.find(); // Fetch all products from the database
      
      res.status(200).send({
        success: true,
        count: products.length,
        products,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error fetching products",
        error: error.message,
      });
    }
  };


//http://localhost:8000/getall/search?category=Mobile phones

  const searchProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';  // Get the keyword from the query parameters
        const query = {
            $or: [
                { name: new RegExp(keyword, 'i') },          // Search in name (case-insensitive)
                { description: new RegExp(keyword, 'i') },   // Search in description (case-insensitive)
                // Add more fields as needed
            ]
        };

        const productsearch = await Productdatabase.find(query);

        res.status(200).send({
            success: true,
            count: productsearch.length,
            productsearch,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error searching products",
            error: error.message,
        });
    }
};

  
  
  
 const paginateProducts = async (req, res) => {
    try {
      const resPerPage = Number(req.query.limit) || 10; // Default to 10 products per page
      const currentPage = Number(req.query.page) || 1;
  
      const skip = resPerPage * (currentPage - 1);
  
      const products = await Productdatabase.find()
        .skip(skip)
        .limit(resPerPage);
  
      const productCount = await Productdatabase.countDocuments();
  
      res.status(200).send({
        success: true,
        count: productCount,
        products,
        currentPage,
        totalPages: Math.ceil(productCount / resPerPage)
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error paginating products",
        error: error.message,
      });
    }
  };
  
  
    
  
  
const createproduct = errorhandlerasync(async (req, res) => {
    const { name, category } = req.body;
    console.log(name,category);
    
    req.body.user = req.user.id;
    let images = [];
    // let BASE_URL = process.env.BACKEND_URL;
    // if(process.env.NODE_ENV === "production"){
    //     BASE_URL = `${req.protocol}://${req.get('host')}`
    // }

  
    if (req.files.length > 0) {
      const uploadPromises = req.files.map(file => 
        cloudinary.uploader.upload(file.path, { folder: 'productsimages' })
      );
  
      const uploadResults = await Promise.all(uploadPromises);
      images = uploadResults.map(result => ({ image: result.secure_url }));
    }
  
    req.body.images = images;
  
    try {
      const product = await Productdatabase.create(req.body);
      console.log(product);
      res.status(200).send({
        success: true,
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: 'Error creating product',
        error: error.message
      });
    }
  });

const getproductbyid=async(req,res,next)=>{

   try {
    let product=await Productdatabase.findById(req.params.id).populate('reviews.user','name email')

    if(!product){
        return next(new ErrorHandler('Product not found', 400))
    }

      res.status(200).send({
        sucesses:true,
        product
    })
    
   } catch (error) {
    res.status(500).send({
        sucesses:false,
        message: "Error creating product",
        error: error.message

    })
    
   }
}
const deleteproductbyid=async(req,res,next)=>{
    try {
        let product=await Productdatabase.findById(req.params.id)
    
        if(!product){
            return next(new ErrorHandler('Product not found', 400))

        }
        await Productdatabase.findByIdAndDelete(req.params.id);


            res.status(200).send({
            sucesses:true,
           message:"deleted sucessfully"
        })
        
       } catch (error) {
        res.status(500).send({
            sucesses:false,
            error: error.message
    
        })
        
       }
    
}
const editproductbyid = async (req, res, next) => {
    try {
        const productid = req.params.id;
        let images = []; 

        if (req.body.imagesCleared === 'false') {
            images = product.images;
        }
        let BASE_URL = process.env.BACKEND_URL;
        if(process.env.NODE_ENV === "production"){
            BASE_URL = `${req.protocol}://${req.get('host')}`
        }
    

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                let url = `${BASE_URL}/uploads/product/${file.originalname}`;
                images.push({ image: url });
            });
        }

        req.body.images = images;

        const product = await Productdatabase.findById(productid);
        if (!product) {
            return next(new ErrorHandler('Product not found', 400));
        } else {
            const edited = await Productdatabase.findByIdAndUpdate(productid, req.body, {
                new: true,
                runValidators: true,
            });
            res.status(200).send({
                success: true,
                message: "Product edited successfully",
                edited: edited
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error editing product",
            error: error.message
        });
    }
};
const createreveiw = asyncerrorhandler(async (req, res, next) => {
    // const { id  } = req.params;

    const {  rating, comment, productID } = req.body;

    const review = {
        user: req.user.id,
        rating,
        comment
    };

    const product = await Productdatabase.findById(productID);

    // Check if the product exists
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    // Finding if the user review exists
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString();
    });

    if (isReviewed) {
        // Updating the review
        product.reviews.forEach(review => {
            if (review.user.toString() == req.user.id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        // Creating the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Find the average of the product reviews
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / product.reviews.length;
    product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});


//Get reviews?id={productId}
const getReviews = asyncerrorhandler(async (req, res, next) =>{
    const product = await Productdatabase.findById(req.query.id).populate('reviews.user','name email');

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


//Deletreview
const deleteReview = asyncerrorhandler(async (req, res, next) => {
    const { id, reviewId } = req.params;
    console.log(id);
    console.log(reviewId);

    try {
        // Find the product by ID
        const product = await Productdatabase.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product before deletion:', product);

        // Check if the review exists
        const reviewIndex = product.reviews.findIndex(review => review._id.toString() === reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Log the review to be deleted
        console.log('Review to be deleted:', product.reviews[reviewIndex]);

        // Delete the review from the array
        product.reviews.splice(reviewIndex, 1);

        // Update the number of reviews
        product.numOfReviews = product.reviews.length;

        console.log('Product after deletion, before save:', product);

        // Validate remaining reviews before saving
        for (let review of product.reviews) {
            if (!review.rating || !review.comment || !review.user) {
                return res.status(400).json({ message: 'Invalid review data' });
            }
        }

        // Save the updated product
        await product.save();

        console.log('Product after save:', product);

        // Send a success response
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        // Log the error to the console for debugging
        console.error('Error deleting review:', error);

        // Send a detailed error response
        res.status(500).json({ message: 'Server error', error: error.message || error });
    }
    
   

});

// get admin products
const getAdminProducts=asyncerrorhandler(async(req,res,next)=>{
    const products = await Productdatabase.find();
    res.status(200).send({
        success: true,
        products
    })
    console.log(getAdminProducts);
})

export default{
    getAllProduct,
    createproduct,
    getproductbyid,
    deleteproductbyid,
    editproductbyid,
    createreveiw,
    getReviews,
    deleteReview,
    getAdminProducts,
    searchProducts,
    paginateProducts,

    
}