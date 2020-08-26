var User = require("../../models/user.model");
var Book = require("../../models/book.model");
var Transaction = require("../../models/transaction.model");
let Shops = require('../../models/shop.model')


module.exports.index = async (req, res) => {
  Shops.find()
   .populate('userId', "_id name email avatar isAdmin")
   .populate('listBook.bookId', "_id description title coverUrl")
   .sort("-createdAt")
   .then(shops =>{
     res.json({
       shops
      })
   }).catch(err=>{
     console.log(err)
   })
};

module.exports.createPost=  (req, res) => {
    const userId = req.user._id;
    const {name} = req.body;

    try {
        if(!userId){
            return res.status(401).json({error: "Bạn phải đăng nhập"})
          }
        
        if(!name){
            return res.status(422).json({error: "Vui lòng điền tên cửa hàng!"});
        }

        const shop =  new Shops();
        shop.name = name;
        shop.userId = userId;
        shop.status = true;
        //shop.listBook = itemBook;
        shop.save().then(result=>{
            res.json({newShop: result,
                    message: "Tạo cửa hàng thành công"
                });
        }).catch(err=>{
            res.status(422).json({error: err})
        })       
        
    } catch (err) {
      console.log(err);
    }
  }

module.exports.addShopUser= async  (req, res) => {
    const userId = req.user._id;
    // const {_id} = req.user.shopOwner;
    const shopmatch = await  Shops.findOne({userId: req.user._id})
    try {        
        if(shopmatch){
            User.findByIdAndUpdate(req.user._id,{
                $set: {shopOwner: shopmatch._id}
            })
            .select("-password")
            .populate("shopOwner", "name listBook status")
            .then(r =>{
                res.json({newShop: r,
                    message: "Thêm shop vao user thành công "
                });
            })
            .catch(err =>{
            console.log(err); 
            })
        }else{
            console.log("Không có shop")
        }     
             
    } catch (err) {
      console.log(err);
    }
  }