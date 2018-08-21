import parseList from '../../scripts/util/parse-list';

describe('Parse List', () => {
  it.each`
    input                | expectedLocales
    ${"['en']"}          | ${['en']}
    ${"['en','en-US']"}  | ${['en', 'en-US']}`(
  'parses $input to $expectedLocales',
  ({ input, expectedLocales }) => {
    const parsedList = parseList(input);
    expect(parsedList).toEqual(expectedLocales);
  },
);
});
