module.exports = function(req,res,next){
  // auth will be run before this.
  // we will have access to req.user

  if(!req.user.isAdmin) return res.status(403).send('Access Denied.')

  next();
}