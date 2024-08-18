import { given, then, when } from 'test-fns';

describe('ArrayWith', () => {
  given('desire for array with min length', () => {
    then('we can declare the type', () => {
      let products: ArrayWith<'min', 1, string>;
    });
    then('it allows arrays of exactly the min length to it', () => {
      const products: ArrayWith<'min', 1, string> = ['doughnut']; // 🍩
    });
    then('it allows arrays with more than the min length to it', () => {
      const products: ArrayWith<'min', 1, string> = ['doughnut', 'waffle']; // 🍩, 🧇
    });
    then('it blocks arrays with less than the min length to it', () => {
      // @ts-expect-error; Type '[]' is not assignable to type '[string, ...string[]]'. Source has 0 element(s) but target requires 1.ts(2322)
      const products: ArrayWith<'min', 1, string> = []; // 🍩, 🧇
    });
  });
  given('desire for array with exact length', () => {
    then('we can declare the type', () => {
      let products: ArrayWith<'len', 1, string>;
    });
    then('it allows arrays of exactly the desired length to it', () => {
      const products: ArrayWith<'len', 1, string> = ['doughnut']; // 🍩
    });
    then('it allows arrays with more than the desired length to it', () => {
      // @ts-expect-error; Type '[string, string]' is not assignable to type '[string]'.Source has 2 element(s) but target allows only 1.
      const products: ArrayWith<'len', 1, string> = ['doughnut', 'waffle']; // 🍩, 🧇
    });
    then('it blocks arrays with less than the desired length to it', () => {
      // @ts-expect-error; Type '[]' is not assignable to type '[string]'. Source has 0 element(s) but target requires 1.ts(2322)
      const products: ArrayWith<'len', 1, string> = [];
    });
  });
});
