import {
    TemplateService,
} from '../../src/services/template';

describe('template', () => {

    it('should render string', () => {
        const templateService = new TemplateService(null);

        const renderedString = templateService.renderFromString('Hello {{ name }}', {name: 'World'});

        expect(renderedString).toEqual('Hello World');
    });
});
