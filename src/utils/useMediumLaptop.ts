import { useMediaQuery } from "react-responsive";

export default function useMediumLaptop(){
    const isLaptop = useMediaQuery({
       query: "(min-width: 1024px) and (max-width:1200px)",  
     });
   return isLaptop
  }

  
  