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

type CreateWalletRequest = {
  name: string;
};

type CreateWalletResponse = {
  id: number;
};

type RouteRequest = CustomRequest<{ body: CreateWalletRequest }>;
type RouteResponse = CustomResponse<CreateWalletResponse>;

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: CreateWalletController }])
export default class CreateWalletController implements IController {
  public verb: HttpVerb = 'post';
  public path = '/wallets';

  constructor(@inject('WalletService') private readonly _service: IWalletService) {}

  public async handler(req: RouteRequest, res: RouteResponse): Promise<RouteResponse> {
    const { name } = req.body;
    const credentialId = req.headers['x-credential-id'] as string;

    const id = await this._service.create(name, credentialId);

    return res.status(CREATED).json({ id });
  }

  public requestValidator(req: RouteRequest, res: CustomResponseError, next: CustomNextFunction) {
    const schema = Joi.object<CreateWalletRequest>({
      name: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      res.status(BAD_REQUEST).json({ message: error.message });
    } else {
      next();
    }
  }
}
