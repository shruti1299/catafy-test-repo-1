import React from "react";

interface IProps {
  className?: string;
}

const QRCodeMenuIcon = ({ className }: IProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="3" y="15" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="15" y="3" width="6" height="6" rx="1" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 15H17V17H15V15ZM17 17H19V19H17V17ZM15 19H17V21H15V19ZM19 15H21V17H19V15Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default QRCodeMenuIcon;
