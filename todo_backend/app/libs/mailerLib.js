const nodeMailer = require('nodemailer');
let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth:{
        user: 'sathyainfotechpro.care@gmail.com',
        pass: 'Balu@2793'
    }
});

let mailOptions = {
    from: 'sathyainfotechpro.care@gmail.com',
    to: '',
    subject: '',
    html:''
};

let autoEmail = (reciever,subject,msg) =>{

    mailOptions.to = reciever;
    mailOptions.subject = subject;
    mailOptions.html = msg;

    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
        }else{
            console.log('Email Sented ' + info.response);
        }
    });

}//end autoEmail
module.exports = {
    autoEmail: autoEmail
}