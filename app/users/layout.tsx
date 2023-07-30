import UserList from "./Components/UserList";
import Sidebar from "../(site)/components/Sidebar/Sidebar";
import getUser from "../actions/getUsers";

export default async function UsersLayout({children}:{children:React.ReactNode}){
    const users = await getUser()
    return(
        <Sidebar>
            <div className="h-full">
                <UserList items={users}/>
                {children}
            </div>
        </Sidebar>
    )   
}