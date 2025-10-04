import { ACCOUNT_EMAIL } from "../config/env.js";
import transporter from "../config/nodemailer.js";
import logger from "../logger/index.js";
import { subjectEmail, template } from "../utils/email-template.js";
import { sendSuccess } from "../utils/response.utils.js";

export const sendEmail = (req, res, next) => {
  const { toEmail } = req.body;
  try {
    const message = template();
    const subject = subjectEmail();

    const mailOptions = {
      from: ACCOUNT_EMAIL,
      to: toEmail,
      subject: subject,
      html: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        logger.inspectError(error, "Error sending email", {
          toEmail,
        });

      sendSuccess(res, "Email sent successfully");
      logger.info("Email sent: " + info.response, { toEmail });
    });
  } catch (error) {
    logger.inspectError(error, "Occurred error to send email", {
      toEmail: toEmail || "unknown",
    });
    next(error);
  }
};
