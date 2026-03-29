import { SvgProps } from "@/app/interface";
import React from "react";

const DoubleColumnIcon = ({
  fillColor,
}: {
  fillColor?: SvgProps["fillColor"];
}) => {
  return (
    <svg
      width="26"
      height="23"
      viewBox="0 0 26 23"
      fill={"none"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="11"
        height="22"
        rx="1.5"
        stroke={fillColor || "#090B45"}
      />
      <rect
        x="14.5"
        y="0.5"
        width="11"
        height="22"
        rx="1.5"
        stroke={fillColor || "#090B45"}
      />
    </svg>
  );
};

export default DoubleColumnIcon;
