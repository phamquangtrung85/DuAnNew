import React from 'react'

const getMessage = async(conversionId:string) => {
    try {
        const message = await prisma?.message.findMany({
            where: {
                conversationId:conversionId
            },
            include: {
                sender: true,
                seen: true,
            },
            orderBy: {
                createdAt:'asc'
            }
        })
        return message;
    } catch (error) {
        return []
    }
}

export default getMessage