import mongoose from "mongoose";
import logger from "../logger/index.js";
import Subscription from "../models/subscription.models.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  isValidEmailDomain,
  sendEmailtoSubscriptor,
} from "../services/email.service.js";
import {
  emailAlreadyExists,
  invalidEmailDomain,
} from "../exceptions/email.exception.js";

export const sendEmail = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { toEmail } = req.body;

    const isValidDomain = await isValidEmailDomain(toEmail);

    if (!isValidDomain) {
      logger.warn("Invalid or disposable email domain", { toEmail });
      invalidEmailDomain();
    }

    const emailExisting = await Subscription.findOne({ email: toEmail });

    if (emailExisting) {
      logger.warn("Email already subscribed", { toEmail });
      emailAlreadyExists();
    }

    const newSubscriber = await Subscription.create([{ email: toEmail }], {
      session,
    });

    logger.inspectDebug(
      "Subscripber created completed (awaiting database commit)",
      newSubscriber
    );

    await sendEmailtoSubscriptor(toEmail);

    logger.info("Email sent successfully ", { toEmail });

    await session.commitTransaction();

    sendSuccess(res, "Subscription confirmed! Check your email.");

    logger.info("Subscription confirmed! Check your email. ", { toEmail });
  } catch (error) {
    logger.inspectError(error, "Occurred error to send email", {
      toEmail: req.body.toEmail || "unknown",
    });
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
