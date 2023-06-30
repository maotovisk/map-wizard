<script lang="ts">
  let icon: string = "info";
  let message: string = "";
  let color: string = "green";

  window.sendNotification = ({
    icon: notificationIcon,
    color: notificationColor,
    message: notificationMessage,
  }: {
    icon: string;
    message: string;
    color: string;
  }) => {
    icon = notificationIcon;
    message = notificationMessage;
    color = notificationColor;
    ui("#toast");
  };
</script>

<div class="toast {color}" id="toast">
  <i>{icon}</i>
  <span>{message}</span>
</div>
