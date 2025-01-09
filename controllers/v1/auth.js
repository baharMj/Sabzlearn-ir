const userModel = require("./../../models/user"); 

const registerValidation = require("../../validators/register")
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {

    const validationResult = registerValidation(req.body); 
    if(!validationResult){
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
    
    const countOfUsers = await userModel.count();
    const hashedPass = await bcrypt.hash(password, 10);

    const user = userModel.create({
        username,
        name,
        email,
        phone,
        password : hashedPass,
        role : countOfUsers > 0 ? 'USER' : 'ADMIN',
    })

};

exports.login = async (req, res) => {};

exports.getMe = async (req, res) => {};
