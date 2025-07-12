import React from "react";

export default function ShippingSkeleton() {
  return (
    <div className="flex gap-2 flex-col">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="animate-pulse" key={index}>
          <div className="w-full bg-border-color rounded justify-between  flex flex-row gap-6  p-5 items-center">
            <div className=" w-1/4 bg-first-linear h-4 rounded"></div>
            <div className=" w-1/2  h-6 rounded flex flex-col gap-2">
              <div className="bg-first-linear h-6 rounded w-full"></div>
              <div className="bg-first-linear h-6 rounded w-[80%]"></div>
            </div>
            <div className=" w-[32px] bg-first-linear h-4 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
