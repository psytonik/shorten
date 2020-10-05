const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check,validationResult} = require('express-validator')
const router = Router();
const User = require('../model/User')

router.post(
    '/sign-up',
    [
        check('email','eMail not correct')
            .isEmail(),
        check('password','Password must be not less than 6 characters')
            .isLength({min:6})
    ],
    async(req,res)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message:'Not correct data'
            })
        }
        const {email,password} = req.body;
        const candidate = await User.findOne({email});
        if(candidate){
            return res.status(400).json({message:"User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,12);
        const user = new User({email,password:hashedPassword})
        await user.save();
        res.status(201).json({message:"User Created"})
    }catch (e){
        res.status(500).json({message:e.message})
        console.error(e.message)
    }
})
router.post(
    '/sign-in',
    [
        check('email','eMail not correct')
            .normalizeEmail()
            .isEmail(),
        check('password','Password must be not less than 6 characters')
            .exists()
    ],
    async(req,res)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message:'Not correct sign in data'
            })
        }
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'User Not Found'})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(500).json({message:'Password not match, try again'})
        }
        const token = jwt.sign(
            {userId:user.id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
            )
        return res.status(200).json({token,userId:user.id})
    }catch (e){
        res.status(500).json({message:e.message})
        console.error(e.message)
    }
})
module.exports = router;
