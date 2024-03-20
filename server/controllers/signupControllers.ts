import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { SENDMAIL } from "../mail/mailService";
import md5 from "md5";

const prisma = new PrismaClient();

let otpCode: number;

export const addUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    // validate data
    if (
      email === "" ||
      typeof email !== "string" ||
      password === "" ||
      typeof password !== "string" ||
      name === "" ||
      typeof name !== "string"
    ) {
      res.status(400).send("Bad request.");
      return;
    }

    // check whether already present in db
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user !== null) {
      res.status(401).send("User already present. Please login!");
      return;
    }

    // if user not present generate a random 8 digit otp and send to client using email
    otpCode = Math.floor(10000000 + Math.random() * 90000000);
    // console.log(otpCode);

    const options = {
      from: "roc8assignment@gmail.com",
      to: email,
      subject: "OTP for registration.",
      html: `
      <h2>Your One-Time Password (OTP)</h2>
      <p>Your OTP is: <strong>${otpCode}</strong></p>
      <p>Please use this OTP to verify your account.</p>
    `,
    };

    await SENDMAIL(options);

    res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error!");
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { otp, name, email, password } = req.body;

    if (
      otp === "" ||
      typeof otp !== "string" ||
      email === "" ||
      typeof email !== "string" ||
      password === "" ||
      typeof password !== "string" ||
      name === "" ||
      typeof name !== "string"
    ) {
      res.status(400).send("Bad request.");
      return;
    }

    // validate otp
    const val = Number(otp);

    if (val !== otpCode) {
      res.status(401).send("Unauthorized, wrong otp!");
      return;
    }

    // if verification is successful create new user and insert in db
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: md5(password),
        created_at: new Date(),
      },
    });

    // console.log(user);

    res.status(200).send("Sign up successful, redirecting to login page...");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error!");
  }
};
