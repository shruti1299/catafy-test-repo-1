import { notification, Button } from "antd";

export const showUpgradePlanNotification = (message?: string) => {
  const key = "plan-upgrade";

  notification.error({
    message: "Plan Limit Reached",
    description: message || "You need to upgrade your plan to proceed.",
    key,
    duration: 0,
    btn: (
      <Button
        htmlType="button"
        href="/pricing"
        type="primary"
        size="small"
      >
        Upgrade Plan
      </Button>
    ),
  });
};
