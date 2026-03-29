import { StaticImageData } from "next/image";

export interface ICatalogType {
    id: string;
    name: string;
    desc: string;
    image: StaticImageData;
  }
  