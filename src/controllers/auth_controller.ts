import { expect } from 'chai';
import { NextFunction, Request, Response, RequestHandler } from 'express';
import { redisClient } from '../connection';
import User from '../models/User';

class AuthController {
  public async signUp(req: Request, res: Response) {
    const { email, password, firstName, lastName } = req.body;

    expect(email, '400:Email is required').to.exist;
    expect(password, '400:Password is required').to.exist;
    expect(firstName, '400:First name is required').to.exist;
    expect(lastName, '400:Last name is required').to.exist;

    const isEmailWasRegistered = await User.isEmailWasRegistered(email);
    expect(isEmailWasRegistered, '400:Email was registered').to.not.be.true;

    await User.create({
      email: email,
      password: password,
      uuid: null,
      profile: {
        firstName: firstName,
        lastName: lastName,
      },
      urls: [],
    });

    return res.status(201).json({
      data: { message: 'Sign up success' },
    });
  }

  public async signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    expect(email, '400:Email is required').to.exist;
    expect(password, '400:Password is required').to.exist;

    const user = await User.findOne({ email: email });
    expect(user, '404:User not found').to.exist;

    const isMatch = await user.comparePassword(password);
    expect(isMatch, "400:Password don't match").to.be.true;

    if (user.uuid === null) {
      user.uuid = User.genUUID();
      await user.save();
    }

    const isCached = await redisClient.exists(user.uuid);
    if (!isCached) {
      await redisClient.hset(user.uuid, [
        'email',
        user.email,
        'firstName',
        user.profile.firstName,
        'lastName',
        user.profile.lastName,
      ]);
      await redisClient.expire(user.uuid, 20);
    }

    res.cookie('uuid', user.uuid, { httpOnly: true });
    return res.status(200).json({
      data: { message: 'Sign in success' },
    });
  }

  public authorize({ require }): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { uuid } = req.cookies;
      expect(uuid, '401:Unauthorized').to.exist;

      const cachedData: any = await redisClient.hgetall(uuid);

      if (cachedData !== null) {
        req.local.auth = cachedData;
        return next();
      }

      const user = await User.findOne({ uuid: uuid });

      if (require === true) {
        expect(user, '401:Unauthorized').to.not.be.null;
      }
      if (user === null && require === false) {
        return next();
      }

      await redisClient.hset(user.uuid, [
        'email',
        user.email,
        'firstName',
        user.profile.firstName,
        'lastName',
        user.profile.lastName,
      ]);
      await redisClient.expire(user.uuid, 20);

      req.local.auth = {
        email: user.email,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
      };

      next();
    };
  }

  // require authorized
  public async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    const { email } = req.local.auth;

    expect(oldPassword, '400:Old password is required').to.exist;
    expect(newPassword, '400:New password is required').to.exist;

    const user = await User.findOne({ email: email });

    const isMatch = await user.comparePassword(oldPassword);
    expect(isMatch, "400:Password don't match").to.be.true;

    await user.changePassword(newPassword);
    return res.status(200).json({
      data: { message: 'Change password success' },
    });
  }
}

export default new AuthController();
