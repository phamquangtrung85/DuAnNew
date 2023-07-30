import React from 'react'
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";


const getConversationById = async(conversionId:string) => {
    try {
        const currentUser = await getCurrentUser()
        if(!currentUser?.email){
            return null;
        }

        const conversion = await prisma.conversation.findUnique({
            where: {
                id: conversionId
            },
            include: {
                users: true
            },
        })
        console.info('conversion',conversion)
        return conversion
    } catch (error) {
        return null
    }
}

export default getConversationById