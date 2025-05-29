export function getDateFromDateTime(dateTime) {
    const expiration = new Date(dateTime);
    expiration.setHours(0, 0, 0, 0);
    return expiration;
}
//# sourceMappingURL=utiltities.js.map