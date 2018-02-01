import {PluginManager, Service} from '@applicature/multivest.core';
import * as joi from 'joi';
import { Hashtable } from './structure';
import { ValidationAbstractService } from './validation.abstract.service';

export class ValidationDefaultService extends ValidationAbstractService {

    private validationSchemas: Hashtable<any> = {};

    public getServiceId() {
        return 'validation.default.service';
    }
    public setValidation(actionId: string, scheme: any): any {
        return this.validationSchemas[actionId] = {...this.validationSchemas[actionId], ...scheme};
    }
    public getValidation(actionId: string): any {
        return this.validationSchemas[actionId];
    }
    public validate(actionId: string, data: any): any {
        return joi.validate(data, joi.object().keys(this.validationSchemas[actionId]));
    }
}
