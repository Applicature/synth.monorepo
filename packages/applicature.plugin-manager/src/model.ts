import {Constructable} from "./structure";
import {Plugin} from "./plugin";

export interface PluginOptions {
    path?: string;
    pluginClass?: Constructable<Plugin<any>>;
}
