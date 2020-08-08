const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SENDGRID_API_KEY;


var User = require("../../models/user.model");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.postLogin = async (req, res) => {
  try {
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(202).json({error: "Vui lòng nhập đầy đủ!"})
    }
    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).json({error: "Email không tồn tại!"})
    }else{
      // res.json({user})
      let countWrongPassword = user.wrongLoginCount;
      if (countWrongPassword >= 3) {
        const msg = {
          to: email,
          from: "tqviet.0503@gmail.com",
          subject:
            "[BOOKSTORE] Tài Khoản đăng nhập sai quá số lần quy định",
          text:
            "Nếu bạn nhận được mail này, do tài khoản đăng nhập hơn 3 lần không chính xác. Hãy vào kiểm tra thông tin để bảo mật!!",
          html:
            "Nếu bạn nhận được mail này, do tài khoản đăng nhập hơn 3 lần không chính xác. Hãy vào kiểm tra thông tin để bảo mật!!"
        };
        sgMail.send(msg).then(
          () => {},
          error => {
            console.error(error);

            if (error.response) {
              console.error(error.response.body);
            }
          }
        );
        
         res.status(422).json({error: "Bạn đã nhập sai quá nhiều lần. Hãy quay lại sau!!"})
      }else{
        bcrypt.compare(password, user.password)
         .then(async doMatch =>{
           if(doMatch){
            const token = jwt.sign({_id: user._id}, JWT_SECRET);
            const {_id, email, name} = user;
            res.status(200).json({
              message: "Đăng nhập thành công",
              token,
              user: {_id, email, name}
            });
           }else{
            await User.findByIdAndUpdate(user._id, {
              wrongLoginCount: (countWrongPassword += 1)
            });
            return res.status(422).json({error: "Password không đúng"})
           }
         })
        
      }
    }
    
  } catch ({ message = "Invalid request" }) {
    return res.status(400).json({ message });
  }
};

module.exports.signup = (req, res) => {
    const  {name, email, password} = req.body;
    // if(!name || !email || !password){
    //   return res.status(422).json({error: "Vui lòng điền đầy đủ thông tin!"})
    // }
    User.findOne({email})
     .then((saveUser)=>{
       if(saveUser){
         return res.status(422).json({error: "Email đã tồn tại"})
       }
       bcrypt.hash(password, 12)
        .then(hashpassword =>{
          const user = new User({
            email,
            password: hashpassword,
            name
          })
          user.save()
           .then(user=>{
             res.json({message: "Đăng ký thành công"});
           })
           .catch(err => {
             console.log(err)
           })
        })
     }).catch(err =>{
       console.log(err)
     })
}