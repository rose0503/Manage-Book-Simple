 module.exports.postCreate = (req, res, next) => {
   var error = [];
  
  if(!req.body.title){
    error.push('Vui lòng nhập tiêu đề.');
  }
  if(!req.body.description){
    error.push('Vui lòng nhập mô tả.');
  }
     
  if (!req.file) {
    error.push('Image is required');
      //throw new Exception("Image is required");
    }
    if (!checkIsImage(req.file.mimetype)) {
      error.push('Image is not valid');
      //throw new Exception("Image is not valid");
    }

    const path =  cloudinary.uploader
      .upload(req.file.path, {
        public_id: `student/${req.file.filename}`,
        tags: "student"
      })
      .then(result => result.url)
      .catch(_ => false);
    if (!path) throw new Exception("There was an error saving your image");

    const newBook = { title, description, id: shortId(), imgUrl: path };
    db.get("books")
      .push(newBook)
      .write();
    // add dum data
    fs.unlinkSync(req.file.path);
   
   if(error.length){
    res.render('books/create',{
      errors: error ,
      values: req.body
    })
    return;
  }
   next();
 };

module.exports.postEdit = (req, res, next) => {
  var error = [];  
  if(!req.body.title){
    error.push('Vui lòng nhập tiêu đề.');
  }
  if(error.length){
    res.render('books/edit',{
      errors: error ,
      values: req.body
    })
    return;
  }
  
  next();
};