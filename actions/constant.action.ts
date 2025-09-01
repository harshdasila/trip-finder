import prisma from "@/db"

export const getGoogleMapsApiCalls = async() => {
    const response = await prisma.constants.findUnique({
        where: {
            constant_slug: "google_maps"
        },
        select:{
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
