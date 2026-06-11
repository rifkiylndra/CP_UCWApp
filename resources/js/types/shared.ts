import type { ReactNode } from "react";

export type Nullable<T> = T | null;

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    current_page?: number;
    first_page_url?: string | null;
    from?: number | null;
    last_page?: number;
    last_page_url?: string | null;
    links?: PaginationLink[];
    next_page_url?: string | null;
    path?: string;
    per_page?: number;
    prev_page_url?: string | null;
    to?: number | null;
    total?: number;
}

export interface ApiResponse<T> {
    success?: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
}

export type Renderable = ReactNode;
