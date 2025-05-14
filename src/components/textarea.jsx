import React from "react";

export const Textarea = ({ className, ...props }) => {
  return (
    <textarea className={`p-2 border rounded w-full ${className}`} {...props} />
  );
};
