
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import CategoryList from "@/components/categories/CategoryList";
import CategoryForm from "@/components/categories/CategoryForm";
import { useFinance } from "@/context/FinanceContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryType } from "@/types/finance";
import { Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null);

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleAddCategory = (category: Omit<CategoryType, "id">) => {
    addCategory(category);
    setIsAddDialogOpen(false);
  };

  const handleOpenEditDialog = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setCurrentCategory(category);
      setIsEditDialogOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setCurrentCategory(null);
  };

  const handleUpdateCategory = (category: Omit<CategoryType, "id">) => {
    if (currentCategory) {
      updateCategory(currentCategory.id, category);
      setIsEditDialogOpen(false);
      setCurrentCategory(null);
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setCurrentCategory(category);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCurrentCategory(null);
  };

  const handleDeleteCategory = () => {
    if (currentCategory) {
      deleteCategory(currentCategory.id);
      setIsDeleteDialogOpen(false);
      setCurrentCategory(null);
    }
  };

  return (
    <PageLayout 
      title="Categories" 
      subtitle="Manage your transaction categories"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-gray-500">
            Total Categories: <strong>{categories.length}</strong>
          </p>
        </div>
        <Button onClick={handleOpenAddDialog} className="bg-finance-highlight hover:bg-finance-highlight/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <CategoryList
        categories={categories}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleAddCategory}
            onCancel={handleCloseAddDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {currentCategory && (
            <CategoryForm
              category={currentCategory}
              onSubmit={handleUpdateCategory}
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default Categories;
