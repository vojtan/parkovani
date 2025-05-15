let toast: any | null = null

export function setToastInstance(instance: any) {
  toast = instance
}

export function showToast(text: string, severity: string = 'info') {
  let summary = 'Success'
  if (severity == 'error') {
    summary = 'Error'
  }
  if (toast) {
    toast.add({
      severity: severity,
      summary: summary,
      detail: text,
      life: 3000
    })
  } else {
    console.error('Toast instance not set. Make sure to call setToastInstance with the useToast instance.')
  }
}
