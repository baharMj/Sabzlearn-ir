const userModel = require("./../../models/user"); 

const registerValidation = require("../../validators/register")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    const validationResult = registerValidation(req.body); 
    if(validationResult !== true){
        return res.status(422).json(validationResult);
    }
    const { username, name, email, password, phone } = req.body; 

    const isUserExists = await userModel.findOne({
        $or: [{username}, {email}],
    })
    if (isUserExists){
        return res.status(409).json({
            message: "username or email is duplicated",
        })
    }
    
    const countOfUsers = await userModel.countDocuments();
    const hashedPass = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        name,
        email,
        phone,
        password : hashedPass,
        role : countOfUsers > 0 ? 'USER' : 'ADMIN',
    })

    const userObject = user.toObject() ;
    Reflect.deleteProperty(userObject, "password");

    const accessToken = jwt.sign({ id : user._id }, process.env.JWT_SECRET , {
        expiresIn : "30 day",
    });

    return res.status(201).json ({ user : userObject , accessToken});

};

exports.login = async (req, res) => {};

exports.getMe = async (req, res) => {};
