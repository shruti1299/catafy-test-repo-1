import { SvgProps } from "@/app/interface";
import React from "react";

const SingleColumnIcon = ({
  fillColor,
}: {
  fillColor?: SvgProps["fillColor"];
}) => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill={"none"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="18" height="18" rx="1.5" stroke={ fillColor || "#090B45"} />
    </svg>
  );
};

export default SingleColumnIcon;
