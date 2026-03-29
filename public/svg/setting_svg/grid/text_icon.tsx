import { SvgProps } from "@/app/interface";
import React from "react";

const TextIcon = ({ fillColor }: { fillColor?: SvgProps["fillColor"] }) => {
  return (
    <svg
      width="19"
      height="16"
      viewBox="0 0 19 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.39702 2.39702H5.3933V13.1836H2.99628V15.5806H10.1873V13.1836H7.79032V2.39702H10.7866V4.19479H13.1836V1.19851C13.1836 0.880646 13.0574 0.5758 12.8326 0.351036C12.6078 0.126272 12.303 0 11.9851 0H1.19851C0.880646 0 0.5758 0.126272 0.351036 0.351036C0.126272 0.5758 0 0.880646 0 1.19851V4.19479H2.39702V2.39702Z"
        fill={fillColor || "#090B45"}
      />
      <path
        d="M18.5771 6.5918H15.5808H13.1838H10.1875V8.98882H13.1838V15.5806H15.5808V8.98882H18.5771V6.5918Z"
        fill={fillColor || "#090B45"}
      />
    </svg>
  );
};

export default TextIcon;
