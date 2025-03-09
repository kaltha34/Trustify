import { create } from '@web3-storage/w3up-client'
import { CarReader } from '@ipld/car'
import * as DID from '@ipld/dag-ucan/did'
import fs from 'fs'
import path from 'path'

async function setup() {
    try {
        // Create a new client
        console.log('🔹 Creating Web3.Storage client...')
        const client = await create()
        
        // Get the current agent DID
        const agent = client.agent()
        const did = agent.did()
        console.log('📝 Agent DID:', did)
        
        // Get the space DID
        const spaceDid = 'did:key:z6Mkhi9HRVD3LGqEG2KuNFgZzC8BVyvcejP4XyHac29dzhA9'
        console.log('📝 Space DID:', spaceDid)

        try {
            // Try to get the space
            console.log('🔹 Authorizing space...')
            await client.setCurrentSpace(spaceDid)
            
            // Create a new delegation
            console.log('🔹 Creating delegation...')
            const proof = await client.createDelegation(spaceDid, {
                access: {
                    store: {
                        '*': true
                    }
                }
            })

            // Save the delegation to a file
            const proofFile = path.join(process.cwd(), 'delegation.txt')
            fs.writeFileSync(proofFile, JSON.stringify(proof))
            
            console.log('✅ Setup complete!')
            console.log('📝 Delegation saved to:', proofFile)
            console.log('\n💡 Next steps:')
            console.log('1. Try uploading a file:')
            console.log('   node scripts/uploadFile.js test.txt')
            
        } catch (error) {
            console.error('❌ Space error:', error.message)
            console.error('\n💡 Try these steps:')
            console.error('1. Run: w3 login kalhara.s.thabrew@gmail.com')
            console.error('2. Run: w3 space create trustify')
            console.error('3. Update the spaceDid in this script with the new DID')
            console.error('4. Run this script again')
            process.exit(1)
        }
    } catch (error) {
        console.error('❌ Setup error:', error.message)
        process.exit(1)
    }
}

setup().catch(error => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
});
