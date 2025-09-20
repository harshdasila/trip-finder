"use server"
import { auth } from "@/app/api/auth/[...nextauth]/route";


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
                trip_start_date: new Date(),
                trip_end_date: new Date(),
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
  trip_id: string
  trip_title: string
  trip_description: string | null
  trip_starting_location: string
  trip_starting_location_lat: string
  trip_starting_location_lon: string
  trip_start_date: Date
  trip_end_date: Date
  trip_min_budget: number
  trip_max_budget: number
  trip_max_people: number
  distance_km: number
}

export async function getAllTripsNearby(
  userLat: number, 
  userLon: number, 
  limit: number = 20
): Promise<NearbyTripResult[]> {
  try {
    console.log(userLat, userLon, 'users coords')
    
    const nearbyTrips = await prisma?.$queryRawUnsafe(`
      SELECT 
        "trip_id",
        "trip_title",
        "trip_description",
        "trip_starting_location",
        "trip_starting_location_lat",
        "trip_starting_location_lon",
        "trip_start_date",
        "trip_end_date",
        "trip_min_budget",
        "trip_max_budget",
        "trip_max_people",
        ST_Distance(
          "trip_starting_location_geom"::geography,
          ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
        ) / 1000 as distance_km
      FROM "tf_trip"
      WHERE "trip_starting_location_geom" IS NOT NULL
      ORDER BY distance_km ASC
      LIMIT $3
    `, userLat, userLon, limit) as NearbyTripResult[]
    
    console.log(nearbyTrips, 'all trips by distance')
    return nearbyTrips
  } catch (error) {
    console.error('Error fetching trips by distance:', error)
    throw new Error('Failed to fetch trips by distance')
  }
}