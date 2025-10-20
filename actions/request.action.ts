"use server"

import { RequestType } from "@/interfaces/trip.interface";

export const getTripRequests = async(tripId: string) => {
  try {
    const response = await prisma?.request.findMany({
      where:{
        trip_id: tripId
      },
      include: {
        user: {
          select:{
            user_email: true,
            user_name: true,
            user_image: true,
          }
        }
      }
    });
    return response;
  } catch (error) {
    console.error("Error in getting trip requests", error);
  }
}

export const updateTripRequest = async(requestId: string, status: RequestType) => {
    try {
        const result = await prisma?.$transaction(async (tx) => {
            const request = await tx.request.findUnique({
                where: {
                    request_id: requestId
                },
                select: {
                    request_user_id: true,
                    trip_id: true,
                    status: true
                }
            });

            if (!request) {
                throw new Error("Request not found");
            }

            // Update the request status
            const updatedRequest = await tx.request.update({
                where: {
                    request_id: requestId
                },
                data: {
                    status: status
                }
            });

            // If accepting, add user to trip participants
            if (status === 'ACCEPTED') {
                // Check if already a participant (avoid duplicates)
                const existingParticipant = await tx.tf_trip_participants.findUnique({
                    where: {
                        trip_id_user_id: {
                            trip_id: request.trip_id,
                            user_id: request.request_user_id
                        }
                    }
                });

                if (!existingParticipant) {
                    await tx.tf_trip_participants.create({
                        data: {
                            trip_id: request.trip_id,
                            user_id: request.request_user_id
                        }
                    });
                }
            }

            return updatedRequest;
        });

        return result;
    } catch (error) {
        console.error("Error in updating request status", error);
        throw error;
    }
}