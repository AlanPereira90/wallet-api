import { inject, Lifecycle, registry, scoped } from 'tsyringe';
import { BAD_REQUEST, OK } from 'http-status';

import { WalletWithId } from '../../../domain/wallet/entities/interfaces/IWallet';
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

type RetrieveWalletRequest = {
  name?: string;
};

type RetrieveWalletResponse = {
  wallets: Array<WalletWithId>;
};

type RouteRequest = CustomRequest<{ query: RetrieveWalletRequest }>;
type RouteResponse = CustomResponse<RetrieveWalletResponse>;

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: RetrieveWalletController }])
export default class RetrieveWalletController implements IController {
  verb: HttpVerb = 'get';
  path = '/wallets';

  constructor(@inject('WalletService') private readonly _service: IWalletService) {}

  public async handler(req: RouteRequest, res: RouteResponse): Promise<RouteResponse> {
    const { name } = req.query;
    const credentialId = req.headers['x-credential-id'] as string;

    let wallets = [];

    if (name) {
      wallets = [await this._service.findByNameAndCredential(name, credentialId)];
    } else {
      wallets = await this._service.findByCredential(credentialId);
    }

    return res.status(OK).json({ wallets });
  }

  public requestValidator(req: RouteRequest, res: CustomResponseError, next: CustomNextFunction) {
    const schema = Joi.object<RetrieveWalletRequest>({
      name: Joi.string().optional(),
    });

    const { error } = schema.validate(req.query);

    if (error) {
      res.status(BAD_REQUEST).json({ message: error.message });
    } else {
      next();
    }
  }
}
