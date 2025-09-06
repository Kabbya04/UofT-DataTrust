"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { X } from "lucide-react";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  onSave: (newName: string) => void;
}

export function EditCategoryModal({ isOpen, onClose, categoryName, onSave }: EditCategoryModalProps) {
  const [editedName, setEditedName] = useState(categoryName);

  const handleSave = () => {
    if (editedName.trim()) {
      onSave(editedName.trim());
      onClose();
    }
  };

  const handleCancel = () => {
    setEditedName(categoryName); // Reset to original name
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 [&>button]:hidden">
        {/* Custom header with single close button */}
        <div className="flex flex-row items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold">Edit Category/Topic</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-muted rounded-sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {/* Input field */}
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Enter category name"
              className="w-full"
              autoFocus
            />

            {/* Action buttons */}
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="px-6 bg-black hover:bg-black/90 text-white"
                disabled={!editedName.trim()}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}