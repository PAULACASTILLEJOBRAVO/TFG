import { Separator } from "@/components/ui/separator";
import { EditInput } from "@/components/Common";
import { UserRoleSelector } from ".";
import { useTranslation } from "react-i18next";

const UserFormEdit = ({data, onChange, emailError, touched, submitted, onBlur}) => {
    const { t } = useTranslation();

    return(
        <div className="space-y-3 text-center sm:text-left">
            <Separator/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">   
                <EditInput 
                    label={t("admin.usersManagement.drawer.edit.fullName")} 
                    value={data.fullname} 
                    onChange={e => onChange("fullname", e.target.value)}
                />                
                <EditInput 
                    label={t("admin.usersManagement.drawer.edit.email")} 
                    value={data.email} 
                    onChange={e => onChange("email", e.target.value)}
                    error={(submitted || touched?.email) && emailError?.email}
                    errorMessage={emailError?.email}
                    isRequired={true}
                    onBlur={() => onBlur("email")}
                />

                <UserRoleSelector
                    value={data.role}
                    onChange={value => onChange("role", value)}
                />
            </div>
        </div>
    );
}

export default UserFormEdit;