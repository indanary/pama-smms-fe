interface NotificationUser {
  id: number
  user_id: string
  message: string
  booking_id: number
  is_read: 0 | 1
  created_at: string
}

interface ResponseNotificationList {
  data: NotificationUser[]
}

interface ResponseReadNotification {
  message: string
}
