import type { KanbanOrder } from "@/types/staff";

export interface KanbanOrderGroups {
    incoming: KanbanOrder[];
    processing: KanbanOrder[];
    completed: KanbanOrder[];
}

export function flattenKanbanOrders(source: KanbanOrderGroups): KanbanOrder[] {
    return [...source.incoming, ...source.processing, ...source.completed];
}

export function filterOrdersByQuery(
    source: KanbanOrderGroups,
    query: string,
): KanbanOrderGroups {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return source;

    return {
        incoming: source.incoming.filter((order) => orderMatchesQuery(order, normalizedQuery)),
        processing: source.processing.filter((order) => orderMatchesQuery(order, normalizedQuery)),
        completed: source.completed.filter((order) => orderMatchesQuery(order, normalizedQuery)),
    };
}

export function countKanbanOrders(source: KanbanOrderGroups): number {
    return source.incoming.length + source.processing.length + source.completed.length;
}

function orderMatchesQuery(order: KanbanOrder, query: string): boolean {
    const searchableText = [
        order.id,
        order.orderId,
        order.tableLabel,
        order.customerName,
        order.orderType,
        ...order.items.map((item) => item.menuItem?.name),
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return searchableText.includes(query);
}
