import { getGoogleMapsApiCalls, incrementGoogleMapsApiCalls } from "@/actions/constant.action";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input');
  const MAPS_API_CALLS: any = await getGoogleMapsApiCalls();
  if(MAPS_API_CALLS?.constant_value>= MAPS_API_CALLS?.constant_max_limit){
    return Response.json({
      message: "API QUOTA MAX"
    })
  }
  else{
    await incrementGoogleMapsApiCalls();
  }
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  
  return Response.json(await response.json());
}
