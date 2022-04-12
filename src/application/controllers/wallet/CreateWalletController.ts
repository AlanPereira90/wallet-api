import { inject, Lifecycle, registry, scoped } from 'tsyringe';
import { BAD_REQUEST, CREATED } from 'http-status';
import Joi from 'joi';

import {
  CustomNextFunction,
  CustomRequest,
  CustomResponse,
  CustomResponseError,
  IController,
} from '../../interfaces/IController';
import { HttpVerb } from '../../../@types/http-verb';
import { IWalletService } from '../../../domain/wallet/services/interfaces/IWalletService';

interface CreateWalletRequest {
  name: string;
}

interface CreateWalletResponse {
  id: number;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: CreateWalletController }])
export default class CreateWalletController implements IController {
  public verb: HttpVerb = 'post';
  public path: string = '/wallets';

  constructor(@inject('WalletService') private readonly _service: IWalletService) {}

  public async handler(
    req: CustomRequest<CreateWalletRequest>,
    res: CustomResponse<CreateWalletResponse>,
  ): Promise<void> {
    const { name } = req.body;
    const credentialId = req.headers['x-credential-id'] as string;

    const id = await this._service.create(name, credentialId);

    res.status(CREATED).json({ id });
  }

  public async requestValidator(
    req: CustomRequest<CreateWalletRequest>,
    res: CustomResponseError,
    next: CustomNextFunction,
  ) {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error || !req.headers['x-credential-id']) {
      res.status(BAD_REQUEST).json({ message: error?.message || 'Invalid request' });
    } else {
      next();
    }
  }
}
