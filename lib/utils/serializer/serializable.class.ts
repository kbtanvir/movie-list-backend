import { Type } from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose';
import { plainToInstance } from 'class-transformer';

type AnyClass<T = any> = Type<T>;

export abstract class SerializableService<EntityModel> {
	protected constructor(private entityModel: Type<EntityModel>) {}

	protected toJSON<Document>(doc: any, entity: AnyClass<Document>, excludeExtraneousValues?: boolean): Document;
	protected toJSON(doc: DocumentType<EntityModel>): EntityModel;
	protected toJSON(doc: DocumentType<EntityModel>, dtoEntity?: AnyClass, excludeExtraneousValues = true) {
		return plainToInstance(dtoEntity ? dtoEntity : this.entityModel, doc, {
			exposeUnsetFields: true,
			exposeDefaultValues: true,
			enableCircularCheck: true,
			excludeExtraneousValues,
		});
	}
}
