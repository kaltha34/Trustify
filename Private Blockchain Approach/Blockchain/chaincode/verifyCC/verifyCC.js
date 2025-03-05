'use strict';
const { Contract } = require('fabric-contract-api');

class VerifyContract extends Contract {
    async VerifyRecord(ctx, documentHash, status) {
        const recordBytes = await ctx.stub.getState(documentHash);
        if (!recordBytes || recordBytes.length === 0) {
            throw new Error(`Record not found: ${documentHash}`);
        }
        let record = JSON.parse(recordBytes.toString());
        record.status = status;
        await ctx.stub.putState(documentHash, Buffer.from(JSON.stringify(record)));
        return JSON.stringify(record);
    }
}

module.exports = VerifyContract;
