
const chai = require('chai');

const verify = () => chai.expect(browser.getText('#verify')).to.equal("verified!");

describe('verify button press', () => {
  beforeEach(() => {
    browser.url('/test.html')
    browser.refresh()
  });

  it('click', () => {
    browser.click('#button')
    verify()
  });

  it('buttonPress - left', () => {
    browser.moveToObject('#button')
    browser.buttonPress('left')
    verify()
  });

  it('buttonPress - 0', () => {
    browser.moveToObject('#button')
    browser.buttonPress(0)
    verify('right')
  });

  it('leftClick', () => {
    browser.leftClick('#button')
    verify()
  });
});
