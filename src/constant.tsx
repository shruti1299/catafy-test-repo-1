import { AddProductIcon, ArrowDownIcon, ArrowRiseIcon, CopyIcon, DownloadIcon, ShareFileIcon } from '@/svg/index'; 

export const CURRENCY_ICON = "₹";

export const StatsConst = [
    {
        title: 'Views',
        value: '721K',
        percentage: '+11.01%',
        icon: <ArrowRiseIcon className="fill-[#1c1c1c]" />,
        statsClass: 'bg-primary-blue border-blue-100 hover:border-blue-300',
    },
    {
        title: 'Visits',
        value: '367K',
        percentage: '-0.03%',
        icon: <ArrowRiseIcon className="fill-[#1c1c1c]" />,
        statsClass: 'bg-primary-purple border-purple-100 hover:border-blue-300',
    },
    {
        title: 'New Users',
        value: '1,156',
        percentage: '+15.03%',
        icon: <ArrowDownIcon className="fill-[#1c1c1c]" />,
        statsClass: 'bg-primary-blue border-blue-100 hover:border-blue-300',
    },
    {
        title: 'Active Users',
        value: '239K',
        percentage: '+6.08%',
        icon: <ArrowRiseIcon className="fill-[#1c1c1c]" />,
        statsClass: 'bg-primary-purple border-purple-100 hover:border-blue-300',
    },
];


export const QUICK_ACTIONS = [
    {
      icon: ShareFileIcon,
      title: "Share Store Link",
    },
    {
      icon: CopyIcon,
      title: "Copy Store Link",
    },
    {
      icon: AddProductIcon,
      title: "Add New Product",
    },
    {
      icon: DownloadIcon,
      title: "Download Reports",
    },
  ];
