const jwt = require('jsonwebtoken');
const JWT_SECRET = 'iznotebook$oy';


const fetchuser = (req,res,next) =>{
    // Get the user from the json token and add id to get the object 
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error : "Plz contact the owner"})
    }

    try{
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;

    next();

    }catch{
        res.send(401);
    }
}

module.exports = fetchuser;