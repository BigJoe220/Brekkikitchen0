const cartModel = require('../Models/cartModels');
const userModel = require('../Models/userModels');
const foodModel = require('../Models/foodModel');
const cartModels = require('../Models/cartModels');

 exports.addCart = async (req, res) => {
  try {
    // const { name, description, quantity, price, subtotal } = req.body;
    const {foodId}= req.params;
    const{id} = req.user
    const user = await userModel.findById(id)
    const food = await foodModel.findById(foodId)

    if(!user){
      return res.status(200).json({
        message:"user not found"
      })
    }
if(!food){
  return res.status(200).json({
    message:"food not found"
  })
}
    // Check if item already exists in cart
    const cartExists = await cartModel.findOne({ name:food.name });
    if (cartExists) {
       cartExists.quantity++
      return res.status(400).json({
        message: `Quantity for ${cartExists.name} has been increased`,
        data:cartExists
      });
    }

    // Create new cart item
    const cart = await cartModel.create({
      name: food.name,
      description: food.description,
      price:food.price,
      subtotal:food.price,
      userId:user._id,
      foodId:food._id

    });
     await cart.save()
    // Send success response
    return res.status(201).json({
      message: 'Item added to cart successfully.',
      cart,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



exports.increase = async(req, res)=>{
  try{
     const {cartId}= req.params;
    const{id} = req.user
    const cart = await cartModel.findById(cartId)
    const user = await userModel.findById(id)
    const food = await foodModel.findById(cart.foodId)

    if(!user){
      return res.status(200).json({
        message:"user not found"
      })
    };
if(!food){
  return res.status(200).json({
    message:"food not found"
  })
}
cart.quantity++
cart.Subtotal = cart.price * cart.quantity;
await cart.save();
    return res.status(400).json({
        message: `Quantity for ${cart.name} has been increased`,
        data:cart
      });
  }catch(error){
    res.status(500).json({
      message:error.message
    })
  }
}


exports.decrease = async(req, res)=>{
  try{
     const {cartId}= req.params;
    const{id} = req.user
    const cart = await cartModel.findById(cartId)
    const user = await userModel.findById(id)
    const food = await foodModel.findById(cart.foodId)

    if(!user){
      return res.status(200).json({
        message:"user not found"
      })
    };
if(!food){
  return res.status(200).json({
    message:"food not found"
  })
}
if(cart.quantity===0){
  await cartModel.findByIdAndDelete(cart._id);
  await cart.save()
  return res.status(200).json({
    message:"food removed from cart"
  })
}
cart.quantity--
cart.Subtotal = cart.price * cart.quantity;
await cart.save();
    return res.status(400).json({
        message: `Quantity for ${cart.name} has been decreased`,
        data:cart
      });
  }catch(error){
    res.status(500).json({
      message:error.message
    })
  }
}

exports.remove = async(req, res)=>{
  try{
     const {cartId}= req.params;
    const{id} = req.user
    const cart = await cartModel.findById(cartId)
    const user = await userModel.findById(id)

    if(!user){
      return res.status(200).json({
        message:"user not found"
      })
    };
    return res.status(400).json({
      message:"item removed from cart sucessfully"
    })
await cartModel.findById(cart._id)
  }catch(error){
    res.status(500).json({
      message: error.message
    })
  }
}



exports.getAll = async (req, res) => {
  try {
    const carts = await cartModels.find(); // Assuming the model is named `cartModel`
    let total;
    if(carts.length===0){
      total=0

    }
    else{
      total=carts.reduce((a,b)=>a+b.quantity,0)
    }
    return res.status(200).json({
      message: "All carts retrieved successfully",
      data: carts,
      total:total
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await cartModel.findById(id);

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      message: "Retrieved cart successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};







 
 

