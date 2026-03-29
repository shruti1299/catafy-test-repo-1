import { message } from "antd";
import { deleteUserToken } from "@/utils/get-token";
import { showUpgradePlanNotification } from "@/utils/notifications";

export const autoErrorHandle = (error: any) => {
  if (!error?.response) return error;

  const { status, data } = error.response;

  switch (status) {
    case 401:
      deleteUserToken();
      if (typeof window !== "undefined") {
        window.location.pathname = "/auth/login";
      }
      break;

    case 403:
      message.error(data?.message || "Access denied.");
      break;

    case 404:
      if (data?.data && typeof data.data === "object") {
        Object.values(data.data).forEach((messages: any) => {
          messages.forEach((msg: string) => {
            message.error(msg);
          });
        });
      } else {
        console.log(data)
        message.error(data?.message || "Not found.");
      }
      break;

    case 422:
      if (data?.action === "plan_upgrade") {
        showUpgradePlanNotification(data.message);
      } else if (data?.errors && typeof data.errors === "object") {
        Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
          messages.forEach((msg: string) => {
            message.warning(`${field}: ${msg}`, 4);
          });
        });
      } else {
        message.warning(data?.message || "Validation failed. Please check your input.", 4);
      }
      break;

    case 429:
      message.warning("Too many requests. Please wait a moment.");
      break;

    case 419:
      message.error("Session expired. Please refresh the page.");
      break;

    case 500:
      message.error("Internal server error. Please try again later.");
      break;

    default:
      message.error(data?.message || "An unexpected error occurred.");
      console.error("Unhandled error:", error);
  }

  return error;
};
