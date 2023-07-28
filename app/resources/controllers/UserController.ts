import { Router , Request , Response , NextFunction  } from "express";
import ControllerInterface from "@/utils/interfaces/ControllersInterface";
import UserService from "@/resources/services/UserServices";
import ValidationMiddleWare from "@/middleware/ValidationMiddleWare";
import { loginUserValidation, registerUserValidation } from "@/utils/validators/UserValidation";
import HttpException from "@/utils/exceptions/HttpException";
import AuthUserMiddleWare from "@/middleware/authenticatedUserMiddleWare";
import { RegisterUserUniqueFieldValidation } from "@/middleware/UserMiddleWares";

class UserController implements ControllerInterface {

    path = "/users";
    router = Router()
    service = new UserService()

    constructor(){
        this.initRoutes()
    }
    
    private initRoutes(){
        this.router
        .post(
        `${this.path}/register`,
        [ValidationMiddleWare(registerUserValidation) , RegisterUserUniqueFieldValidation],
        this.register)

        this.router.post(
        `${this.path}/login`,
        ValidationMiddleWare(loginUserValidation),
        this.login)

        this.router.get(
        `${this.path}/`,
        AuthUserMiddleWare,
        this.getUser)
        
        this.router.get(
        `${this.path}/`,
        this.checkUserStatus)
    }

    private register = async (req:Request , res:Response , next:NextFunction) => {
        try {
            const {email , first_name , last_name , password , phone , username} = req.body
            const userdata = await this.service.register({email , first_name ,last_name , password , phone , username}) 
            res.status(201).json(userdata)
        }catch (error) {
            return next(new HttpException(400 , "failed to register user"))
        }
    }

    private login = async (req:Request , res:Response , next : NextFunction): Promise<Response|void> =>{
        try {
            const {username , password } = req.body
            const user = await this.service.login({username , password })
            res.status(200).json(user)
        } catch (error) {
           return  next(new HttpException(400 , "failed to login user"))
        }
    }

    private getUser = async (req:Request , res:Response , next : NextFunction): Promise<Response|void>=>{
        try {
            if(!req.user){
                return next(new HttpException(400 , "not logedin user"))
            }
            res.status(200).json({user : req.user})
        } catch (error) {
            return next(new HttpException(400 , "not logedin user"))
            
        }
    }

    private checkUserStatus = async (req:Request , res:Response , next : NextFunction)=>{
        const bearerToken = req.headers.authorization
        if (!bearerToken || !bearerToken.startsWith('Bearer')) {
            return next(new HttpException(4001 , 'unauthorized action'))
        }
        const accessToken = bearerToken.split('Bearer ')[1].trim()
        const verified = this.service.isLoggedIn(accessToken)
        return res.json(verified)
    }
}



export default UserController