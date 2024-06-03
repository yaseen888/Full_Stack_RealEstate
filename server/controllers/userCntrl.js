import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// when i hit register it will print email that i will send as payload
export const createUser = asyncHandler(async (req, res) => {
  //basic format of making an API
  console.log("creating a user");
  let { email } = req.body;
  // console.log(email)

  const userExists = await prisma.user.findUnique({ where: { email: email } }); //{where: {email}} it alo work
  // you can check relations in prisma official concepts website

  if (!userExists) {
    //only run when user doesnot exists
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "User registered successfully",
      user: user,
    });
  } else res.status(201).send({ message: "User already registered" });
});

//function to book a visit to resdency
export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "The residency is already booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      res.send("your visit is booked successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

//functions to get all bookings of a user
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    res.status(200).send(bookings);
  } catch (err) {
    throw new Error(err.message);
  }
});

//function to cancle the visit
export const cancelBooking = asyncHandler(async (req, res) => {
  //requirements
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    const index = user.bookedVisits.findIndex((visit) => visit.id === id);
    // visit means a element
    if (index == -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);
      //splice is a javascript method delete only one element from array
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });
      res.send("Booking cancelled successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

//function to add residency in favourite list of user

export const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;
  try {
    const user = await prisma.user.findUnique({
      // get the user
      where: { email },
    });
    if (user.favResidenciesId.includes(rid)) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesId: {
            set: user.favResidenciesId.filter((id) => id !== rid),
          },
        },
      });
      res.send({ message: "Removed from favorites", user: updatedUser });
    } else {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesId: {
            push: rid,
          },
        },
      });
      res.send({ message: "Updated favorites", user: updatedUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

//function to get all favorites
export const getAllFavorites = asyncHandler(async(req, res) => {
  const {email} = req.body;
  try{
    const favResd = await prisma.user.findUnique({
      where: {email},
      select:{ favResidenciesId: true},
    });
    res.status(200).send(favResd)
}
  catch(err){
    throw new Error(err.message);
  }

})
