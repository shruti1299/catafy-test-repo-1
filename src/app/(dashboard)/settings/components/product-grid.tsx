import React, { useState } from "react";
import { DemoImage } from "@/images/index";
import { DoubleArrowIcon } from "@/svg/index";
import { Button, Card } from "antd";
import Image from "next/image";

const ProductGrid = () => {
  return (
    <Card title={<><DoubleArrowIcon /> Product Display Setting</>}>
    <div className="relative">
      <div className="bg-white border overflow-hidden border-[#c7c7c7] absolute top-4 -left-4  z-10 px-1 py-1 rounded-lg">
        <DoubleArrowIcon />
      </div>
      <div className="border-2 border-[#f3f6ff]  pb-4 overflow-hidden h-screen  rounded-xl bg-white">
        <div className="bg-white py-3 px-4 ">
          <p className="text-lg font-semibold">{"Product grid title "}</p>
        </div>

        <div className="px-4 w-full h-screen">
          <div className="flex justify-end">
            <div className="flex justify-between gap-16 w-[90%]">
              <div
                className="w-[55%] mt-20 p-4 rounded-xl text-center flex flex-col"
                style={{boxShadow: "-2px -2px 30px #eef2f6, 2px 2px 30px #eef2f6",
                }}
              >
                <div className="w-full h-[40vh]">
                  <Image
                    src={DemoImage}
                    height={400}
                    width={400}
                    alt="grid"
                    className="w-full h-full  object-cover rounded-xl"
                  />
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-[#1b1d1f] text-lg">
                    Catalog Title
                  </p>
                  <p className="font-medium text-[#1b1d1f] text-sm">
                    10 Products
                  </p>
                </div>
              </div>
              <div className="w-[35%] flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-4">
                  {/* {GRID_CARD.map((item, index) => {
                    const isActive = active === index;
                    return (
                      <div
                        key={index}
                        onClick={() => setActive(index)}
                        className={`bg-[#f5f9ff] cursor-pointer leading-10 rounded-lg w-full py-6  flex flex-col justify-center items-center ${
                          isActive
                            ? "text-[#2d68fe] border border-[#2d68fe]"
                            : ""
                        }`}
                      >
                        <item.icons fillColor={isActive ? "#2d68fe" : ""} />
                        <p className="text-xs w-max font-medium mt-2">
                          {item.name}
                        </p>
                      </div>
                    );
                  })} */}
                </div>
                <Button className="px-6 py-2 w-full mt-8 border-2 border-[#17174e] text-[#000000] font-medium rounded-md">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Card>
  );
};

export default ProductGrid;
