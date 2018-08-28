// eslint-disable-next-line no-useless-escape
const parseCLIList = list => list.replace(/[\[\'\'\]\s]/g, '').split(',').map(String);

module.exports = parseCLIList;
