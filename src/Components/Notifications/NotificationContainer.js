import React from "react";
import { useNotification } from "../../Context/NotificationContext";
import NotificationToast from "./NotificationToast";
import styles from "./NotificationStyle";

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div style={styles.container}>
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
