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
  // First, get the current value
  const current = await prisma.constants.findUnique({
    where: {
      constant_slug: "google_maps",
    },
  });

  if (!current) {
    throw new Error("Google Maps constant not found");
  }

  // Then update with the new value
  const response = await prisma.constants.update({
    where: {
      constant_slug: "google_maps",
    },
    data: {
      constant_value: current.constant_value + 1,
    },
  });

  return response;
};

export const updateUserLocation = async (lat: string, lon: string): Promise<any> => {
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