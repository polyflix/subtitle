export const exposureMetadataKey = Symbol("expose");

export function Expose(): PropertyDecorator {
  return function (object: any, property?: string | symbol): void {
    const fields = Reflect.getOwnMetadata(exposureMetadataKey, object) || [];
    if (!fields.includes(property)) {
      fields.push(property);
    }
    Reflect.defineMetadata(exposureMetadataKey, fields, object);
  };
}
