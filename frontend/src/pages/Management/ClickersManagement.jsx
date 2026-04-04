import { 
  DashboardLayout, 
  DashboardContent 
} from "@/components/Dashboard/Layout";
import { DashboardSubtitle } from "@/components/Dashboard/Layout/Content";
import { CreateButton } from "@/components/Common/ActionButtons";
import { useClickers } from "@/hooks/Clickers/useClickers";
import { useState } from "react";
import { ClickerTable } from "@/components/Clicker/Layout";
import { 
  DeleteClickerDialog, 
  CreateClickerDialog 
} from "@/components/Clicker/Dialogs";
import { useAuth } from "@/auth/AuthContext";
import { useClickerActions } from "@/hooks/Clickers/useClickerActions";
import { DecimalToHexadecimal } from "@/utils/clickers";
import { useTranslation } from "react-i18next";
import { validateClicker } from "@/utils/validators";
import { useLocation } from "react-router-dom";
import { 
  matchesStatus, 
  normalizeWord 
} from "@/utils/search";

const ClickersManagement = () => {
  const { t } = useTranslation();

  // DATA
  const { user } = useAuth();
  const { clickers, loading: loadingClickers, refetch } = useClickers();
  const { remove, restore, create, update } = useClickerActions();

  // Search
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search).get("search") || "";

    const words = searchParams.toLowerCase().split(" ").filter(word => word.trim() !== "");;
    const normalizedWords = words.map(normalizeWord);

    const filteredClickers = clickers.filter(c => {
        const deviceCode = c.deviceCode?.toLowerCase() || "";
        const assignedToUserId = c.assignedToUserId?.username?.toLowerCase() || "";

        return normalizedWords.every(word =>
            deviceCode.includes(word) ||
            assignedToUserId.includes(word) ||
            matchesStatus(c.status, word)
        );
    });

  // Create clicker state (for the form in the dialog)
  const [createClicker, setCreateClicker] = useState({ deviceCode: 1, adminId: user._id ? user._id : null, status: "available", assignedToUserId: null });
    
  const handleUpdateCreateClicker = async (field, value) => {
    // If not is status field, just update the field
    if(field !== "status") {
      if(field === "deviceCode") {
        // Convert decimal to hexadecimal before setting the state
        const hexValue = await DecimalToHexadecimal(value);
        setCreateClicker(prev => ({ ...prev, [field]: hexValue }));
        setTouched(prev => ({ ...prev, deviceCode: true }));
      } else {
        setCreateClicker(prev => ({ ...prev, [field]: value }));
      }
    } else {
      // If is status field and the new value is assigned, set assignedToUserId to null
      if(value === "assigned") {
        setCreateClicker(prev => ({ ...prev, status: value, assignedToUserId: null }));
      } else {
        setCreateClicker(prev => ({ ...prev, status: value }));
      }
    }
  }

  // Edit clicker state (for the form in the dialog)
  const [editClicker, setEditClicker] = useState(null);
  const [editClickerId, setEditClickerId] = useState(null);

  const handleUpdateEditClicker = (field, value) => {
    // If not is status field, just update the field
    if(field !== "status") {
      setEditClicker(prev => ({ ...prev, [field]: value }));
    } else {
      // If is status field and the new value is assigned, set assignedToUserId to null
      if(value === "assigned") {
        setEditClicker(prev => ({ ...prev, status: value, assignedToUserId: null }));
      } else {
        setEditClicker(prev => ({ ...prev, status: value }));
      }
    }
  }

  const handleStartEditClicker = (clicker) => {
    setEditClicker(clicker);
    setEditClickerId(clicker._id);
  }

  const handleCancelEditClicker = () => {
    setEditClicker(null);
    setEditClickerId(null);
  }

  const handleSaveEditClicker = async () => {
    try {
      await update(editClickerId, editClicker);
      setEditClicker(null);
      setEditClickerId(null);
      refetch();
    }catch(error){
      console.error("Error updating clicker:", error);
    }
  }

  // Selected clicker for delete action
  const [selectedClicker, setSelectedClicker] = useState(null);

  // DIALOGS
  const [dialogs, setDialogs] = useState({
    delete: false,
    create: false
  });

  const openDeleteDialog = (clicker) => {
      setSelectedClicker(clicker);
      setDialogs(prev => ({...prev, delete: true}));
  }

  const openCreateDialog = () => {
      setDialogs(prev => ({...prev, create: true}));
  }

  const closeDialogs = () => {
    setDialogs({
      delete: false,
      create: false
    });
  }

  // DIALOGS ACTIONS
  const handleConfirmDelete = async (reason) => {
      try{
          await remove(selectedClicker._id, {reason: reason});
          closeDialogs();
          refetch();
      }catch(error){
         console.error("Error deleting clicker:", error);
      }
  }

  const handleRegisterClicker = async () => {
      setSubmitted(true);
      
      if (clickerError) return;

      try {

          await create(createClicker);
          closeDialogs();
          refetch();
      }catch(error){
          console.error("Error registering clicker:", error);
      }
  }

  const handleRestoreClicker = async (clicker) => {
      try {
          await restore(clicker._id);
          refetch();
      }catch(error){
          console.error("Error restoring clicker:", error);
      }
  }

  // Student Selection 
  const handleToggleStudentCreate = (student) => {
    if(createClicker.assignedToUserId === student._id) {
      setCreateClicker(prev => ({ ...prev, assignedToUserId: null, status: "available" }));
    } else {
      setCreateClicker(prev => ({ ...prev, assignedToUserId: student._id, status: "assigned" }));
    }
  }

  const handleToggleStudentEdit = (student) => {
    if(editClicker.assignedToUserId === student._id) {
      setEditClicker(prev => ({ ...prev, assignedToUserId: null, status: "available" }));
    } else {
      setEditClicker(prev => ({ ...prev, assignedToUserId: student._id, status: "assigned" }));
    }
  }

  // Errors
  const clickerError = validateClicker(createClicker.deviceCode);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({deviceCode: false});

  return (
    <DashboardLayout>
      <DashboardContent>
        <div className="flex items-center mb-4 justify-between">
            <DashboardSubtitle label={t("admin.clickersManagement.title")} />
            <div className="pr-6 md:pr-16">
                <CreateButton label={t("admin.clickersManagement.labelButton")} onClick={openCreateDialog}/>
            </div>
        </div>

        <ClickerTable
            clickers={filteredClickers}
            loading={loadingClickers}
            editClicker={editClicker}
            editClickerId={editClickerId}
            onDelete={openDeleteDialog}
            onRestore={handleRestoreClicker}
            onEdit={handleStartEditClicker}
            onSaveEdit={handleSaveEditClicker}
            onCancelEdit={handleCancelEditClicker}
            onEditChange={handleUpdateEditClicker}
            onToggleStudent={handleToggleStudentEdit}
        />

        {selectedClicker && <DeleteClickerDialog
            open={dialogs.delete}
            clicker={selectedClicker}
            onConfirm={handleConfirmDelete}
            onClose={closeDialogs}
        />}

        {dialogs.create && <CreateClickerDialog
          open={dialogs.create}
          clicker={createClicker}
          touched={touched}
          submitted={submitted}
          clickerError={clickerError}
          onClose={closeDialogs}
          onSave={handleRegisterClicker}
          onChange={handleUpdateCreateClicker}
          onToggleStudent={handleToggleStudentCreate}
        />}

      </DashboardContent>
    </DashboardLayout>
  );
};

export default ClickersManagement;