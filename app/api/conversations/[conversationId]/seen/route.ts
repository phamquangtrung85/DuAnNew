import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"

interface IParams {
    conversationId?: string
};

export const POST = async( request: Request, { params }:{params: IParams} ) => {
    try {
        const currentUser = await getCurrentUser()
        const { conversationId } = params;

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const conversation = await prisma?.conversation.findUnique({
            where: { 
                id: conversationId
            },
            include: {
                message: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }

        })
        if(!conversation){
            return new NextResponse('Invalid ID', { status: 400 })
        }

        const lastMessage = conversation.message[conversation.message.length - 1];
        if(!lastMessage){
            return NextResponse.json(conversation);
        }

        const updateMessage = await prisma?.message.update({
            where:{
                id:lastMessage.id
            },
            include: {
                sender: true,
                seen: true
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        })

        return NextResponse.json(updateMessage)
    } catch (error:any) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}