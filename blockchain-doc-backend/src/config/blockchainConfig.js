// Mock function to simulate storing a document hash on the blockchain
const mockStoreDocument = async (fileHash) => {
  console.log(`Mock storing document with hash: ${fileHash}`);
  // Simulate storing hash
  // Here you would save the hash to your database or blockchain in real scenario
  return Promise.resolve();
};

// Mock function to simulate verifying a document hash on the blockchain
const mockVerifyDocument = async (fileHash) => {
  console.log(`Mock verifying document with hash: ${fileHash}`);
  // Simulate checking if the document hash exists
  // Return a true/false value based on the hash (mocking blockchain data)
  const existingHashes = ["3a7bd3e2360a3b334b29ae484f7213"]; // Mock list of stored hashes
  return existingHashes.includes(fileHash); // Simulate found/not found
};

// Export mock functions
module.exports = {
  storeDocument: mockStoreDocument,
  verifyDocument: mockVerifyDocument,
};
