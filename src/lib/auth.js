import jwt from 'jsonwebtoken'

export function signJWT(userData){
     const token=jwt.sign(userData,process.env.JWT_SECRET, {expiresIn:'1d'})
     return token;
}

export function verifyJWT(token){
     try {
          return jwt.verify(token,process.env.JWT_SECRET)
     } catch (error) {
          console.log(error.message)
          throw new Error(error.message)
     }
}