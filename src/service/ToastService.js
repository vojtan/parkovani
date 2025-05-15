let toast = null;
export function setToastInstance(instance) {
    toast = instance;
}
export function showToast(text, severity = 'info') {
    let summary = 'Success';
    if (severity == 'error') {
        summary = 'Error';
    }
    if (toast) {
        toast.add({
            severity: severity,
            summary: summary,
            detail: text,
            life: 3000
        });
    }
    else {
        console.error('Toast instance not set. Make sure to call setToastInstance with the useToast instance.');
    }
}
//# sourceMappingURL=ToastService.js.map