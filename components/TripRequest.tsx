"use client";
import { TripRequestInterface } from "@/interfaces/trip.interface";
import React, { useState } from "react";
import {
  User,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  formatDate,
  formatTime,
  getTimeAgo,
  statusConfig,
} from "@/utils/constantFunctions";
import { updateTripRequest } from "@/actions/request.action";

const TripRequest = (params: TripRequestInterface) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState(params.status);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    const response = await updateTripRequest(params.request_id, "ACCEPTED");
    if (response) {
      setTimeout(() => {
        setStatus("ACCEPTED");
        setIsProcessing(false);
        if (
          typeof window !== "undefined" &&
          (window as any).updateTripRequestStats
        ) {
          (window as any).updateTripRequestStats(params.request_id, "ACCEPTED");
        }
      }, 1000);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    const response = await updateTripRequest(params.request_id, "REJECTED");
    if (response) {
      setTimeout(() => {
        setStatus("REJECTED");
        setIsProcessing(false);
        if (
          typeof window !== "undefined" &&
          (window as any).updateTripRequestStats
        ) {
          (window as any).updateTripRequestStats(params.request_id, "REJECTED");
        }
      }, 1000);
    }
  };

  const getStatusBadge = () => {
    const config = statusConfig[status];
    return (
      <span
        className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-semibold`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          {params.user.user_image ? (
            <img
              src={params.user.user_image}
              alt={params.user.user_name}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
            />
          ) : (
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3 flex-shrink-0 w-14 h-14 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}

          {/* User Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {params.user.user_name}
            </h3>
            <p className="text-sm text-gray-500">{params.user.user_email}</p>
            <p className="text-xs text-gray-400 mt-1">
              {getTimeAgo(params.request_created_at)}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>{getStatusBadge()}</div>
      </div>

      {/* Request Details */}
      <div className="space-y-3 mb-4">
        {/* Date and Time */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(params.request_created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(params.request_created_at)}</span>
          </div>
        </div>

        {/* Request Message */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-start gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700">Message:</span>
          </div>
          <p
            className={`text-gray-600 text-sm leading-relaxed ${
              !isExpanded &&
              params.request_message &&
              params.request_message.length > 150
                ? "line-clamp-3"
                : ""
            }`}
          >
            {params.request_message}
          </p>
          {params.request_message && params.request_message.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 text-xs mt-2 hover:underline font-medium"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Request ID */}
        {/* <div className='text-xs text-gray-400'>
          Request ID: {params.request_id}
        </div> */}
      </div>

      {/* Action Buttons */}
      {status === "PENDING" && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {isProcessing ? "Processing..." : "Accept Request"}
          </button>
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            {isProcessing ? "Processing..." : "Reject Request"}
          </button>
        </div>
      )}

      {/* Status Message for Accepted/Rejected */}
      {status !== "PENDING" && (
        <div
          className={`pt-4 border-t border-gray-200 text-center ${
            status === "ACCEPTED" ? "text-green-600" : "text-red-600"
          }`}
        >
          <p className="text-sm font-medium">
            {status === "ACCEPTED"
              ? "✓ Request has been accepted"
              : "✗ Request has been rejected"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Updated on {formatDate(params.request_updated_at)}
          </p>
        </div>
      )}
    </div>
  );
};

export default TripRequest;
