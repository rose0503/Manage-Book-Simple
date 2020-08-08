const User = require('../../models/user.model');

exports.UserValidator = (req, res, next) =>{
    req.check('email', 'Email không hợp lệ').isEmail();
    req.check('email', 'Vui lòng nhập email').not().isEmpty();
    req.check('name', 'Vui lòng nhập tên').not().isEmpty();
    req.check('name', 'Tên tối thiểu có 1 ký tự').isLength({min:2});
    req.check('password', 'Vui lòng nhập mật khẩu').not().isEmpty();
    req.check('password', 'Mật khẩu tối thiểu 6 kí tự').isLength({min:6});

     //check for errors
     const errors = req.validationErrors();
     if(errors){
         const firstError = errors.map(error => error.msg)[0];
         return res.status(400).json({error: firstError});
     }
     next();
}