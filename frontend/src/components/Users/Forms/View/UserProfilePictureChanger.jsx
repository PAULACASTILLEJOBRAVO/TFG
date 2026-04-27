import { useRef } from "react";
import { UserAvatar } from "@/components/Dashboard/Layout/Sidebar";
import { ChangePhotoButton } from "../../Buttons";

const UserProfilePictureChanger = ({avatar, username, onChange}) => {
    const inputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if(!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            onChange("profilePicture", reader.result);
        }

        reader.readAsDataURL(file);
    }

    return(
        <div className="relative">
            <UserAvatar
                name={username}
                avatar={avatar}
                size="xl"
            />

            {/** Hidden input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
            />

            {/** Button */}
            <ChangePhotoButton onClick={() => inputRef.current?.click()} />
        </div>
    );
}

export default UserProfilePictureChanger;