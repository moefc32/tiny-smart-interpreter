export default function datePrettier(timestamp) {
    if (!timestamp) return '-';

    const date = new Date(parseInt(timestamp, 10));

    if (isNaN(date.getTime())) {
        return '-';
    }

    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }

    let formattedDate = date.toLocaleString('en-US', options).trim();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    return `${formattedDate}, ${formattedTime}`;
}
