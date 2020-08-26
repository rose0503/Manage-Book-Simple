var User = require("../../models/user.model");
var Book = require("../../models/book.model");
var Transaction = require("../../models/transaction.model");

module.exports.index = async (req, res) => {
  Transaction.find()
   .populate('userId', "_id name email avatar isAdmin")
   .populate('bookRent.bookId', "_id description title coverUrl")
   .sort("-createdAt")
   .then(trans =>{
     res.json({
       trans
      })
   }).catch(err=>{
     console.log(err)
   })
};


module.exports.getTransId = async (req,res)=>{
  await Transaction.findOne({userId:req.user._id})
  .populate('userId', "_id name email avatar isAdmin")
  .populate('bookRent.bookId', "_id description title coverUrl")
  .sort("-createdAt")
  .then(trans =>{
    res.json({
      trans : [trans]
    })
  }).catch(err=>{
  return res.status(404).json({error:"Không tìm thấy!"})
  })
  
}

module.exports.complete = async (req, res) => {
  const userId = req.user._id;
  const bookid = req.params.id
  
  if(!userId){
    return res.status(401).json({error: "Bạn phải đăng nhập"})
  }

  Transaction.updateOne({bookRent: {"$elemMatch":{bookId: bookid}}, userId:req.user._id},
    {$set: {"bookRent.$.isComplete": true, "bookRent.$.dateBack": Date.now()}},
    function(err, result){
        if(err){
          return res.status(422).json({error: err});
      }else{
        res.json({trans: result,
          message: "Bạn đã trả sách thành công"
        });
      }
      }
  )

};

module.exports.postCreate = async (req, res) => {
  //console.log("result req.body", req.body)
  const newTransaction = new Transaction({
    bookId: req.body.bookId,
    userId: req.body.userId
  });
  //console.log("newTransaction", newTransaction)
  await newTransaction.save();
  return res.status(200).json({
    transaction: newTransaction
  });
  
};
