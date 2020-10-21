import React from 'react';

describe('Sanity React Jest Test', () => {
  it('Correctly tests a snapshot', () => {
    const div = shallow(<div>Test</div>);
    expect(div).toMatchSnapshot();
  });
});
