import Image, { StaticImageData } from "next/image";
import Checkbox from "./checkbox";
interface ICatalog {
  name: string;
  desc: string;
  image: StaticImageData;
  icons: React.ReactNode;
  className: string;
  onClick: () => void;
  type?: string;
}
const Horizontal: React.FC<ICatalog> = ({
  name,
  desc,
  image,
  icons,
  onClick,
  className,
  type,
}) => {
  return (
    <div
      className={`${
        type === "checkbox" && "flex justify-start items-center ps-4 w-full"
      }`}
    >
      {type === "checkbox" && <Checkbox />}
      <div className={className} onClick={onClick}>
        <div className="w-full flex justify-between items-center py-2">
          <div className="flex justify-start items-center gap-4">
            <div>
              <Image
                src={image}
                width={100}
                height={100}
                alt={name}
                quality={100}
                className="rounded-md h-full w-full "
                // priority
              />
            </div>
            <div>
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-xs font-medium">{desc}</p>
            </div>
          </div>
          <div className="flex justify-start items-center gap-4">{icons}</div>
        </div>
      </div>
    </div>
  );
};

export default Horizontal;
