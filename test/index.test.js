const plugin = require('../lib');

import('chai').then(chai => {
  const expect = chai.expect;

  describe('feathers-splunk', () => {
    it('basic functionality', () => {
      expect(typeof plugin).to.equal('function', 'It worked');
      expect(plugin()).to.equal('feathers-splunk');
    });
  });
}).catch(err => {
  console.error('Failed to import Chai:', err);
});
