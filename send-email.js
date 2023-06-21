import sendGrid from '@sendgrid/mail'
import dotenv from 'dotenv'

dotenv.config()

const API_KEY = process.env.SEND_GRID_API_KEY

sendGrid.setApiKey(API_KEY)
const message = {
    to: {
        name: 'POSTS',
        email: 'recipent@gmail.com'
    },
    from:'sender@gmail.com',
    subject: 'Test Email using send-grid',
    text: 'Plain text Message',
    html: '<h2>HTML Text coming via send-grid</h2>'
}

sendGrid.send(message)
.then(res=>console.log(res))
.catch(err=>err.message)