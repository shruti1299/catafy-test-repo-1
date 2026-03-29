import React from "react";

const ProductButtonListIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <div>
      <svg
        width="10"
        height="10"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.34883 0H0V1.57206H1.34883V0ZM12 0H4.97057V1.57206L12 1.57274V0ZM1.34883 5.21328H0V6.7867H1.34883V5.21328ZM12 5.21328H4.97057V6.7867H12V5.21328ZM1.34883 10.4273H0V11.9993H1.34883V10.4273ZM12 10.4273H4.97057V11.9993L12 12V10.4273Z"
          fill={isActive ? "#fff" : "#060843"}
        />
      </svg>
    </div>
  );
};

export default ProductButtonListIcon;
