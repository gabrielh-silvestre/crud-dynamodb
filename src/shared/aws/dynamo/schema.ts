export const SchemaV1 = {
  format: 'onetable:1.1.0',
  version: '0.0.1',
  indexes: {
    primary: { hash: 'pk', sort: 'sk' },
  },

  models: {
    Product: {
      pk: { type: String, value: '${id}' },
      sk: { type: String, value: '${price}' },

      id: {
        type: String,
        generate: 'ulid',
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
      },
      name: { type: String, required: true },
      description: { type: String, nulls: true },
      price: { type: Number, required: true },
      image: { type: String, nulls: true },
      availableQuantity: { type: Number, required: true },
    },
  },

  params: {
    timestamps: true,
    isoDates: true,
    createdField: 'createdAt',
    updatedField: 'updatedAt',
  },
};

/*
IMPORTANT command to create table in local dynamodb:

aws dynamodb create-table \
   --table-name Product \
   --attribute-definitions AttributeName=pk,AttributeType=S AttributeName=sk,AttributeType=S \
   --key-schema AttributeName=pk,KeyType=HASH AttributeName=sk,KeyType=RANGE \
   --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
   --endpoint-url http://localhost:8000
*/
