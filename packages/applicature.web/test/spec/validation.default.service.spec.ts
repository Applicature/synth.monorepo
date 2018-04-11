import * as joi from 'joi';
import {ValidationDefaultService as ValidationService} from '../../src/services/validation/validation.default.service';
import {PluginManagerMock} from '../mocks/plugin.manager';

describe('AuthDefaultService', () => {

    const pluginManager: any = new PluginManagerMock(jest.fn());

    test('get serviceId', () => {
        const validationService = new ValidationService(pluginManager);
        expect(validationService.getServiceId()).toBe('validation.default.service');
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
});
