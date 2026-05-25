declare function route(
    name: string,
    params?: Record<string, unknown> | unknown,
    absolute?: boolean
): string;

declare function route(): {
    current: (name?: string) => boolean | string;
};
