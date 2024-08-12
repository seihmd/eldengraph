export function flattenObject(obj: Record<string, any>, prefix = "") {
    const result: Record<string, any> = {};


    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            const newKey = prefix ? `${prefix}.${key}` : key;


            if (
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
            ) {
                Object.assign(result, flattenObject(value, newKey));

            } else {
                result[newKey] = value;

            }
        }
    }

    return result;
}

export function chunk<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}
