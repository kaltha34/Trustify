'use strict';
const { Contract } = require('fabric-contract-api');

class UploadContract extends Contract {
    async CreateRecord(ctx, userId, documentHash) {
        const record = { userId, documentHash, status: "Pending", timestamp: Date.now() };
        await ctx.stub.putState(documentHash, Buffer.from(JSON.stringify(record)));
        return JSON.stringify(record);
    }

    async GetRecords(ctx, userId) {
        let results = [];
        let iterator = await ctx.stub.getStateByRange('', '');
        for await (const res of iterator) {
            let record = JSON.parse(res.value.toString());
            if (record.userId === userId) results.push(record);
        }
        return JSON.stringify(results);
    }
}

module.exports = UploadContract;
