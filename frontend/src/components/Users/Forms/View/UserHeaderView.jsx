
import { SheetTitle } from "@/components/ui/sheet";
import { UserAvatar } from "@/components/Dashboard/Layout/Sidebar";

const UserHeaderView = ({user}) => {
    return(
        <>
            <UserAvatar
                name={user.username}
                avatar={user.profilePicture}
                size="xl"
            />
                    
            <SheetTitle className="text-center capitalize">{user.username}</SheetTitle>

            {user.isOnline && (
                <span className="px-2 py-1 text-xs rounded-3xl bg-green-100 text-green-700">
                    ● En línea
                </span>
            )}
        </>
    );
}

export default UserHeaderView;