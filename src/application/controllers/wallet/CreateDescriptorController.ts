import { inject, Lifecycle, registry, scoped } from 'tsyringe';
import { CustomRequest, CustomResponse, CustomResponseError, IController } from '../../interfaces/IController';
import { HttpVerb } from '../../../@types/http-verb';
import { IDescriptorService } from '../../../domain/wallet/services/interfaces/IDescriptorService';
import { BAD_REQUEST, CREATED } from 'http-status';
import { NextFunction } from 'express';
import Joi from 'joi';

type WalletPathParam = {
  wallet_id: string;
};

type CreateDescriptorRequest = {
  name: string;
  description?: string;
};

type CreateDescriptorResponse = {
  id: number;
};

type RouteRequest = CustomRequest<{ params: WalletPathParam; body: CreateDescriptorRequest }>;
type RouteResponse = CustomResponse<CreateDescriptorResponse>;

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: CreateDescriptorController }])
export default class CreateDescriptorController implements IController {
  verb: HttpVerb = 'post';
  path = '/wallets/:wallet_id/descriptors';

  constructor(@inject('DescriptorService') private readonly _service: IDescriptorService) {}

  public async handler(req: RouteRequest, res: RouteResponse): Promise<RouteResponse> {
    const { name, description } = req.body;
    const { wallet_id: walletId } = req.params;

    const id = await this._service.create(parseInt(walletId), name, description);

    return res.status(CREATED).json({ id });
  }

  public requestValidator(req: RouteRequest, res: CustomResponseError, next: NextFunction) {
    const pathSchema = Joi.object<WalletPathParam>({
      wallet_id: Joi.number().required(),
    });

    const bodySchema = Joi.object<CreateDescriptorRequest>({
      name: Joi.string().required(),
      description: Joi.string().optional(),
    });

    const { error: paramsError } = pathSchema.validate(req.params);
    const { error: bodyError } = bodySchema.validate(req.body);

    if (paramsError) {
      res.status(BAD_REQUEST).json({ message: paramsError.message });
    } else if (bodyError) {
      res.status(BAD_REQUEST).json({ message: bodyError.message });
    } else {
      next();
    }
  }
}
