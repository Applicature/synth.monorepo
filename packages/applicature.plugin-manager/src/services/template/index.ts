import { get as getConfig } from 'config';
import * as fs from 'fs';
import { compile, registerHelper, registerPartial, SafeString, Utils, HelperDelegate } from 'handlebars';
import { Service } from '../../entities/service';
import { PluginManager } from '../../plugin.manager';
import { Hashtable } from '../../structure';

function walkSync(parentDir: string, directory: string, filelist: Array<Array<string>>) {
    directory = directory || '';

    filelist = filelist || [];

    const files = fs.readdirSync(parentDir + '/' + directory);

    files.forEach((file: string) => {
        if (fs.statSync(parentDir + '/' + directory + file).isDirectory()) {
            filelist = walkSync(parentDir, directory + file + '/', filelist);
        }
        else {
            filelist.push([parentDir, directory, file]);
        }
    });

    return filelist;
}

export class TemplateService extends Service {
    private compiledTemplates: Hashtable<HandlebarsTemplateDelegate>;
    private templatesStrings: Hashtable<string>;
    private helpersRegistry: Hashtable<HelperDelegate>;

    constructor(protected pluginManager: PluginManager) {
        super(pluginManager);

        this.compiledTemplates = {};
        this.helpersRegistry = {};
        this.templatesStrings = {};
    }

    public getServiceId(): string {
        return 'core.template';
    }

    // because helpers could have any signature
    public addHelper(helperId: string, fn: () => void) {
        this.helpersRegistry[helperId] = fn;
    }

    public async init() {
        for (const helperId of Object.keys(this.helpersRegistry)) {
            registerHelper(helperId, this.helpersRegistry[helperId]);
        }

        const partialPaths = getConfig('templates.path.partials') as Array<string>;

        const partialsFiles: Array<Array<string>> = [];

        for (const path of partialPaths) {
            walkSync(path, '', partialsFiles);
        }

        for (const file of partialsFiles) {
            const content = await this.getContent(file[0] + '/' + file[1], file[2]);

            registerPartial(file[2], content);
        }

        const templatePaths = getConfig('templates.path.templates') as Array<string>;

        const templatesFiles: Array<Array<string>> = [];

        for (const path of templatePaths) {
            walkSync(path, '', templatesFiles);
        }

        for (const file of templatesFiles) {
            const content = await this.getContent(file[0] + '/' +  file[1], file[2]);
            const compiledTemplate = compile(content);
            this.compiledTemplates[file[2]] = compiledTemplate;
            this.templatesStrings[file[2]] = content;
        }
    }

    public render(templateId: string, data: any): string {
        return this.compiledTemplates[templateId](data);
    }

    public getTemplate(templateId: string): string {
        return this.templatesStrings[templateId];
    }

    public renderFromString(template: string, data: Hashtable<any>, lng?: string): string {
        const compiledTemplate = compile(template);
        if (lng) {
            Utils.extend(data, {lng});
        }
        return compiledTemplate(data);
    }

    private getContent(parentDir: string, name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(parentDir  + name, 'utf-8',
                (error: Error, source: string) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(source);
                    }
                },
            );
        });
    }
}
