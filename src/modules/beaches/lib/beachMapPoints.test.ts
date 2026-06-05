import { describe, expect, it } from "vitest"
import type { BeachListItem } from "@/modules/beaches/types/list"
import {
    beachMapSelectLabel,
    beachesToMapPoints,
    shouldAutoFocusSingleBeach,
} from "@/modules/beaches/lib/beachMapPoints"

function beach(overrides: Partial<BeachListItem> = {}): BeachListItem {
    return {
        id: "b-1",
        name: "Praia Teste",
        municipality: "Cascais",
        district: "Lisboa",
        latitude: "38.7",
        longitude: "-9.4",
        ...overrides,
    }
}

describe("beachesToMapPoints", () => {
    it("excludes beaches without valid coordinates", () => {
        const points = beachesToMapPoints([
            beach(),
            beach({ id: "b-2", latitude: "", longitude: "" }),
            beach({ id: "b-3", latitude: "999", longitude: "0" }),
        ])
        expect(points).toHaveLength(1)
        expect(points[0]?.id).toBe("b-1")
    })
})

describe("beachMapSelectLabel", () => {
    it("includes municipality when present", () => {
        expect(beachMapSelectLabel(beach())).toBe("Praia Teste · Cascais")
    })

    it("omits municipality when empty", () => {
        expect(beachMapSelectLabel(beach({ municipality: "  " }))).toBe("Praia Teste")
    })
})

describe("shouldAutoFocusSingleBeach", () => {
    it("returns beach id when exactly one point and auto focus enabled", () => {
        expect(
            shouldAutoFocusSingleBeach([{ id: "b-1", name: "X", latitude: "1", longitude: "2" }]),
        ).toBe("b-1")
    })

    it("returns undefined for multiple points", () => {
        expect(
            shouldAutoFocusSingleBeach([
                { id: "b-1", name: "X", latitude: "1", longitude: "2" },
                { id: "b-2", name: "Y", latitude: "3", longitude: "4" },
            ]),
        ).toBeUndefined()
    })

    it("returns undefined when auto focus disabled", () => {
        expect(
            shouldAutoFocusSingleBeach([{ id: "b-1", name: "X", latitude: "1", longitude: "2" }], false),
        ).toBeUndefined()
    })
})
