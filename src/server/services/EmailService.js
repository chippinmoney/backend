const { EMAIL_CONFIGURATION } = require('../../config/email')
const  nodemailer = require('nodemailer')

const transport = nodemailer.createTransport(EMAIL_CONFIGURATION)

class EmailService {

    constructor() {
    }

    sendMail(to, subject, body) {
        const message = {
            from: 'admin@chipin.club',
            to: to,
            subject: subject,
            html: body
        }

        return new Promise((resolve, reject) => {
            transport.sendMail(message, (err, info) => {
                if (err) {
                    const response = {err}
                    reject(response)
                    return
                }
                const response = {info}
                resolve(response) 
            })
        });
    }
}

module.exports = {
    EmailService
}