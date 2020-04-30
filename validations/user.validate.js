module.exports.postCreate = (req, res, next) => {
  var error = [];  
  if(!req.body.name){
    error.push('Vui lòng nhập họ tên.');
  }
  if((req.body.name).length > 30){
    error.push('Họ tên phải nhỏ hơn 30 ký tự.');
  }
  
  if(!req.body.age){
    error.push('Vui lòng nhập tuổi.');
  }
  if(error.length){
    res.render('users/create',{
      errors: error ,
      values: req.body
    })
    return;
  }
  
  next();
}

module.exports.postEdit = (req, res, next) => {
  var error = [];  
  if(!req.body.name){
    error.push('Vui lòng nhập họ tên.');
  }
  if((req.body.name).length > 30){
    error.push('Tên phải nhỏ hơn 30 ký tự.');
  }
  
  if(!req.body.age){
    error.push('Vui lòng nhập tuổi.');
  }
  if(error.length){
    res.render('users/edit',{
      errors: error ,
      values: req.body
    })
    return;
  }
  
  next();
}