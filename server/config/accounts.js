const pageflex = {
  username: process.env.PAGEFLEX_USERNAME || 'Clayton',
  password: process.env.PAGEFLEX_PASSWORD || 'nickpass'
};

const whiteCase = {
  username: process.env.WHITECASE_USERNAME || 'nlyons',
  password: process.env.WHITECASE_PASSWORD || 'password'
}

const printSmith = {
  username: process.env.PRINTSMITH_USERNAME,
  password: process.env.PRINTSMITH_PASSWORD,
  login: process.env.PRINTSMITH_LOGIN
};

const skyportal = {
  username: process.env.SKYPORTAL_LOGIN,
  password: process.env.SKYPORTAL_PASSWORD
}

module.exports = {
  PAGEFLEX: pageflex,
  WHITECASE: whiteCase,
  PRINTSMITH: printSmith,
  SKYPORTAL: skyportal
}
