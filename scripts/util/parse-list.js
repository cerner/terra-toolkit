// eslint-disable-next-line no-useless-escape
const parseList = list => list.replace(/[\[\'\'\]\s]/g, '').split(',').map(String);

module.exports = parseList;

