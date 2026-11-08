import { describe, expect, it } from "vitest";
import { scrollVideoTime } from "@/lib/scroll-video";
import { SERVICES } from "@/lib/business";

describe("Scroll-controlled video", () => {
  it("maps forward and reverse scrolling to the same video position", () => {
    expect(scrollVideoTime(0, 10)).toBe(0);
    expect(scrollVideoTime(0.5, 10)).toBe(4.98);
    expect(scrollVideoTime(1, 10)).toBe(9.96);
    expect(scrollVideoTime(0.25, 10)).toBe(2.49);
  });
  it("clamps scroll overshoot and handles unloaded duration", () => {
    expect(scrollVideoTime(-1, 10)).toBe(0);
    expect(scrollVideoTime(2, 10)).toBe(9.96);
    expect(scrollVideoTime(1, Number.NaN)).toBe(0);
  });
});

it("offers exactly the five owner-requested services", () => {
  expect(SERVICES.map(service => service.id)).toEqual(["crossfit", "zumba", "yoga", "gym", "cardio"]);
});