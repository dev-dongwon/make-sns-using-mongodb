const uuid4 = require('uuid4');

const getUuid = () => {
  const tokens = uuid4().split('-')
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4]
}

module.exports = getUuid;