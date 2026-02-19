
import { EditInput } from "@/components/Common";
import { UserProfilePictureChanger } from "../View";
import { use } from "react";

const UserHeaderEdit = ({ onChange, data, touched, submitted,  usernameError }) => {
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
                    error={(submitted || touched?.username) && usernameError}
                    errorMessage={usernameError?.username}
                    onBlur={() => onBlur("username")}
                />
            </div>
            
        </>
    );
}

export default UserHeaderEdit;