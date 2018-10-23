import { Hashtable } from '@applicature-private/applicature-sdk.plugin-manager';
import {NextFunction, Request, Response} from 'express';
import * as validation from 'express-validation';
import * as joi from 'joi';
import { ValidationAbstractService } from './validation.abstract.service';

export class ValidationDefaultService extends ValidationAbstractService {

    private validationSchemas: Hashtable<any> = {};

    public getServiceId() {
        return 'validation.service';
    }
    public setValidation(actionId: string, scheme: any): any {
        return this.validationSchemas[actionId] = scheme;
    }
    public getValidation(actionId: string): any {
        return this.validationSchemas[actionId];
    }
    public validate(actionId: string, data: any): any {
        return joi.validate(data, joi.object().keys(this.validationSchemas[actionId]));
    }
    public requestValidation(actionId: string): any {
        return (req: Request, res: Response, next: NextFunction) => {
            return validation(this.getValidation(actionId)) (req, res, next);
        };
    }
}
