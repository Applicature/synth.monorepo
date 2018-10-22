import * as joi from 'joi';
import {ValidationAbstractService} from '../../src/services/validation/validation.abstract.service';
import {ValidationDefaultService as ValidationService} from '../../src/services/validation/validation.default.service';
import {PluginManagerMock} from '../mocks/plugin.manager';
import {ValidationError} from 'express-validation';

describe('AuthDefaultService', () => {

    const pluginManager: any = new PluginManagerMock(jest.fn());

    test('get serviceId', () => {
        const validationService = new ValidationService(pluginManager);
        expect(validationService.getServiceId()).toBe('validation.service');
    });
    test('Should create new validation scheme', () => {
        const service = new ValidationService(pluginManager);
        const validationScheme = {username: joi.string().alphanum().min(3).max(30).required()};
        const actionId = 'createUser';
        const result = service.setValidation(actionId, validationScheme);
        expect(result).toEqual(validationScheme);
    });
    test('Should create new validation scheme, replace it & validate', () => {
        const service = new ValidationService(pluginManager);
        const validationScheme = {fullName: joi.string().min(3).max(20).required()};
        const actionId = 'createUser';
        service.setValidation(actionId, validationScheme);
        service.setValidation(actionId, {
            password: joi.string().min(3).max(20).required(),
            username: joi.string().alphanum().min(3).max(30).required(),
        });
        const result = service.validate(actionId, {username: 'user', password: 'password'});
        expect(result).toHaveProperty('error', null);
    });

    test('Should be instanceof ValidationAbstractService', () => {
        const service = new ValidationService(pluginManager);
        expect(service instanceof ValidationAbstractService).toBeTruthy();
    });

    test('request validation', () => {
        const service = new ValidationService(pluginManager);
        const actionId = 'createUser';
        service.setValidation(actionId, {
            body: {
                password: joi.string().min(3).max(20).required(),
                username: joi.string().alphanum().min(3).max(30).required(),
            },
        });

        const req = {body: {username: '1'}};
        const res = jest.fn();
        const next = jest.fn();
        service.requestValidation(actionId)(req, res, (error: Error) => {
            next(error);
        });
        expect(next).toHaveBeenCalledWith(Error('validation error'));
    });
});
