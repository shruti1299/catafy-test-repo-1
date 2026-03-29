import React from "react";

type IconWrapperProps = {
  icon: React.ReactElement<{ style?: React.CSSProperties }>;
  style?: React.CSSProperties;
};

const IconWrapper = ({ icon, style }: IconWrapperProps) => {
  return React.cloneElement(icon, {
    style: {
      fontSize: "18px",       // default size
      color: "#333",          // default color
      ...icon.props.style,    // preserve any icon-specific style
      ...style,               // override with passed-in style
    },
  });
};

export default IconWrapper;
