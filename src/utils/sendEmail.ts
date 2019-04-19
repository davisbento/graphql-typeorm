import * as SparkPost from 'sparkpost';

const client = new SparkPost(process.env.SPARKPOST_API_KEY);

export const sendEmail = async (recipient: string, url: string) => {
  await client.transmissions.send({
    options: {
      sandbox: true,
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'Confirm e-mail!',
      html: `<html>
            <body>
            <p>Confirm your e-mail</p>
            <a href="${url}">Click here to confirm</a>
            </body>
        </html>`,
    },
    recipients: [{ address: recipient }],
  });
};
