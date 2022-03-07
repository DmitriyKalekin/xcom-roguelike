/**
 * @interface IMixable
 * Интерфейс для подмешивания миксинов объектам.
 * Весь фукнционал уже в Mixable
 * @see Mixable
 */
export interface IMixable {
    /**
     * Имена (строки) всех миксинов, с которыми смешивался объект.
     * @type {Array<string>}
     */
    _instances: Array<string>;

    /**
     * Определяет, есть ли уже примесь данного типа в объекте.
     * @param type {string | any} Примесь или её имя
     * @return {boolean}
     */
    isInstance(type: string | any): boolean;

    /**
     * Добавляет имя класса объекта в коллекцию примесей
     * @param {Object} source
     */
    addInstance(source: Object | string): void;

    /**
     * Примешивает источник в себя и себя же возвращает
     * @param {Object} source - источник
     * @return {IMixable} - this
     */
    mix(source: Object): IMixable;
}

/**
 * @class Mixable
 * @mixin
 * Базовый миксин, реализующий возможность подмешивания любых других миксинов.
 * Позволяет определить, чем объект является, хранит в себе названия всего, с чем смешивался.
 */
export class Mixable implements IMixable {
    /**
     * Имена (строки) всех миксинов, с которыми смешивался объект.
     * @type {Array<string>}
     */
    _instances: Array<string> = ["Mixable"];


    /**
     * Определяет, есть ли уже примесь данного типа в объекте.
     * @param type {string | any} Примесь или её имя
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
     * Добавляет атрибуты из источника в приёмник. Если в приёмнике уже есть атрибут - игнорируется (не перезаписывается).
     * @param {Object} dest - приёмник
     * @param {Object} source - источник
     * @return {any} - Тот же самый тип, что и был у приёмника
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
     * Проверяет, что объект соответствует интерфейсу IMixable
     * @param {Object} source - проверяемый объект
     * @return {boolean}
     */
    static isMixable(source: Object): boolean {
        return (("_instances" in source) && ((source as Mixable).isInstance(Mixable)));
    }

    /**
     * Берёт все атрибуты из источника, добавляет в приёмник, делая приёмник IMixable / Mixable
     * @param {Object} dest - приёмник
     * @param {Object} source - источник
     * @return {IMixable} - тот же приёмник, но с примесью IMixable / Mixable
     */
    static merge(dest: Object, source: Object): IMixable {
        // Делаем dest Mixable, если он не таковой
        let newdest: IMixable = ((Mixable.isMixable(dest) ? dest : Mixable.wrap(dest)) as IMixable);

        // а вот тут нужно аккуратно инстансы переложить - иначе потеряем из источника
        if (Mixable.isMixable(source)) {
            (source as Mixable)._instances.forEach((instance_name, index) => {
                newdest.addInstance(instance_name);
            });
        }
        // Помечаем, что миксин примешался нормально
        newdest.addInstance(source);
        // ... и добавляем все оставшиеся свойства
        return Mixable.copy_attributes(newdest, source);
    }


    /**
     * Оборачивает приёмник в IMixable / Mixable, если он уже не обёрнут
     * @param {Object} dest - приёмник
     * @return {IMixable} - тот же приёмник
     */
    static wrap(dest: Object): IMixable {
        if (Mixable.isMixable(dest)) {
            return (dest as IMixable);
        }
        const m: Mixable = new Mixable();
        let newdest: IMixable = (Mixable.copy_attributes(dest, m) as IMixable);
        newdest.addInstance(m);
        newdest.addInstance(dest);
        return newdest;
    }

    /**
     * Примешивает источник в себя
     * @param {Object} source - источник
     * @return {IMixable} - this
     */
    mix(source: Object): IMixable {
        return (Mixable.merge(this, source) as IMixable);
    }

} // class Mixable



