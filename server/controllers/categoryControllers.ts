import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const addCategory = async (req: Request, res: Response) => {
  try {
    const authorizationHeaders = req.headers["authorization"];
    // if they don't exist
    if (
      authorizationHeaders === "" ||
      typeof authorizationHeaders !== "string"
    ) {
      res.status(400).send("Bad request.");
      return;
    }

    const tokens = JSON.parse(authorizationHeaders.split(" ")[1]);
    let access_token = tokens.access_token;
    const refresh_token = tokens.refresh_token;

    // verify access token
    const decoded = jwt.decode(access_token, { complete: true }) as JwtPayload;
    const { payload } = decoded;
    // console.log(payload);
    if (typeof payload === "undefined") {
      res.status(401).send("Invalid tokens.");
      return;
    }

    // 1. check for expiry of token, if access token is expired refresh it using refresh token,
    //  if refresh token is expired as well send back an error status and ask for login again
    const currTime = Date.now() / 1000;

    if (decoded) {
      if (decoded.exp && decoded.exp < currTime) {
        // refresh if refresh token valid
        const refresh_decoded = jwt.decode(refresh_token, {
          complete: true,
        }) as JwtPayload;

        if (
          typeof refresh_token !== "string" ||
          (refresh_decoded.exp && refresh_decoded.exp < currTime)
        ) {
          res.status(401).send("Unauthorized, please login again.");
          return;
        }

        const accessKey = process.env.JWT_ACCESS_KEY || "";
        access_token = jwt.sign(payload, accessKey, { expiresIn: "1h" });
      }
    }

    const { category } = req.body;

    if (category === "" || typeof category !== "string") {
      res.status(400).send("Bad request.");
      return;
    }

    const newCategory = await prisma.category.create({
      data: {
        user_id: payload.user_id,
        title: category,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // console.log(newCategory);

    res.status(200).send({
      result: newCategory,
      tokens: { access_token: access_token, refresh_token: refresh_token },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error!");
  }
};

export const removeCategory = async (req: Request, res: Response) => {
  try {
    const authorizationHeaders = req.headers["authorization"];
    // if they don't exist
    if (
      authorizationHeaders === "" ||
      typeof authorizationHeaders !== "string"
    ) {
      res.status(400).send("Bad request.");
      return;
    }

    const tokens = JSON.parse(authorizationHeaders.split(" ")[1]);
    let access_token = tokens.access_token;
    const refresh_token = tokens.refresh_token;

    // verify access token
    const decoded = jwt.decode(access_token, { complete: true }) as JwtPayload;
    const { payload } = decoded;
    // console.log(payload);
    if (typeof payload === "undefined") {
      res.status(401).send("Invalid tokens.");
      return;
    }

    // 1. check for expiry of token, if access token is expired refresh it using refresh token,
    //  if refresh token is expired as well send back an error status and ask for login again
    const currTime = Date.now() / 1000;

    if (decoded) {
      if (decoded.exp && decoded.exp < currTime) {
        // refresh if refresh token valid
        const refresh_decoded = jwt.decode(refresh_token, {
          complete: true,
        }) as JwtPayload;

        if (
          typeof refresh_token !== "string" ||
          (refresh_decoded.exp && refresh_decoded.exp < currTime)
        ) {
          res.status(401).send("Unauthorized, please login again.");
          return;
        }

        const accessKey = process.env.JWT_ACCESS_KEY || "";
        access_token = jwt.sign(payload, accessKey, { expiresIn: "1h" });
      }
    }

    const { id } = req.body;

    if (!id || typeof id !== "number") {
      res.status(400).send("Bad request");
      return;
    }

    const deletedCategory = await prisma.category.delete({
      where: { category_id: id },
    });

    res.status(200).send({
      result: deletedCategory,
      tokens: { access_token: access_token, refresh_token: refresh_token },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error!");
  }
};
