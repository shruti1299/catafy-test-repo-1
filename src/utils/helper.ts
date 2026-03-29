import moment from "moment";
import { notification } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const dateTimeHumanize = (str:string) => {
  const lastView = dayjs(str);
  return lastView.fromNow();
}

export const toTitleCase = (str:string) => {
  if(!str) return str;
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const dateParse = (str:string) => {
  return moment(str).format("DD-MMM-YYYY");
};

export const onlyDateParse = (str:string, isHtml = false) => {
  if (isHtml) {
    return moment(str).format("YYYY-MM-DD");
  }
  return moment(str).format("YYYY-MM-DD");
};

export const convertToSlug = (Text:string, append = "") => {
  var str = Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
  if (!append) {
    return str;
  }
  return str + "-" + append;
};

export const ConvertToSlug = (Text:string) => {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

export const getRandomNum = (max:number) => {
  return Math.floor(Math.random() * max) + 1;
};

export const formatDate = (publish_at:string) => {
  const p = moment(publish_at, "YYYY-MM-DDTHH:mm:ss").fromNow();
  return p;
};

export const formatDateTime = (publish_at:string) => {
  const p = moment(publish_at, "YYYY-MM-DDTHH:mm:ss").format(
    "DD-MMM-YY HH:mm A"
  );
  return p;
};

export const formatDateOnly = (publish_at?:string|null) => {
  if(!publish_at) return;
  const p = moment(publish_at, "YYYY-MM-DDTHH:mm:ss").format("DD-MMM-YYYY");
  return p;
};

export const formatDateTimeAMPM = (publish_at: string) => {
  return moment(publish_at, "YYYY-MM-DD HH:mm:ss").format(
    "DD-MMM-YYYY hh:mm A"
  );
};

export const formatHourAndMinutes = (duration:number) => {
  const minutes = duration % 60;
  const hours = Math.floor(duration / 60);

  return `${hours}:${minutes}`;
};

export const ytVideoIDFromUrl = (url:string) => {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
};

export function inArray(needle:any, haystack:any) {
  var length = haystack.length;
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) return true;
  }
  return false;
}

export function getTaxDetail(amount:number) {
  let total = amount;
  if (total === 0) {
    total = 1;
  }
  if (total <= 0) {
    return { tax: 0, amount: total, total: total };
  }

  const taxRate = 118;
  const price = (total / taxRate) * 100;
  const tax = price * 0.18;

  return {
    tax: parseFloat(tax.toFixed(2)),
    amount: parseFloat(price.toFixed(2)),
    total: total,
  };
}

export const onCopy = (event:any) => {
  event.preventDefault();
  notification.warning({message:"Copy is not allowed!"});
};

export const slugify = (text: string) => {
  if(!text) return "";
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-")
};

export const randomUserName = (username:string) => {
  return username + "-" + Math.floor(1000 + Math.random() * 9000);
}