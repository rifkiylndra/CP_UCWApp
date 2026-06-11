type DateInput = string | number | Date | null | undefined;

const ID_LOCALE = "id-ID";

export function formatIDR(value: number | string | null | undefined): string {
    const amount = Number(value || 0);

    return new Intl.NumberFormat(ID_LOCALE, {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(value: DateInput, locale = ID_LOCALE): string {
    const date = toValidDate(value);
    if (!date) return "-";

    return date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function formatDateTime(value: DateInput, locale = ID_LOCALE): string {
    const date = toValidDate(value);
    if (!date) return "-";

    return date.toLocaleString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatTime(value: DateInput, locale = ID_LOCALE): string {
    const date = toValidDate(value);
    if (!date) return "-";

    return date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatPercent(value: number | string | null | undefined): string {
    return `${Number(value || 0).toLocaleString(ID_LOCALE)}%`;
}

function toValidDate(value: DateInput): Date | null {
    if (!value) return null;

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}
