export function formatPaginationLabel(label: string): string {
    return label
        .replace(/<[^>]*>/g, "")
        .replace(/&laquo;/g, "«")
        .replace(/&raquo;/g, "»")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}
