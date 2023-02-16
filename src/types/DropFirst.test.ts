import { DropFirst } from './DropFirst';

/* eslint-disable @typescript-eslint/no-unused-vars */
describe('DropFirst', () => {
  it('should be drop the first type in an array', () => {
    type NumberStringString = [number, string, string];
    const numStrStr: NumberStringString = [1, '2', '3'];
    const strStr: DropFirst<NumberStringString> = ['1', '2'];
    const str: string = strStr[0];
    const num: number = numStrStr[0];
  });
});
