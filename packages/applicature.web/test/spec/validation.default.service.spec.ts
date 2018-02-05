import * as joi from 'joi';
import { ValidationDefaultService } from '../../src/services/validation/validation.default.service';
import {PluginManagerMock} from '../mocks/plugin.manager';

describe('AuthDefaultService', () => {

    const pluginManager: any = new PluginManagerMock(jest.fn());

    test('get serviceId', () => {
        const validationService = new ValidationDefaultService(pluginManager);
        expect(validationService.getServiceId()).toBe('validation.default.service');
    });
    test('Should create new validation scheme', () => {
        const service = new ValidationDefaultService(pluginManager);
        const validationScheme = {username: joi.string().alphanum().min(3).max(30).required()};
        const actionId = 'createUser';
        const result = service.setValidation(actionId, validationScheme);
        expect(result).toEqual(validationScheme);
    });
    test('Should create new validation scheme, update it & validate', () => {
        const service = new ValidationDefaultService(pluginManager);
        const validationScheme = {username: joi.string().alphanum().min(3).max(30).required()};
        const actionId = 'createUser';
        servi-ce.setValidation(actionId, validationScheme);
        service.setValidation(actionId, {password: joi.string().min(3).max(20).required()});
        const result = service.validate(actionId, {username: 'user', password: 'password'});
        expect(result).toHaveProperty('error', null);
    });
});
