"use server"
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db"

export const getGoogleMapsApiCalls = async () => {
  const response = await prisma.constants.findUnique({
    where: {
      constant_slug: "google_maps"
    },
    select: {
      constant_value: true,
      constant_max_limit: true
    }
  });
  return response;
}
export const incrementGoogleMapsApiCalls = async () => {
  const response = await prisma.constants.update({
    where: {
      constant_slug: "google_maps",
    },
    data: {
      constant_value: {
        increment: 1,
      },
    },
  });

  return response;
};

export const updateUserLocation = async (lat: string, lon: string): Promise<any> => {
  console.log("reached update location", lat, lon)
  try {
    const session = await auth();
    if (lat && lon) {
      const reponse = await prisma?.user?.update({
        where: {
          user_id: session?.user?.id
        },
        data: {
          user_location_lat: lat,
          user_location_lon: lon
        }
      })
    }

  } catch (error) {
    console.error("Error in setting user's location coordinates.", error)
  }
}