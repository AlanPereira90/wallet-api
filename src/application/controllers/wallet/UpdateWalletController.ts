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

type UpdateWalletRequest = {
  name: string;
};

type UpdateWalletPathParams = {
  id: string;
};

type RouteRequest = CustomRequest<{ body: UpdateWalletRequest }>;
type RouteResponse = CustomResponse<void>;

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: UpdateWalletController }])
export default class UpdateWalletController implements IController {
  verb: HttpVerb = 'put';
  path = '/wallets/:id';

  constructor(@inject('WalletService') private readonly _service: IWalletService) {}

  public async handler(req: RouteRequest, res: RouteResponse): Promise<RouteResponse> {
    const { ...fields } = req.body;
    const { id } = req.params as UpdateWalletPathParams;
    const credentialId = req.headers['x-credential-id'] as string;

    await this._service.update(Number(id), credentialId, fields);

    return res.status(OK).end();
  }

  public requestValidator(req: RouteRequest, res: CustomResponseError, next: CustomNextFunction) {
    const schema = Joi.object<UpdateWalletRequest>({
      name: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      res.status(BAD_REQUEST).json({ message: error.message });
    } else {
      next();
    }
  }
}
