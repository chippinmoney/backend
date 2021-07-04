const EMAIL_CONFIGURATION = {
  host: 'smtp.flockmail.com',
  port: 587,
  secure: false,
  auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD
  },
}

module.exports = {
  EMAIL_CONFIGURATION
}