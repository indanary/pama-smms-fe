import { Notify } from 'quasar'

export function showNotificationSuccess(title: string, caption?: string) {
  Notify.create({
    message: title,
    caption: caption ?? '',
    type: 'positive',
    position: 'top-right',
    iconColor: '#2f8719',
    actions: [
      {
        icon: 'close',
        round: true,
        style: { color: 'white' },
      },
    ],
  })
}

export function showNotificationFailed(title: string, caption?: string) {
  Notify.create({
    message: title,
    caption: caption ?? '',
    type: 'negative',
    position: 'top-right',
    iconColor: '#dc2626',
    actions: [
      {
        icon: 'close',
        round: true,
        style: { color: 'white' },
      },
    ],
  })
}
