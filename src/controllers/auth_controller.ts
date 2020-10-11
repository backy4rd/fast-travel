import { expect } from 'chai';
import { NextFunction, Request, Response } from 'express';

import asyncHandler from '../utils/async_handler';
import { redisClient } from '../connection';
import User from '../models/User';

const { UUID_CACHE_EXPIRE_TIME } = process.env;

class AuthController {
  @asyncHandler
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
    });

    return res.status(201).json({
      data: { message: 'Sign up success' },
    });
  }

  @asyncHandler
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
      await redisClient.expire(user.uuid, parseInt(UUID_CACHE_EXPIRE_TIME));
    }

    return res.status(200).json({
      data: {
        email: user.email,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        uuid: user.uuid,
      },
    });
  }

  @asyncHandler
  public async authorize(req: Request, res: Response, next: NextFunction) {
    const { uuid } = req.cookies;
    expect(uuid, '401:Unauthorized').to.exist;

    const cachedData: any = await redisClient.hgetall(uuid);
    if (cachedData) {
      req.local.auth = cachedData;
      return next();
    }

    const user = await User.findOne({ uuid: uuid });
    expect(user, '401:Unauthorized').to.not.be.null;

    await redisClient.hset(user.uuid, [
      'email',
      user.email,
      'firstName',
      user.profile.firstName,
      'lastName',
      user.profile.lastName,
    ]);
    await redisClient.expire(user.uuid, parseInt(UUID_CACHE_EXPIRE_TIME));

    req.local.auth = {
      email: user.email,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
    };

    next();
  }

  @asyncHandler
  public async identify(req: Request, res: Response, next: NextFunction) {
    const { uuid } = req.cookies;
    if (!uuid) return next();

    const cachedData: any = await redisClient.hgetall(uuid);
    if (cachedData) {
      req.local.auth = cachedData;
      return next();
    }

    const user = await User.findOne({ uuid: uuid });
    if (!user) return next();

    await redisClient.hset(user.uuid, [
      'email',
      user.email,
      'firstName',
      user.profile.firstName,
      'lastName',
      user.profile.lastName,
    ]);
    await redisClient.expire(user.uuid, parseInt(UUID_CACHE_EXPIRE_TIME));

    req.local.auth = {
      email: user.email,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
    };

    next();
  }

  // require authorized
  @asyncHandler
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
