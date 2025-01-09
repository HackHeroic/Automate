const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const connectDb = async() => {
    try{
        await prisma.$connect();
        console.log(`Successfully Connected to MySQL Database`);
    }catch(e){
        console.log(`Error Connecting to MySQL Database : `,e);
    }
}

module.exports={prisma,connectDb};