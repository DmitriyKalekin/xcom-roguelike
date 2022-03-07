import {Mixable, IMixable} from "../src/mixins/Mixable";
import {AttrOwner1, AttrOwner2, Movable, Jumpable} from "./common";

// interface Player1 extends Mixable, Movable, Jumpable {
// }
//
// interface Player2 extends Mixable, Jumpable {
// }


test("Mixable can check it's instance", () => {
    let m = new Mixable();
    expect(m).toHaveProperty("_instances", ["Mixable"]);
    expect(m).toHaveProperty("isInstance");
    expect(m).toHaveProperty("addInstance");
    expect(m).toHaveProperty("mix");
    expect(m.isInstance(Mixable)).toBe(true);
    expect(m.isInstance("Mixable")).toBe(true);
});

test("Corrupted Mixable can check it's instance", () => {
    let m = new Mixable();
    m._instances = [];
    expect(m.isInstance(Mixable)).toBe(true);
    expect(m.isInstance("Mixable")).toBe(true);
});

test("Object AttrOwner1 becomes IMixable / Mixable", () => {
    let p1 = new AttrOwner1();
    let p2 = Mixable.wrap(p1);
    expect(p2).toHaveProperty("_instances", ["Mixable", "AttrOwner1"]);
    expect(p2).toHaveProperty("isInstance");
    expect(p2).toHaveProperty("addInstance");
    expect(p2).toHaveProperty("mix");
    expect(p2.isInstance(Mixable)).toBe(true);
    expect(p2.isInstance(AttrOwner1)).toBe(true);
});

test("Double wrapping to IMixable / Mixable is the same Object", () => {
    let p1 = new AttrOwner1();
    let p2 = Mixable.wrap(p1);
    let p3 = Mixable.wrap(p2);
    expect(p2.isInstance(Mixable)).toBe(true);
    expect(p2.isInstance(AttrOwner1)).toBe(true);
    expect(p3.isInstance(Mixable)).toBe(true);
    expect(p3.isInstance(AttrOwner1)).toBe(true);
    expect(p2).toBe(p3);
});


test("Mixable AttrOwner1.isInstance('string') knows it's instances", () => {
    let p1 = new AttrOwner1();
    let result = Mixable.wrap(p1);
    expect(result.isInstance("Mixable")).toBe(true);
    expect(result.isInstance("AttrOwner1")).toBe(true);
});

test("Mixable AttrOwner1.isInstance(ClassName) knows it's instances", () => {
    let p1 = new AttrOwner1();
    let result = Mixable.wrap(p1);
    expect(result.isInstance(Mixable)).toBe(true);
    expect(result.isInstance(AttrOwner1)).toBe(true);
});

test("Identical attribute not copied by Mixable.copy_attributes()", () => {
    let p1 = new AttrOwner1();
    let p2 = new AttrOwner2();
    let result = Mixable.copy_attributes(p1, p2);

    expect(result).toHaveProperty("name", "AttrOwner1");
    expect(result).not.toHaveProperty("name", "AttrOwner2");
    expect(result).toHaveProperty("sex", "male");
    expect(result).toHaveProperty("age", 20);
});

test("Mixable object can mix() another object to itself, object will be the same", () => {
    let p1 = Mixable.wrap(new AttrOwner1());
    let p2 = new AttrOwner2();
    let result = p1.mix(p2);
    expect(result).toBe(p1);
    expect(result).toHaveProperty("_instances", ["Mixable", "AttrOwner1", "AttrOwner2"]);
});

test("Mixable.merge() makes dest object Mixable", () => {
    let result = Mixable.merge(new AttrOwner1(), new AttrOwner2());
    expect(result).toHaveProperty("_instances", ["Mixable", "AttrOwner1", "AttrOwner2"]);
});

test("Mixable.merge() accepts dest object as Mixable", () => {
    let result = Mixable.merge(Mixable.wrap(new AttrOwner1()), new AttrOwner2());
    expect(result).toHaveProperty("_instances", ["Mixable", "AttrOwner1", "AttrOwner2"]);
});


test("Mixable.merge() accepts source object as Mixable", () => {
    let result = Mixable.merge(new AttrOwner1(), Mixable.wrap(new AttrOwner2()));
    expect(result).toHaveProperty("_instances", ["Mixable", "AttrOwner1", "AttrOwner2"]);
});

test("Mixable.merge() accepts both objects as Mixable", () => {
    let result = Mixable.merge(Mixable.wrap(new AttrOwner1()), Mixable.wrap(new AttrOwner2()));
    expect(result).toHaveProperty("_instances", ["Mixable", "AttrOwner1", "AttrOwner2"]);
});


test("Can call mixed methods receiving correct property values", () => {
    let jumpable = Mixable.merge(new AttrOwner1(), new Jumpable());
    const result = ((jumpable as unknown) as Jumpable);
    result.jump();
    expect(result).toHaveProperty("h", 11);
});

test("Chains of mixins work", () => {
    let player = Mixable.wrap(new AttrOwner1());
    let movable = player.mix(new Jumpable()).mix(new Movable());
    ((movable as unknown) as Jumpable).jump();
    ((movable as unknown) as Movable).move();
    expect(movable).toHaveProperty("h", 11);
    expect(movable).toHaveProperty("x", 6);
});




