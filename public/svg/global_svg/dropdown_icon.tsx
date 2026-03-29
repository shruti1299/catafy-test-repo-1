import React from 'react'
interface IProps {
  className?: string;
}
const DropdownIcon = ({ className}: IProps) => {
  return (
    <svg width="15" height="10" viewBox="0 0 10 6" fill="none" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.646447 0.659675C0.841709 0.446775 1.15829 0.446775 1.35355 0.659675L4.64645 4.25C4.84171 4.4629 5.15829 4.4629 5.35355 4.25L8.64645 0.659676C8.84171 0.446776 9.15829 0.446776 9.35355 0.659676C9.54882 0.872575 9.54882 1.21775 9.35355 1.43065L6.06066 5.02098C5.47487 5.65967 4.52513 5.65968 3.93934 5.02098L0.646447 1.43065C0.451184 1.21775 0.451184 0.872574 0.646447 0.659675Z" />
    </svg>
  )
}

export default DropdownIcon