import {PluginManager, Service} from '@applicature/multivest.core';
export type ProcessType = string | void;
export abstract class ValidationAbstractService extends Service {
    public abstract setValidation(actionId: any, scheme: any): any;

    public abstract getValidation(actionId: any): any;

    public abstract validate(actionId: string, data: any): any;

    public abstract requestValidation(actionId: string): any;
}
