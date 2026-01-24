import { useRef } from "react";
import { Pencil } from "lucide-react";
import UserAvatar from "@/components/Dashboard/Layout/Sidebar/UserAvatar";
import { Button } from '@/components/ui/button';

const UserProfilePictureChange = ({avatar, username, onChange}) => {
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
            <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                onClick={() => inputRef.current.click()}
            >
                <Pencil />
            </Button>
        </div>
    );
}

export default UserProfilePictureChange;