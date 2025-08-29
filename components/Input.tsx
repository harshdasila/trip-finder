import { forwardRef } from "react";
// import { InputProps } from "@/interfaces/frontend";

const Input = forwardRef<HTMLInputElement, any>(
  ({ label, placeholder, type, register, name, required },ref) => {
    return (
      <div className="">
        {label && (
          <div className="input-label">
            {label}{required && <sup> *</sup>}
          </div>
        )}
        
        <div>
          <input
          {...register(name) }
            type={type || "text"}
            placeholder={placeholder}
            className="text-white flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-white border-[#9794aa]"
          />
        </div>
      </div>
    );
  }
);

export default Input;