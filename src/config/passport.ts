import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import { envConfigs } from './envconfig';

const jwtOptions = {
  secretOrKey: "varun132",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (data: any, done: any) => {
  try {
    // console.log(data)
    let payload = data
    // console.log(payload,"payload")
    if ((!payload) || (!payload.username && !payload.role)){
      throw new Error('Invalid token payload');
    }
    done(null, payload);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);