import { OrderBadgeStyles } from '@/constant/badges-enum';
import React from 'react';

interface IBadge {
  type: 'order-status' ;
  // status?: 0 | 1 | 2 | 3 | 4 | 5 | 10;
  status: number | string;
  className?: string;
}

const BadgeStyles = {
  'order-status': () => OrderBadgeStyles,
}

const Badge = ({ type, status, className }: IBadge) => {
  const style = React.useMemo(() => {
    const styles = BadgeStyles[type]();
    return styles?.[status as keyof typeof styles];
  }, [type, status])
  return (
    <span
      className={`py-1 h-fit px-2 border-2 rounded-md font-semibold place-content-center flex ${className}`}
      style={{
        backgroundColor: style?.backgroundColor,
        borderColor: style?.borderColor,
        color: style?.color,
        minWidth: '105px',
        fontSize: '10px',
      }}
    >
      {style?.status}
    </span>
  )
}

export default Badge;
