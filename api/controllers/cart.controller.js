var Transaction = require("../../models/transaction.model");
const { identity } = require("lodash");

module.exports.postCart= async (req, res) => {
  const userId = req.user._id;
  const cartData = req.body.listCart
  
  if(!userId){
    return res.status(401).json({error: "Bạn phải đăng nhập"})
  }
  
  if(!cartData){
    return res.status(422).json({error: "Hãy chọn sản phẩm vào giỏ"})
  }

  let newcart = []
  cartData.map(item => {
  	const itemsub = {
    	bookId: item,
			isComplete: false,
			dateRent: Date.now(),
			dateBack: null        
    }
  	newcart.push(itemsub)
  })
  
  const transaction = await Transaction.findOne({userId})
  if(transaction){
    Transaction.update({userId : req.user._id},
      {$push: {bookRent: newcart}},
      function(err, result){
          if(err){
            return res.status(422).json({error: err});
        }else{
          res.json({newTran: result,
            message: "Thuê sách thành công"
          });
        }
        }
    ) 
  }else{
    req.user.password = undefined;
    const newData = new Transaction({
      userId: userId,
      bookRent: newcart
    });

    newData.save().then(result => {
      res.json({newTran: result,
        message: "Thuê sách thành công"
      });
    })
    .catch(err =>{
      return res.status(422).json({error: err});
      // console.log(err)
    })
  }
}