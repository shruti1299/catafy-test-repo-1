interface ICatalog {
  name: string;
  icons: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  arrowIcon:React.ReactNode
}
const SettingCard: React.FC<ICatalog> = ({
  name,
  icons,
  onClick,
  arrowIcon,

  isActive,
}) => {
  return (
    <div className={`p-3 my-1 rounded-md overflow-hidden  cursor-pointer  ${ isActive && "bg-[#f3f6ff] text-[#2d68fe] font-semibold" }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center py-2">
        <div className="flex justify-start items-center gap-2 ">
          {icons}
          <p className="text-sm font-semibold">{name}</p>
        </div>
        <div>{isActive && arrowIcon}</div>
      </div>
    </div>
  );
};

export default SettingCard;
