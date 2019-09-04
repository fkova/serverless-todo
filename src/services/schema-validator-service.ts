import { Ajv, ErrorObject, AdditionalPropertiesParams } from 'ajv';

export interface ISchemaValidatorService {
    validate(instance: Object, schema: object): string | undefined;
}

const errorsText = (error: ErrorObject): string => {
    let text = `data${error.dataPath} ${error.message}`;
    if (error.keyword === 'additionalProperties') {
        text = `${text} '${(error.params as AdditionalPropertiesParams).additionalProperty}'`;
    }
    return text;
};

export class SchemaValidatorService implements ISchemaValidatorService {
    constructor(private validator: Ajv) { }

    validate(instance: Object, schema: object): string | undefined {
        const isValid = this.validator.validate(schema, instance);
        if (!isValid && this.validator.errors) {
            return `The body has ${this.validator.errors.length} validation error(s): ${this.validator.errors.map(e => errorsText(e)).join(', ')}.`;
        }
    }
}
