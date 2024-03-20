import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import md5 from "md5";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const loginUser = async (req: Request, res: Response) => {
  try {
    // first validate info
    const { email, password } = req.body;

    if (
      email === "" ||
      typeof email !== "string" ||
      password === "" ||
      typeof password !== "string"
    ) {
      res.status(400).send("Bad request!");
      return;
    }

    // find user from db
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        categories: true,
      },
    });

    // if user doesn't exist
    if (user === null) {
      res.status(401).send("User doesn't exist, Please sign up!");
      return;
    }

    // at this point user exists
    if (md5(password) !== user.password) {
      res.status(401).send("Invalid password!");
      return;
    }

    // user has been authenticated so we generate tokens
    const payload = { user_id: user.user_id, email: user.email };
    const accessKey = process.env.JWT_ACCESS_KEY || "";
    const refreshKey = process.env.JWT_REFRESH_KEY || "";

    const access_token = jwt.sign(payload, accessKey, { expiresIn: "1h" });
    const refresh_token = jwt.sign(payload, refreshKey, { expiresIn: "7d" });

    res.status(200).send({
      user_data: user,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error!");
  }
};
