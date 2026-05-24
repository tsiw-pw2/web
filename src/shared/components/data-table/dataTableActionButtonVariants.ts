export type DataTableActionButtonVariant = "delete" | "edit" | "block" | "unblock"

export const dataTableActionButtonVariantClasses: Record<DataTableActionButtonVariant, string> = {
    delete: "text-neutral-500 enabled:hover:bg-red-50 enabled:hover:text-red-600",
    edit: "text-neutral-500 enabled:hover:bg-blue-50 enabled:hover:text-blue-600",
    block: "text-neutral-500 enabled:hover:bg-orange-50 enabled:hover:text-orange-600",
    unblock: "text-neutral-500 enabled:hover:bg-green-50 enabled:hover:text-green-600",
}
