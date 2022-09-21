import { inject, Lifecycle, registry, scoped } from 'tsyringe';
import { BAD_REQUEST, OK } from 'http-status';

import { IWalletService } from '../../../domain/wallet/services/interfaces/IWalletService';
import { HttpVerb } from '../../../@types/http-verb';
import {
  CustomNextFunction,
  CustomRequest,
  CustomResponse,
  CustomResponseError,
  IController,
} from '../../interfaces/IController';
import Joi from 'joi';

interface UpdateWalletRequest {
  name: string;
}

interface UpdateWalletPathParams {
  id: string;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: UpdateWalletController }])
export default class UpdateWalletController implements IController {
  verb: HttpVerb = 'put';
  path = '/wallets/:id';

  constructor(@inject('WalletService') private readonly _service: IWalletService) {}

  public async handler(req: CustomRequest<{ body: UpdateWalletRequest }>, res: CustomResponse<void>): Promise<void> {
    const { ...fields } = req.body;
    const { id } = req.params as UpdateWalletPathParams;
    const credentialId = req.headers['x-credential-id'] as string;

    await this._service.update(Number(id), credentialId, fields);

    res.status(OK).end();
  }

  public requestValidator(
    req: CustomRequest<{ body: UpdateWalletRequest }>,
    res: CustomResponseError,
    next: CustomNextFunction,
  ) {
    const schema = Joi.object({
      name: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      res.status(BAD_REQUEST).json({ message: error?.message });
    } else {
      next();
    }
  }
}
