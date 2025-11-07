import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "react-toastify";

const TripActions = ({
  hasRequested,
  requestStatus,
  cancelTripRequest,
  tripId,
  requestToJoinTrip,
  genderSpecific,
  tripStartDate,
  tripEndDate
}: {
  hasRequested: any;
  requestStatus: any;
  cancelTripRequest: any;
  tripId: any;
  requestToJoinTrip: any;
  genderSpecific: any;
  tripStartDate: any;
  tripEndDate: any
}) => {
  console.log(genderSpecific,'thissss')
  const { data, status }: any = useSession();
  return (
    <>
      {hasRequested === true && requestStatus == "PENDING" && (
        <div>
          <div className="mt-auto pt-3">
            <button
              onClick={() => cancelTripRequest(tripId)}
              className="w-full bg-red-400 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
            >
              Cancel Trip Request
            </button>
          </div>
        </div>
      )}
      {(hasRequested === false ||
        (hasRequested == true && requestStatus == "REJECTED")) && (
        <div className="mt-auto pt-3">
          <button
            onClick={() => {
              if (
                status==="authenticated" &&
                genderSpecific !== "mixed" &&
                data?.user?.gender?.toUpperCase() !==
                  genderSpecific?.toUpperCase()
              ) {
                toast.error(`This is a ${genderSpecific} only trip!`);
                return;
              }
              requestToJoinTrip();
            }}
            className={`w-full text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 ${
              status === "authenticated" &&
              (genderSpecific === "mixed" ||
                data?.user?.gender?.toUpperCase() ===
                  genderSpecific?.toUpperCase())
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-gray-500 cursor-pointer"
            }`}
          >
            Request to Join Trip
          </button>
        </div>
      )}
    </>
  );
};

export default TripActions;
