import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
  // console.log("endpoint created") after check output comment this or remove it

  const {
    title,
    description,
    price,
    address,
    city,
    country,
    image,
    facilities,
    userEmail,
  } = req.body.data;

  console.log(req.body.data);
  try {
    const residency = await prisma.residency.create({
      //prisma.residency is a model Residency we are invoking
      data: {
        title,
        description,
        price,
        address,
        city,
        country,
        image,
        facilities,
        // userEmail, it is a relationship in model Residency which is used in the owner field
        owner: { connect: { email: userEmail } },
        //owner is connected with the user collection and it will use the email part as our sent user email
      },
    });
    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      // P2002 is  for unique address is voilated
      throw new Error("A residency with address already there");
    }
    throw new Error(err.message);
  }
});

//function to get all the documents/residencies
export const getAllResidencies = asyncHandler(async (req, res) => {
  try {
    const residencies = await prisma.residency.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(residencies);
  } catch (err) {
    throw new Error(err.message);
  }
});

//function to get a specific document/residency
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params; //we use params when we use url to send some parameters

  try {
    const residency = await prisma.residency.findUnique({
      where: { id },
    });
    res.send(residency);
  } catch (err) {
    throw new Error(err.message);
  }
});
