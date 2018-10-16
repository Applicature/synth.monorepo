import { WebhookDaoActionItem } from './model';

export default (data: object | Array<any>) => {
    if (Array.isArray(data) && data.length >= 1) {
        return data.map((current) =>
            Object.assign(new WebhookDaoActionItem(), current)
        );
    }
    return Object.assign(new WebhookDaoActionItem(), data);
};
