const cloudinary = require("cloudinary").v2;


var Book = require("../../models/book.model");
const { Console } = require("console");
const { parseInt } = require("lodash");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL
});


module.exports.index = async (req, res) => {
  var _limit =parseInt(req.query._limit) || 6
  var _page =parseInt(req.query._page) || 1
  let title_like = new RegExp("^" + req.query.title_like );
  var skip = (_page - 1 ) * _limit;
  var total = await Book.find()
  Book.find({title: {$regex:title_like, $options:"i"}})
   .limit(_limit)
   .skip(skip)
   .sort("-createdAt")
   .then(books =>{
     res.json({
       books, 
       pagination: {
         _limit,
         _page,
         _totalRow: total.length
       }
      })
   }).catch(err=>{
     console.log(err)
   })
};

module.exports.getId =  (req, res) => {
  var {_id} = req.params;
   Book.findOne({_id})
  .then(result =>{
    res.json({ book: result });
  }).catch(err=>{
    console.log(err)
  })  
}

module.exports.postEdit = async (req, res) => {
  var id = req.params.id;  
  await Book.findByIdAndUpdate(id, { title: req.body.title });
  const book = await Book.findOne({ _id: id });
  return res.status(200).json({ book: book });
};

module.exports.delete = async (req, res) => {
  var id = req.params.id;  
  await Book.findByIdAndRemove({ _id: id });
  const book = await Book.findOne({ _id: id });
  return res.status(200).json({ book: book });
};

module.exports.postCreate = (req, res) => {
  const userId = req.user._id
  let {title, description, coverUrl} = req.body
  if(!title || !description || !coverUrl){
    return res.status(422).json({error: "Vui lòng điền thông tin đầy đủ!"});
  } 
  
  const newBook = new Book({
    title,
    description,
    coverUrl,
    createdBy: userId,
    byShop: userId.shopOwner != null ? userId.shopOwner._id : null
  }); 
  newBook.save().then(result => {
    res.json({newBook: result,
                message: "Thêm sách thành công"        
    });
  })
  .catch(err =>{
      console.log(err); 
  })

};
