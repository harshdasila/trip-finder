export const addTrip = async(formData: FormData): Promise<any> => {
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
    const ownerUserId = formData.get("ownerId") as string;
    try {
        const reponse = await prisma?.trip.create({
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
                trip_owner_id: ownerUserId
            }
        })
    } catch (error) {
        
    }
}