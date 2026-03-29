import { Button } from "antd";
type IDomain = {
  name: string;
  desc: string;
  example: {
    exam: string;
    domainName: string;
    subDomainName: string;
  };
};
export const DomainCard = ({ name, desc, example }: IDomain) => {
  return (
    <div className="px-4 mb-8 my-4">
      <div className=" bg-[#f9f9f9] w-full text-[#0d0d0d] p-4 rounded-md">
        <div className="w-full leading-10 px-4">
          <p className="font-semibold ">{name} </p>
          <p className="font-normal">{desc}</p>
        </div>
        <div className="relative mt-4 leading-8">
          <p className="pb-4 px-4">
            {example?.exam} <br />
            {example?.domainName} <br />
            {example?.subDomainName}
          </p>
          <Button className="px-6 py-1 absolute right-0 bottom-0 border-2 border-[#17174e] text-[#000000] font-normal rounded-md ">
            Set up now
          </Button>
        </div>
      </div>
    </div>
  );
};
