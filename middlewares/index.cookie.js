module.exports.countCookie = (req, res, next) => {
  var count;
  while(true){  
  res.cookie("cookie", count)
  console.log(req.cookie)
  count++;
 } 
  
  next();
};