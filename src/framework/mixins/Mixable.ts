/**
 * @interface IMixable
 * Interface for objects can be mixed
 * All features are already implemented in Mixable class
 * @see Mixable
 */
export interface IMixable {
    /**
     * Collection of Names (strings) of all mixins in this object.
     * @type {Array<string>}
     */
    _instances: Array<string>;

    /**
     * Checks if that object has mixin of given type (or name).
     * @param type {string | any} Mixin or it's class name
     * @return {boolean}
     */
    isInstance(type: string | any): boolean;

    /**
     * Adds mixin to the collection _instances
     * @param {Object} source
     */
    addInstance(source: Object | string): void;

    /**
     * Adds source object mixin into this (destination) object
     * @param {Object} source - source object
     * @return {IMixable} - this object, destination
     */
    mix(source: Object): IMixable;
}

/**
 * @class Mixable
 * @mixin
 * Base mixin that allows to mix another objects.
 * Allows adding mixin object into this. Stores information about added mixins
 */
export class Mixable implements IMixable {
    /**
     * Collection of Names (strings) of all mixins in this object.
     * @type {Array<string>}
     */
    _instances: Array<string> = ["Mixable"];


    /**
     * Checks if that object has mixin of given type (or name).
     * @param type {string | any} Mixin or it's class name
     * @return {boolean}
     */
    isInstance(type: string | any): boolean {
        const class_name: string = (typeof type == "string") ? type : (<any>type.prototype).constructor.name;
        return (this._instances.indexOf(class_name) !== -1) || (<any>this).constructor.name === class_name;
    }


    /**
     * Добавляет имя класса объекта в коллекцию примесей
     * @param {Object} source
     */
    addInstance(source: Object | string): void {
        const source_name: string = (typeof source == "string") ? source : (<any>source).constructor.name;
        if (this._instances.indexOf(source_name) === -1) {
            this._instances.push(source_name);
        }
    }


    /**
     * Adds attributes to destination. Ignores attribute already present in this object (does not rewrite existing attributes).
     * @param {Object} dest - destination object
     * @param {Object} source - source object
     * @return {any} - The same type of destination object
     */
    static copy_attributes(dest: Object, source: Object): any {
        for (let key in source) {
            if (key in dest) {
                continue;
            }
            dest[key] = source[key];
        }
        return dest;
    }

    /**
     * Check that  object is Mixable
     * @param {Object} obj - object to check
     * @return {boolean}
     */
    static isMixable(obj: Object): boolean {
        return (("_instances" in obj) && ((obj as Mixable).isInstance(Mixable)));
    }

    /**
     * Adds all attributes from source object to destination object, casts destination object to IMixable / Mixable
     * @param {Object} dest - destination object
     * @param {Object} source - source object
     * @return {IMixable} - the same destination object but with Mixable functional
     */
    static merge(dest: Object, source: Object): IMixable {
        // if destination object is not Mixable, we can wrap it to Mixable
        let casted_dest: IMixable = ((Mixable.isMixable(dest) ? dest : Mixable.wrap(dest)) as IMixable);

        // we should copy all the collected instances from source._instances to destination._instances
        if (Mixable.isMixable(source)) {
            (source as Mixable)._instances.forEach((instance_name, _) => {
                casted_dest.addInstance(instance_name);
            });
        }
        // collects source type in _instances
        casted_dest.addInstance(source);
        // ... and copy all the rest of attributes
        return Mixable.copy_attributes(casted_dest, source);
    }


    /**
     * Wraps object into IMixable with Mixable functional, if not already wrapped
     * @param {Object} obj - object to wrap into IMixable
     * @return {IMixable} - the same object, but with Mixable functional
     */
    static wrap(obj: Object): IMixable {
        if (Mixable.isMixable(obj)) {
            return (obj as IMixable);
        }
        const m: Mixable = new Mixable();
        let casted_obj: IMixable = (Mixable.copy_attributes(obj, m) as IMixable);
        casted_obj.addInstance(m);
        casted_obj.addInstance(obj);
        return casted_obj;
    }

    /**
     * Adds source object mixin into this (destination) object
     * @param {Object} source - source object
     * @return {IMixable} - this object, destination
     */
    mix(source: Object): IMixable {
        return (Mixable.merge(this, source) as IMixable);
    }
} // class Mixable



