import { Button } from "antd";
import Image, { StaticImageData } from "next/image";
import { CatalogEmpty } from "@/images/index";

type IEmpty = {
  image?: StaticImageData;
  message: string;
  buttonText?: string;
  onClick?: () => void;
};

const EmptyState = ({ image = CatalogEmpty, message, buttonText, onClick }: IEmpty) => {
  return (
    <div className="text-center">
        <Image src={image!} height={150} width={150} alt="no-catalog" />
        <p>{message}</p>
        {buttonText && (
          <Button
            onClick={onClick}
            type="primary"
          >
            {buttonText}
          </Button>
        )}
    </div>
  );
};

export default EmptyState;
