import {
    TemplateService,
} from '../../src/services/template';
import {registerHelper, SafeString} from "handlebars";
import * as i18next from 'i18next';

describe('template', () => {

    it('should render string', () => {
        const templateService = new TemplateService(null);

        const renderedString = templateService.renderFromString('Hello {{ name }}', {name: 'World'});

        expect(renderedString).toEqual('Hello World');
    });

    it('should render template with i18next', async (done) => {

        var resources = {
            dev: { translation: { 'EMAIL_FAQ_BODY': 'User Name: {{username}}<br>User Email: {{email}}<br>Question: {{question}}' } },
            en: { translation: { 'EMAIL_FAQ_BODY': 'User Name: {{username}}<br>User Email: {{email}}<br>Question: {{question}}' } },
            'en-US': { translation: { 'EMAIL_FAQ_BODY': 'User Name: {{username}}<br>User Email: {{email}}<br>Question: {{question}}' } }
        };

        var Backend = require('i18next-node-fs-backend');



                i18next
                    .use(Backend)
                    .init({
                        backend: {
                            loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
                        },
                        lng: 'en',
                        fallbackLng: 'en',
                        ns: ['translation'],
                        defaultNS: 'translation',
                        preload: ['en'],
                        saveMissing: false,
                        debug: false
                    }, (err, t) => {
                        console.log(err)
                        console.log(t('EMAIL_FAQ_BODY'));
                        console.log(__dirname + '/locales/{{lng}}/{{ns}}.json');
                        registerHelper('i18next', (key: string, question: any) => {
                            const result = i18next.t(key, {question});
                            return new SafeString(result);
                        });

                        console.log(i18next.exists('EMAIL_FAQ_BODY'),i18next.t('EMAIL_FAQ_BODY'));

                        const templateService = new TemplateService(null);

                        const renderedString = templateService.renderFromString('Hello {{ name }}', {name: 'World'})

                        expect(renderedString).toEqual('Hello World');
                        done()
                    });
            })





    });
});
