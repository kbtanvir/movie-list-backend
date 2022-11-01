import { Types } from 'mongoose';

export const ToObjectId = (id?: string | undefined) => {
	return new Types.ObjectId(id);
};
