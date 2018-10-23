import {Plugin} from './plugin';
import {Constructable} from './structure';

export interface PluginOptions {
    path?: string;
    pluginClass?: Constructable<Plugin<any>>;
}
