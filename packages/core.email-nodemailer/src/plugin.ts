import { Plugin } from '@applicature/synth.plugin-manager';
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
