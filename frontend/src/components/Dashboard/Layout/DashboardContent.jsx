const DashboardContent = ({ children }) => {
  return (
    <div className="flex-1 p-6 overflow-auto">
      {children}
    </div>
  );
};

export default DashboardContent;