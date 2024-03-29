const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const securePassword = async (password)=>{
    try{
       const passwordHash = await bcrypt.hash(password,10)
       return passwordHash
    }catch(error){
        console.log(error.message);
    }
}

const loadRegister = async(req,res)=>{
    try {
        res.render('users/registration')
    } catch (error) {
        console.log(error.message);
    }
}
const insertUser = async(req,res)=>{
    try{
        const spassword = await securePassword(req.body.password)
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            image:req.file.filename,
            password:spassword,
            is_admin:0,
        })

        const userData = await user.save()

        if(userData){
            res.render('users/registration',{message:'your registration has been successfully.Please verify your mail.'})
        }else{
            res.render('users/registration',{message:'your registration has been failed..'})
        }

    } catch (error){
        console.log(error.message);
    }
}


// login user methods started

const loginLoad = async(req,res)=>{
    try{
        res.render('users/login')
    } catch (error){
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try{
        const email = req.body.email
        const password = req.body.password

       const userData = await User.findOne({email:email})

       if(userData){

        const passwordMatch = await bcrypt.compare(password,userData.password)
        if(passwordMatch){
            if(userData.is_verified ===0){
                res.render('users/login',{message:'Please verify your mail.'})
            }else{
                req.session.user_id = userData._id;
                res.redirect('/home')
            }
        }
        else{
            res.render('users/login',{message:'Email and password is incorrect'}) 
        }

       }else{
        res.render('users/login',{message:'Email and password is incorrect'})
       }

    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{
    try{
        res.render('users/home')
    } catch (error){
        console.log(error.message);
    }
}

const userLogout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/')
    } catch (error){
        console.log(error.message);
    }
}
module.exports = {
    loadRegister,    
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout

}