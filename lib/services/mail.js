'use strict';

const { Service } = require('schmervice');
const Nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const transporteur = Nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', // enter your user identifier here.
        pass: ''  // enter your password identifier here.
    }
});

const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Mailgen',
        link: 'https://mailgen.js/'
    }
});


module.exports = class MailService extends Service {

    async sendMailsChange(user, changedInfos) {

        const donnee = [];

        if (changedInfos.hasOwnProperty('password')) {
            donnee.push(
                {
                    item: 'password',
                    information: changedInfos.password
                }
            );
        }

        if (changedInfos.hasOwnProperty('login')) {
            donnee.push(
                {
                    item: 'login',
                    information: changedInfos.login
                }
            );
        }

        const emailChange = {
            body: {
                name: user.firstname + ' ' + user.lastname,
                intro: `Change of identifier`,
                table: {
                    data: donnee,
                    columns: {
                        customWidth: {
                            item: '20%',
                            price: '15%'
                        },
                        customAlignment: {
                            price: 'right'
                        }
                    }
                
                },
                outro: 'If you did not request a password reset, no further action is required on your part.'
            }
        };

        
        // Generate an HTML email with the provided contents
        const emailBody = mailGenerator.generate(emailChange);
        
        // Generate the plaintext version of the e-mail (for clients that do not support HTML)
        const emailText = mailGenerator.generatePlaintext(emailChange);

        const mailOptions = {
            from: 'poutet.paul@gmail.com', // sender address
            to: user.email, // list of receivers
            subject: 'change of identifier', // Subject line
            html: emailBody, // plain text body
            text: emailText
        };
        
        await transporteur.sendMail(mailOptions,(err, info) => {

            if (err) {
                throw (err);
            }
        });
    }

    async sendMails(user) {
        

        const emailSubscription = {
            body: {
                name: user.firstname + ' ' + user.lastname,
                intro: `Thanks to your subscription`,
                table: {
                    data: [
                        {
                            item: 'login',
                            information: user.login
                        },
                        {
                            item: 'password',
                            information: user.password
                        }
                    ],
                    columns: {
                        customWidth: {
                            item: '20%',
                            price: '15%'
                        },
                        customAlignment: {
                            price: 'right'
                        }
                    }
                
                },
                outro: 'If you did not request a password reset, no further action is required on your part.'
            }
        };

        const emailBody = mailGenerator.generate(emailSubscription);
        
        const emailText = mailGenerator.generatePlaintext(emailSubscription);

        const mailOptions = {
            from: 'poutet.paul@gmail.com',
            to: user.email,
            subject: 'New subscription',
            html: emailBody,
            text: emailText
        };
        
        await transporteur.sendMail(mailOptions,(err, info) => {

            if (err) {
                throw (err);
            }
        });
    }
};
