import parseCLIList from '../../scripts/utils/parse-cli-list';

describe('Parse CLI List', () => {
  it.each`
    input                | expectedLocales
    ${"['en']"}          | ${['en']}
    ${"['en','en-US']"}  | ${['en', 'en-US']}`(
  'parses $input to $expectedLocales',
  ({ input, expectedLocales }) => {
    const parsedList = parseCLIList(input);
    expect(parsedList).toEqual(expectedLocales);
  },
);
});
