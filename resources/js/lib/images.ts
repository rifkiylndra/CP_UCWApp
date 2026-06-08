import type React from "react";

export const MENU_IMAGE_PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='180' viewBox='0 0 240 180'%3E%3Crect width='240' height='180' fill='%23E8E2DB'/%3E%3Cpath d='M72 116h96' stroke='%23C8A96E' stroke-width='10' stroke-linecap='round'/%3E%3Ccircle cx='120' cy='82' r='28' fill='%23D8C5A5'/%3E%3C/svg%3E";

export function resolveImageUrl(value?: string | null): string {
    const image = value?.trim();

    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) return image;
    if (image.startsWith("/")) return image;

    return `/${image.replace(/^\/+/, "")}`;
}

export function firstImageUrl(...values: Array<string | null | undefined>): string {
    for (const value of values) {
        const resolved = resolveImageUrl(value);

        if (resolved) return resolved;
    }

    return "";
}

export function useFallbackImage(event: React.SyntheticEvent<HTMLImageElement, Event>) {
    const image = event.currentTarget;

    if (image.src !== MENU_IMAGE_PLACEHOLDER) {
        image.src = MENU_IMAGE_PLACEHOLDER;
    }
}
