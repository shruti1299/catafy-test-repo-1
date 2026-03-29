import { useMediaQuery } from "react-responsive";

export default function useMobile(){
     const isMobile = useMediaQuery({
        query: "(max-width: 1023px)"
      });
    return isMobile
}


