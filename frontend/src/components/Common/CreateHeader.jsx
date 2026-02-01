import BackButton from "./ActionButtons/BackButton";
import DashboardSubtitle from "../Dashboard/Layout/Content/DashboardSubtitle";

const CreateHeader = ({ title, label, onBack }) => {
    return (
        <div className="grid grid-cols-3 items-center pb-2">
            {/** Left */}
            <div className="pr-6 md:pr-16">
                <BackButton href={onBack} label={label} />
            </div>             

            {/** Center */}
            <div className="text-center">
                <DashboardSubtitle label={title} />
            </div>

            {/** Right (empty) */}
        </div>
    );
}

export default CreateHeader;