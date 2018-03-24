import { BigNumber } from 'bignumber.js';
import { Decimal128 } from 'mongodb';
import {parseDecimals} from '../../src/utils';

describe('parseDecimals()', () => {
    it('should parse values', () => {
        const value = '0.38238446535425257365808057865';
        const from = new BigNumber(value);
        const to = Decimal128.fromString(value);

        expect(parseDecimals('toMongo', from)).toEqual(to);
        expect(parseDecimals('fromMongo', to)).toEqual(from);
        expect(parseDecimals('fromMongo', value)).toBe(value);
    });

    it('should parse collection', () => {
        const value = '0.38238446535425257365808057865';
        const from = [value, new BigNumber(value)];
        const to = [value, Decimal128.fromString(value)];

        expect(parseDecimals('toMongo', from)).toEqual(to);
        expect(parseDecimals('fromMongo', to)).toEqual(from);
    });

    it('should parse hashtable', () => {
        const value = '0.38238446535425257365808057865';
        const from = { value, num: new BigNumber(value) };
        const to = { value, num: Decimal128.fromString(value) };

        expect(parseDecimals('toMongo', from)).toEqual(to);
        expect(parseDecimals('fromMongo', to)).toEqual(from);
    });

    it('should deep traverse', () => {
        const value1 = '0.38238446535425257365808057865';
        const value2 = '0.85467368478756764563546546645';
        const from = {
            also: value1,
            num: [
                new BigNumber(value1),
                value2,
                {
                    num: new BigNumber(value2),
                },
            ],
        };
        const to = {
            also: value1,
            num: [
                Decimal128.fromString(value1),
                value2,
                {
                    num: Decimal128.fromString(value2),
                },
            ],
        };

        expect(parseDecimals('toMongo', from)).toEqual(to);
        expect(parseDecimals('fromMongo', to)).toEqual(from);
    });

});
