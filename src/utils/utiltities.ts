export function getDateFromDateTime(dateTime: Date): Date {
    const expiration = new Date(dateTime);
    expiration.setHours(0, 0, 0, 0);
    return expiration;
}
