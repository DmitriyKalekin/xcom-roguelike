var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Animal = /** @class */ (function () {
    function Animal() {
    }
    return Animal;
}());
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Cat;
}(Animal));
var a = new Animal();
var b = new Cat();
console.log(a instanceof Animal);
console.log(b instanceof Animal);
console.log(a instanceof Cat);
console.log(b instanceof Cat);
// class CustomError {
//     originalError: Error;
//
//     constructor(originalError?: Error) {
//         if (originalError) {
//             this.originalError = originalError
//         }
//     }
// }
//
// class SpecificError extends CustomError {}
//
// const error = new SpecificError(new Error('test'));
//
// console.log(error instanceof CustomError); // true
// console.log(error instanceof SpecificError); // true
