import asyncerrorhandler from "../Common/Asyncerrorhandler.js";
import userdatabase from "../Models/userDetails.js";
import Productdatabase from "../Models/ProductDetailsdatabase.js";
import orderdatabase from "../Models/OrderModels.js";
import ErrorHandler from "../Common/errorHandler.js";

const newOrder=asyncerrorhandler(async(req,res,next)=>{
  try {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await orderdatabase.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
  } catch (error) {
   console.log(error);
  }
})
// get single order
const getsingleorder=asyncerrorhandler(async(req,res,next)=>{
  // to get user name id in the order details which user is order in this item
  const trimmedId = req.params.id.trim();
  console.log(trimmedId);
  const getorder= await orderdatabase.findById(trimmedId).populate('user','name email')
  try {
    if(!getorder){

      return next(new ErrorHandler(`order not in the user${req.params.id}`,404))
    }
    res.status(200).json({
      success:true,
      getorder
    })
    
  } catch (error) {
    console.log(error);
  }
  
})

const myorder=asyncerrorhandler(async(req,res,next)=>{
  const orders=await orderdatabase.find({user:req.user.id})
  if(!orders){
    return next(new ErrorHandler(`order not in the user${req.params.id}`,404))

  }
  res.status(200).json({
    success:true,
    orders
  })

})

// for admin to get all order from user
const getallorderbyadmin  = asyncerrorhandler(async(req,res,next)=>{
  const orders= await orderdatabase.find()

  try {
    let totalamount=0;
    orders.forEach(order=>{
      totalamount +=order.totalPrice
    })
    res.status(200).json({
      success:true,
      totalamount,
      orders
    })
    
  } catch (error) {
    console.log(error);

    
  }

})

// update order by using admin in stock and delivery status


const updatebyadmin = asyncerrorhandler(async (req, res, next) => {
  try {
    const orderId = req.params.id.trim(); // Trim the ID to remove any whitespace

    const order = await orderdatabase.findById(orderId);

    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }

    if (order.orderStatus === 'Delivered') {
      return next(new ErrorHandler('Order has already been delivered', 400));
    }

    // Update order status to "Delivered" and set deliveredAt time
    order.orderStatus = 'Delivered';
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated to delivered successfully'
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});



const deleteOrder = asyncerrorhandler(async (req, res, next) => {
  try {
    const orderId = req.params.id.trim(); // Trim the ID to remove any whitespace
    console.log(`Attempting to delete order with ID: ${orderId}`);

    const order = await orderdatabase.findById(orderId);
    console.log(order);
    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }

    await orderdatabase.findByIdAndDelete(orderId);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}) //not get the output

export default{
    newOrder,
    getsingleorder,
    myorder,
    getallorderbyadmin,
    updatebyadmin,
    deleteOrder
}
