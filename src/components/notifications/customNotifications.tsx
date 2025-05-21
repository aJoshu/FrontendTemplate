import { COLORS } from "@/app/lib/Colors";
import { notifications } from "@mantine/notifications";

export const customNotification = (title: string, message: string) => {
    let notificationColor;

    notifications.show({
        id: `custom-notification-${title}`,
        position: 'top-center',
        withCloseButton: true,
        autoClose: 3000,
        title: title,
        message: message,
        color: notificationColor,
        style: { width: 'calc(100% - 32px)', minWidth: 300, maxWidth: '550px', left: 16, bottom: 32 },
        loading: false,
    });
};
