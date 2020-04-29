 module.exports.postCreate = (req, res, next) => {
   var error = [];
  
  if(!req.body.title){
    error.push('Vui lòng nhập tiêu đề.');
  }
  if(!req.body.description){
    error.push('Vui lòng nhập mô tả.');
  }
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