import { RequestHandler } from 'express';
import { BAD_REQUEST } from 'http-status';

const unrequiredList: string[] = ['/status'];

const requireCredentialId: RequestHandler = (req, res, next) => {
  if (!req.headers['x-credential-id'] && !unrequiredList.includes(req.path)) {
    res.status(BAD_REQUEST).json({ message: 'Missing x-credential-id header' });
  } else {
    next();
  }
};

export default requireCredentialId;
