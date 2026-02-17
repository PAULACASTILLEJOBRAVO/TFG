
import { EditInput } from "@/components/Common";
import { UserProfilePictureChanger } from "../View";

const UserHeaderEdit = ({onChange, data}) => {
    return(
        <>
            <UserProfilePictureChanger
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