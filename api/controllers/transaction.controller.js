var User = require("../../models/user.model");
var Book = require("../../models/book.model");
var Transaction = require("../../models/transaction.model");

module.exports.index = async (req, res) => {
  var total = await Transaction.find()
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
  var id = req.params.id;
  const trans = await Transaction.find({});
  var error = [];

  // if(trans.id != id)
  //   error.push('Yêu cầu không hợp lệ.')
  // if(error.length){
  //   res.render('transactions/complete',{
  //     errors: error
  //   })
  //   return;
  // }
  if (!trans.isComplete)
    await Transaction.findByIdAndUpdate({ _id: id }, { isComplete: true });
  return res.status(200).json({
    transaction: trans
  });
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
