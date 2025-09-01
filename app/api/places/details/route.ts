import { getGoogleMapsApiCalls, incrementGoogleMapsApiCalls } from "@/actions/constant.action";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('place_id');
  const MAPS_API_CALLS: any = await getGoogleMapsApiCalls();
    if(MAPS_API_CALLS?.constant_value>= MAPS_API_CALLS?.constant_max_limit){
      return {
        message: "API QUOTA MAX"
      }
    }
    else{
      await incrementGoogleMapsApiCalls();
    }
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  
  return Response.json(await response.json());
}