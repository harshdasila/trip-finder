import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div>
      <main>{children}</main>
      <div className="flex justify-center item-center">Made with ❤️ by Harsh Dasila</div>
    </div>
  );
};

export default layout;
