import {Hashtable} from '@applicature/multivest.core';
import {BigNumber} from 'bignumber.js';
import {Decimal128, ObjectID} from 'mongodb';

export function parseDecimals(type: 'toMongo' | 'fromMongo', data: any): any {
    if (typeof data !== 'object' || !data) {
        return data;
    }

    if (data instanceof ObjectID) {
        return data;
    }

    if (data instanceof Date) {
        return data;
    }

    if (data instanceof RegExp) {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map((item) => parseDecimals(type, item));
    }

    if (type === 'toMongo' && (data instanceof BigNumber || data.isBigNumber)) {
        return Decimal128.fromString(data.toString());
    }

    if (type === 'fromMongo' && data instanceof Decimal128) {
        return new BigNumber(data.toString());
    }

    const keys = Object.keys(data);

    return keys.reduce((prev, curr) => {
            prev[curr] = parseDecimals(type, data[curr]);
            return prev;
        },
        {} as Hashtable<any>
    );
}
