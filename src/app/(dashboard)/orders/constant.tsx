import { DelIcon, PencilIcon } from "@/svg/index";
import { StopOutlined } from "@ant-design/icons";

export const BUTTON_LIST = [
  { id: "1", name: "All" },
  { id: "2", name: "Pending" },
  { id: "3", name: "Accepted" },
  { id: "4", name: "Confirmed" },
  { id: "5", name: "Cancelled" },
];

export const TABLE_LIST = [
  {
    id: "00001",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "04 Sep 2024",
    type: "Electric",
    status: "Confirmed",
    price: 999.99,
    bgColor: "#ccf0eb",
    color: "#00b197",
  },
  {
    id: " 00002",
    name: "Rosie Pearson",
    address: "979 Immanuel Ferry Suite 526",
    date: "28 May 2024",
    type: "Book",
    status: "Accepted",
    price: 999.99,
    bgColor: "#d4ccfc",
    color: "#6226ef",
  },
  {
    id: " 00003",
    name: "Darrell Caldwell",
    address: "8587 Frida Ports",
    date: "23 Nov 2024",
    type: "Medicine",
    status: "Cancelled",
    price: 999.99,
    bgColor: "#fcd7d4",
    color: "#ef3826",
  },
  {
    id: " 00004",
    name: "Gilbert Johnston",
    address: "768 Destiny Lake Suite 600",
    date: "05 Feb 2024",
    type: "Mobile",
    status: "Pending",
    price: 999.99,
    bgColor: "#ffeddd",
    color: "#ffa756",
  },
  {
    id: "00005",
    name: "Alan Cain",
    address: "042 Mylene Throughway",
    date: "29 Jul 2024",
    type: "Watch",
    status: "Confirmed",
    price: 999.99,
    bgColor: "#ccf0eb",
    color: "#00b197",
  },
  {
    id: "00006",
    name: "Alfred Murray",
    address: "543 Weimann Mountain",
    date: "15 Aug 2024",
    type: "Medicine",
    status: "Pending",
    price: 999.99,
    bgColor: "#ffeddd",
    color: "#ffa756",
  },
  {
    id: "00007",
    name: "Maggie Sullivan",
    address: "New Scottieberg",
    date: "21 Dec 2024",
    type: "Watch",
    status: "Cancelled",
    price: 999.99,
    bgColor: "#fcd7d4",
    color: "#ef3826",
  },
  {
    id: "00008",
    name: "Rosie Todd",
    address: "New Jon",
    date: "30 Apr 2024",
    type: "Medicine",
    status: "Accepted",
    price: 999.99,
    bgColor: "#d4ccfc",
    color: "#6226ef",
  },
  {
    id: "00009",
    name: "Dollie Hines",
    address: "124 Lyla Forge Suite 975",
    date: "09 Jan 2024",
    type: "Book",
    status: "Cancelled",
    price: 999.99,
    bgColor: "#fcd7d4",
    color: "#ef3826",
  },
  {
    id: "00010",
    name: "Dollie Hines",
    address: "124 Lyla Forge Suite 975",
    date: "25/12/2024",
    type: "Electric",
    status: "Cancelled",
    price: 999.99,
    bgColor: "#fcd7d4",
    color: "#ef3826",
  },
  {
    id: "00008",
    name: "Rosie Todd",
    address: "New Jon",
    date: "30 Apr 2024",
    type: "Medicine",
    status: "Accepted",
    price: 999.99,
    bgColor: "#d4ccfc",
    color: "#6226ef",
  },
  {
    id: "00009",
    name: "Dollie Hines",
    address: "124 Lyla Forge Suite 975",
    date: "09 Jan 2024",
    type: "Book",
    status: "Cancelled",
    price: 999.99,
    bgColor: "#fcd7d4",
    color: "#ef3826",
  },
  {
    id: "00010",
    name: "Dollie Hines",
    address: "124 Lyla Forge Suite 975",
    date: "25/12/2024",
    type: "Electric",
    status: "Cancelled",
    price: 999.99,
    bgColor: "#fcd7d4",
    color: "#ef3826",
  },
  {
    id: "00008",
    name: "Rosie Todd",
    address: "New Jon",
    date: "30 Apr 2024",
    type: "Medicine",
    status: "Accepted",
    price: 999.99,
    bgColor: "#d4ccfc",
    color: "#6226ef",
  },
  {
    id: "00009",
    name: "Dollie Hines",
    address: "124 Lyla Forge Suite 975",
    date: "09 Jan 2024",
    type: "Book",
    status: "Cancelled",
    price: 999.99,
    bgColor: "#fcd7d4",
    color: "#ef3826",
  },
  {
    id: "00010",
    name: "Dollie Hines",
    address: "124 Lyla Forge Suite 975",
    date: "25/12/2024",
    type: "Electric",
    status: "Cancelled",
    price: 999.99,
    bgColor: "#fcd7d4",
    color: "#ef3826",
  },
];

export const TABLE_HEADER = [
  { label: "ID", key: "id" },
  { label: "NAME", key: "name" },
  { label: "ADDRESS", key: "address" },
  { label: "DATE", key: "date" },
  { label: "TYPE", key: "type" },
  { label: "STATUS", key: "status" },
];

export const items = [
  {
    key: 1,
    label: (
      <span className="flex gap-2 w-24">
        <PencilIcon /> {"Edit"}{" "}
      </span>
    ),
  },
  {
    label: (
      <span className="flex gap-2 w-24">
        <StopOutlined /> {"Block"}
      </span>
    ),
    key: 2,
  },
  {
    label: (
      <span className="flex  items-center gap-2 w-24">
        <DelIcon /> {"Delete"}
      </span>
    ),
    key: 3,
  },
];
