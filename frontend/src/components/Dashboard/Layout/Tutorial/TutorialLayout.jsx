import { DashboardSubtitle } from "../Content";

const TutorialLayout = ({ title, pdf, video }) => {
    return (
        <div>
            <DashboardSubtitle label={title} />

            {video && (
                <iframe
                    width="100%"
                    height="400"
                    src={video}
                />
            )}

            {pdf && (
                <iframe
                    src={pdf}
                    width="100%"
                    height="600"
                />
            )}
        </div>
    );
};

export default TutorialLayout;