// src/composables/useNotification.js
import { ref } from 'vue';

const notification = ref({
  show: false,
  message: '',
  type: 'info', // 'info' atau 'error'
});

export function useNotification() {
  const showNotification = (message, type = 'info', duration = 4000) => {
    notification.value = { show: true, message, type };
    setTimeout(() => {
      notification.value.show = false;
    }, duration);
  };

  return { notification, showNotification };
}
