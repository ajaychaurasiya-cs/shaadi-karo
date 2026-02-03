let toastInstance = null;

// lazy load toast only when needed
const loadToast = async () => {
  if (!toastInstance) {
    const mod = await import("react-toastify");
    toastInstance = mod.toast;
  }
  return toastInstance;
};

const notify = {
  success: async (msg, options = {}) => {
    const toast = await loadToast();
    toast.success(msg, options);
  },

  error: async (msg, options = {}) => {
    const toast = await loadToast();
    toast.error(msg, options);
  },

  warn: async (msg, options = {}) => {
    const toast = await loadToast();
    toast.warn(msg, options);
  },

  info: async (msg, options = {}) => {
    const toast = await loadToast();
    toast.info(msg, options);
  },
};

export default notify;
