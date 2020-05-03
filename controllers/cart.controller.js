module.exports.addToCart = (req, res) =>{
  var id = req.params.id;
  var sessionId = req.signedCookies.sessionId;
  
  if(!sessionId){
    res.redirect('/books')
    return;
  }
};