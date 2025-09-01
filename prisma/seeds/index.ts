import prisma from "../../db/index";
import { addConstants } from "./static_constant";

async function main(){
    addConstants(prisma);
}
main().then(async()=>{
    await prisma.$disconnect();
})
.catch(async(e)=>{
    prisma.$disconnect();
    process.exit(1);
});