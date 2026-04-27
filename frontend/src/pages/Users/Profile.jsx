import { 
    DashboardContent, 
    DashboardLayout 
} from "@/components/Dashboard/Layout";
import { DashboardSubtitle } from "@/components/Dashboard/Layout/Content";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/Users/useUser";
import { Spinner } from "@/components/ui/spinner";
import { UserFormView, UserHeaderView } from "@/components/Users/Forms/View";
import { UserAvatar } from "@/components/Dashboard/Layout/Sidebar";

const Profile = () => {
    const { t } = useTranslation();

    const { user, loading } = useUser(); 

    return(
        <DashboardLayout>
            <DashboardContent>

                <div className="flex items-center mb-4 justify-between">
                    <DashboardSubtitle label={t("common.userProfile.title")} />
                </div>

                <Separator  />

                {loading ? (
                    <div className="w-full h-64 flex items-center justify-center">
                        <Spinner />
                    </div>
                ) : user ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center space-x-4">
                            <UserAvatar name={user.username} avatar={user.profilePicture} size="xl" />
                        </div>

                        <UserFormView user={user} />
                    </div>
                ) : (
                    <p>{t("common.userProfile.noData")}</p>
                )}

            </DashboardContent>
        </DashboardLayout>
    )
}

export default Profile;