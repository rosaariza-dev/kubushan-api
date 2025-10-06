import dns from "dns";
import { promisify } from "util";
import { subjectEmail, template } from "../utils/email-template.js";
import transporter from "../config/nodemailer.js";
import { DisposableEmailValidator } from "disposable-email-validator";
import { ACCOUNT_EMAIL, NODE_ENV } from "../config/env.js";
import logger from "../logger/index.js";

const config = {
  development: {
    rules: {
      allow_disposable_emails: false,
      allow_plus_addressing: false,
    },
  },
  production: {
    rules: {
      allow_disposable_emails: false,
      allow_plus_addressing: false,
    },
  },
};

const validator = new DisposableEmailValidator(NODE_ENV, config);
const resolveMx = promisify(dns.resolveMx);

export const isValidEmailDomain = async (email) => {
  try {
    const emailValidatorDisposable = validator.validateEmail(email); // devuelve false cuando es un email desechable/temporal
    logger.inspectDebug(
      "Result of validate if email is disposable",
      emailValidatorDisposable,
      { email }
    );

    if (!emailValidatorDisposable.success) {
      logger.warn("Invalid disposable email", { email });
      return false;
    }

    const domain = email.split("@")[1];
    if (!domain) {
      logger.warn("Invalid domain email", { email });
      return false;
    }

    // verificar registros MX (mail exchange)
    const addresses = await resolveMx(domain);
    logger.inspectDebug("Check MX domains result", addresses, { email });

    return addresses && addresses.length > 0;
  } catch (error) {
    if (error.code === "ENODATA" || error.code === "ENOTFOUND") {
      logger.warn("No MX domain records found", { email });
      return false;
    }
    throw error;
  }
};

export const sendEmailtoSubscriptor = async (email) => {
  try {
    const message = template();
    const subject = subjectEmail();

    const mailOptions = {
      from: ACCOUNT_EMAIL,
      to: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
