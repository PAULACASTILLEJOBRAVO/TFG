
import EditInput from "@/components/Common/EditInput";
import UserProfilePictureChange from "../View/UserProfilePictureChange";

const UserHeaderEdit = ({onChange, data}) => {
    return(
        <>
            <UserProfilePictureChange
                username={data.username}
                avatar={data.profilePicture}
                onChange={onChange}
            />
                    
            <div>
                <EditInput
                    value={data.username} 
                    onChange={e => onChange("username", e.target.value)}
                />
            </div>
            
        </>
    );
}

export default UserHeaderEdit;