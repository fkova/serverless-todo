import { SchemaValidatorService } from '../../src/services/schema-validator-service';
import ajv, { Ajv, ErrorObject } from 'ajv';

describe('Schema validator service', () => {
    let validator: Ajv;
    let validateSpy: jest.SpyInstance;
    let service: SchemaValidatorService;

    beforeEach(() => {
        validator = new ajv();
        validateSpy = jest.spyOn(validator, 'validate');

        service = new SchemaValidatorService(validator);
    });

    it('should return undefined if there is no error', () => {
        validateSpy.mockReturnValue(true);

        const result = service.validate({}, {});
        expect(result).toBeUndefined();
    });

    it('should throw error if validation fails', () => {
        validateSpy.mockImplementation(() => {
            validator.errors = [{
                dataPath: '.path',
                message: 'has error'
            } as ErrorObject];

            return false;
        });

        const result = service.validate({}, {});
        expect(result).toBe('The body has 1 validation error(s): data.path has error.');
    });
});