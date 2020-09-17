import { expect } from 'chai';
import { Request, Response } from 'express';

import { redisClient } from '../connection';
import { IClick } from '../interfaces/IUrl';
import Url from '../models/Url';

const { URL_CACHE_EXPIRE_TIME } = process.env;

class UrlController {
  public async getUrl(req: Request, res: Response) {
    const { endpoint } = req.params;

    const clickDetail: IClick = {
      referrer: req.headers.referer || null,
      userAgent: req.headers['user-agent'] || null,
      ipAddress: req.connection.remoteAddress || null,
    };

    const cachedUrl: any = await redisClient.hgetall(endpoint);

    if (cachedUrl !== null) {
      res.status(200).json({
        data: {
          endpoint: cachedUrl.endpoint,
          url: cachedUrl.url,
        },
      });

      await Url.updateOne(
        { endpoint: endpoint },
        { $push: { clicks: clickDetail } },
      );
      return;
    }

    const url = await Url.findOne({ endpoint: endpoint });
    expect(url, '404:Not found').to.not.be.null;

    res.status(200).json({
      data: {
        endpoint: url.endpoint,
        url: url.url,
      },
    });

    url.clicks.push(clickDetail);
    await url.save();

    await redisClient.hset(endpoint, [
      'endpoint',
      url.endpoint,
      'url',
      url.url,
    ]);
    await redisClient.expire(endpoint, parseInt(URL_CACHE_EXPIRE_TIME));
  }

  public async shortenUrl(req: Request, res: Response) {
    const { url } = req.body;

    expect(url, '400:Url is required').to.exist;

    const creatorEmail = req.local.auth?.email || null;
    let endpoint: string;

    do {
      endpoint = Url.genEndpoint();
      if (!(await Url.isEndpointExist(endpoint))) break;
    } while (true);

    const _url = await Url.create({
      endpoint: endpoint,
      url: url,
      clicks: [],
      createdBy: creatorEmail,
    });

    return res.status(201).json({
      data: {
        endpoint: _url.endpoint,
        url: _url.url,
      },
    });
  }

  // require authorize
  public async deleteUrl(req: Request, res: Response) {
    const { endpoint } = req.params;
    const { email } = req.local.auth;

    const url = await Url.findOne({ endpoint: endpoint, createdBy: email });
    expect(url, "404:Endpoint doesn't exist or belong someone else").to.not.be
      .null;

    await url.remove();

    res.status(200).json({
      data: { message: 'Deleted' },
    });

    await redisClient.del(endpoint);
  }
}

export default new UrlController();
