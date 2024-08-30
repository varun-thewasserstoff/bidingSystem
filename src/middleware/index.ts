import { Request, Response, NextFunction } from 'express';
import z,{ AnyZodObject, ZodError } from 'zod';
import passport from 'passport';

const TokenHeaderSchema = z.object({
  header:z.object({
    authorization: z.string().regex(/^Bearer\s+[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/, {
      message: "Invalid Authorization token format"
  })
  })
});

const validateRequestHeader = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenHeader = req.headers['authorization']; 
    await schema.parseAsync({ header:{ authorization: tokenHeader}});
    req.headers['authorization'] = tokenHeader;
    // // console.log(req.headers['authorization'])
    next();
  } catch (error) {
    return res.status(400).send({ status: false, message: error["issues"][0]["message"] });
  }
};

const verifyCallback = (req:Request, resolve:any, reject:any,res:Response) => async (err:any, user:any, info:any) => {
  // console.log(user,":::::")
  if (err || info || !user) {
    return reject(new Error('UNAUTHOURIZED USER'));
  }
  req["user"] = user;
  // // console.log("user",user)
  resolve();
};

export const authenticateUserJwt = () => async (req:Request, res:Response, next:NextFunction) => {
  // console.log(req.headers)
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject,res))(req, res, next);
  })
    .then(() =>{ next() })
    .catch((err) => {
      console.log(err)
      if(res)return res.status(401).send({status:false,message:"UNAUTHOURIZED USER"});
      next(err)
    });
};


export const validateRequest =(schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
    try {
    const sanitizedValues = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.body = sanitizedValues.body;
    req.query = sanitizedValues.query;
    req.params = sanitizedValues.params;
    return next();

    } catch (error) {
      const validationErrors: { [key: string]: string } = {};
      
      (error as ZodError).errors.forEach((errorMessage) => {
          const fieldName = errorMessage.path.join(".");
          validationErrors[fieldName] = errorMessage.message;
      });
      
      res.status(400).json({ errors: validationErrors });
    }
    };

export const authenticateUser = [
  // validateRequestHeader(TokenHeaderSchema),
  authenticateUserJwt()
]