import { SvgProps } from "@/app/interface";
import React from "react";

const CustomFooterIcon = ({
  fillColor,
}: {
  fillColor?: SvgProps["fillColor"];
}) => {
  return (
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 0H0V18H16.5V0ZM15.8125 17.25H0.6875V0.75H15.8125V17.25Z"
        fill={fillColor ||"#0F134C"}
      />
      <path d="M14.4375 14.999H2.0625V15.749H14.4375V14.999Z"  fill={fillColor ||"#0F134C"} />
      <path d="M13.0625 12.75H3.4375V13.5H13.0625V12.75Z"  fill={fillColor ||"#0F134C"} />
      <path d="M14.4375 10.5H2.0625V11.25H14.4375V10.5Z"  fill={fillColor ||"#0F134C"} />
    </svg>
  );
};

export default CustomFooterIcon;
