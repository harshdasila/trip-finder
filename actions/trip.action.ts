"use server"
import { auth } from "@/app/api/auth/[...nextauth]/route";

function toLocalDate(dateStr: string) {
  const utcDate = new Date(dateStr); // parse ISO from frontend
  const tzOffset = utcDate.getTimezoneOffset() * 60000; // in ms
  return new Date(utcDate.getTime() - tzOffset);
}


export const addTrip = async (formData: FormData): Promise<any> => {
  const session = await auth();
  const title = formData.get('title') as string;
  const maxPeople = Number(formData.get('maxPeople') as string);
  const description = formData.get('description') as string;
  const tripLocation = formData.get('tripLocation') as string;
  const locationLat = formData.get('locationLat') as string;
  const locationLon = formData.get('locationLon') as string;
  const startLocation = formData.get('startLocation') as string;
  const startLocationLat = formData.get('startLocationLat') as string;
  const startLocationLon = formData.get('startLocationLon') as string;
  const minBudget = Number(formData.get('minBudget') as string);
  const maxBudget = Number(formData.get('maxBudget') as string);
  const startDateRaw = formData.get('startDate') || new Date();
  const endDateRaw = formData.get('endDate');
  // const endDate: string | Date = endDateRaw !== null ? endDateRaw as string : new Date();
  // const startDate: string | Date = startDateRaw !== null ? startDateRaw as string : new Date();
  const startDate = toLocalDate(formData.get("startDate") as string);
  const endDate = toLocalDate(formData.get("endDate") as string);
  console.log(startDate, endDate, 'dates in backend');
  // const ownerUserId = formData.get("ownerId") as string;
  try {
    if (!session?.user?.id) {
      throw new Error('User session required');
    }
    const response = await prisma?.trip.create({
      data: {
        trip_title: title,
        trip_max_people: maxPeople,
        trip_description: description,
        trip_location: tripLocation,
        trip_location_lat: locationLat,
        trip_location_lon: locationLon,
        trip_starting_location: startLocation,
        trip_starting_location_lat: startLocationLat,
        trip_starting_location_lon: startLocationLon,
        trip_min_budget: minBudget,
        trip_max_budget: maxBudget,
        trip_start_date: startDate,
        trip_end_date: endDate,
        trip_owner_id: session?.user?.id
      }
    });
    if (prisma) {
      const update = await prisma.$executeRaw`
                UPDATE "tf_trip"
                SET trip_starting_location_geom = ST_SetSRID(
                    ST_MakePoint(
                    CAST(${response?.trip_starting_location_lon} AS double precision),
                    CAST(${response?.trip_starting_location_lat} AS double precision)
                    ),
                    4326
                )
                WHERE trip_id = ${response?.trip_id};
                `;
    }
  } catch (error) {
    console.error("Error in creating trip", error)
  }
}

export const getTrips = async (userLon: number, userLat: number): Promise<any> => {
  try {
    const response = await prisma?.$queryRawUnsafe(`
        SELECT 
        *,
        ST_Distance(
            trip_starting_location_geom,
            ST_SetSRID(ST_MakePoint(${userLon}, ${userLat}), 4326)
        ) AS distance
        FROM "tf_trip"
        ORDER BY distance ASC
    `);
    return response;
  } catch (error) {
    console.error("Error in fetching trips", error);
  }
}

interface NearbyTripResult {
  trip_id: string;
  trip_title: string;
  trip_description: string | null;
  trip_starting_location: string;
  trip_starting_location_lat: string;
  trip_starting_location_lon: string;
  trip_start_date: Date;
  trip_end_date: Date;
  trip_min_budget: number;
  trip_max_budget: number;
  trip_max_people: number;
  trip_owner_id: string;
  distance_km: number;
  has_requested: boolean;      // New field
  request_status: string | null; // New field - will be PENDING/ACCEPTED/REJECTED or null
}

export async function getAllTripsNearby(
  userLat: number,
  userLon: number,
  userId?: string, // Add userId parameter
  limit: number = 20
): Promise<NearbyTripResult[]> {
  try {
    console.log(userId, 'users iddd')

    const nearbyTrips = await prisma?.$queryRawUnsafe(`
      SELECT 
        t."trip_id",
        t."trip_title",
        t."trip_description",
        t."trip_starting_location",
        t."trip_starting_location_lat",
        t."trip_starting_location_lon",
        t."trip_start_date",
        t."trip_end_date",
        t."trip_min_budget",
        t."trip_max_budget",
        t."trip_max_people",
        t."trip_owner_id",
        ST_Distance(
          t."trip_starting_location_geom"::geography,
          ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
        ) / 1000 as distance_km,
        CASE 
          WHEN r."request_id" IS NOT NULL THEN true 
          ELSE false 
        END as has_requested,
        r."status" as request_status
      FROM "tf_trip" t
      LEFT JOIN "tf_request" r ON t."trip_id" = r."trip_id" AND r."request_user_id" = $4
      WHERE t."trip_starting_location_geom" IS NOT NULL
      ORDER BY distance_km ASC
      LIMIT $3
    `, userLat, userLon, limit, userId) as NearbyTripResult[]
    return nearbyTrips
  } catch (error) {
    console.error('Error fetching trips by distance:', error)
    throw new Error('Failed to fetch trips by distance')
  }
}

export async function requestToJoinTripAction(userId: any, tripId: any, text: any) {
  try {
    const reponse = await prisma?.request?.create({
      data:{
        trip_id: tripId,
        request_user_id: userId,
        request_message: text
      }
    });
    return reponse;
  } catch (error) {
    console.error("Error in joining trip", error);
  }
}

export async function cancelRequestTripAction(userId: any, tripId: any){
  try {
    if(!userId || !tripId){
      return null;
    }
    const response = await prisma?.request?.delete({
      where:{
        request_user_id_trip_id:{
          trip_id: tripId,
          request_user_id: userId
        }
      }
    });
    return response;
  } catch (error) {
    console.error("Error in deleting trip request", error);
  }
}

export const getMyTrips = async() => {
  try {
    const session = await auth();
    const response = await prisma?.trip?.findMany({
      where:{
        trip_owner_id: session?.user?.id
      }
    });
    return response;
  } catch (error) {
    console.error("Error in getting my trips", error);
  }
}

export const ifTripExistAction = async(tripId: string) => {
  try {
    const reponse = await prisma?.trip.findUnique({
      where:{
        trip_id: tripId
      }
    });
    return reponse ? true : false;
  } catch (error) {
    console.error("Error in checking trip ", error);
  }
}

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