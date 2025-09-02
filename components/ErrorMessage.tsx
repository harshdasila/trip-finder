import { ErrorMessageProps } from "@/interfaces/auth.interface";
import React from "react";

const ErrorMessage: React.FC<ErrorMessageProps> = ({ text }) => {
  return (
    <span className="text-red-500 text-[11px] absolute">{text}</span>
  );
};

export default ErrorMessage;