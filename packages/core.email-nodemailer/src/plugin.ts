import { Plugin } from '@applicature-private/applicature-sdk.plugin-manager';
import { NodeMailerEmailService } from './service';

class NodeMailerEmailPlugin extends Plugin<any> {

    public getPluginId() {
        return 'email.nodemailer';
    }

    public init() {
        this.serviceClasses.push(NodeMailerEmailService);
    }
}

export { NodeMailerEmailPlugin as Plugin };
