const ADMIN = {
  first_name: process.env.ADMIN_FIRST_NAME,
  last_name: process.env.ADMIN_LAST_NAME,
  email: process.env.ADMIN_EMAIL,
}

const RAPYD_API = {
  secret_key: process.env.SECRET_KEY,
  access_key: process.env.ACCESS_KEY
}

module.exports = {
  ADMIN,
  RAPYD_API
}