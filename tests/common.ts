export class AttrOwner1 {
    name: string = "AttrOwner1";
    sex: string = "male";
}

export class AttrOwner2 {
    name: string = "AttrOwner2";
    age: number = 20;
}

export class Movable {
    x: number = 5;
    move(): void {
        this.x += 1;
    }
}

export class Jumpable {
    h: number = 10;
    jump(): void {
        this.h += 1;
    }
}