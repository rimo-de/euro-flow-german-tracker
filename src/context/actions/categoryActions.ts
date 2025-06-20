
import { supabase } from "@/integrations/supabase/client";
import { CategoryType } from "@/types/finance";
import { mapSupabaseCategoryToCategory, mapCategoryToSupabase } from "@/utils/supabaseMappers";

type ToastFunction = (args: { title: string; description?: string; variant?: "default" | "destructive" }) => void;

// Helper function to check transaction count for a category
export const getTransactionCountForCategory = async (categoryId: string): Promise<number> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("id", { count: "exact" })
    .eq("category_id", categoryId);

  if (error) {
    console.error("Error counting transactions:", error);
    return 0;
  }

  return data?.length || 0;
};

export const loadCategories = async (
  userId: string,
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>,
  toast: ToastFunction
) => {
  try {
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (categoriesError) throw categoriesError;

    const mappedCategories = categoriesData.map((cat) => ({
      ...mapSupabaseCategoryToCategory(cat),
      vatApplicable: cat.vat_applicable,
    }));
    
    setCategories(mappedCategories);
  } catch (error: any) {
    console.error("Error loading categories:", error.message);
    toast({
      title: "Error loading data",
      description: "There was a problem loading your categories.",
      variant: "destructive",
    });
    setCategories([]);
  }
};

export const addCategory = async (
  category: Omit<CategoryType, "id"> & { vatApplicable?: boolean },
  userId: string,
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>,
  toast: ToastFunction
) => {
  try {
    const categoryToInsert = { ...category };
    const supabaseCategory = mapCategoryToSupabase(categoryToInsert, userId);
    (supabaseCategory as any).vat_applicable = category.vatApplicable ?? true;

    const { data, error } = await supabase
      .from("categories")
      .insert(supabaseCategory)
      .select()
      .single();

    if (error) throw error;

    const newCategoryData = data;
    const newCategory = {
      ...mapSupabaseCategoryToCategory(newCategoryData),
      vatApplicable: newCategoryData.vat_applicable,
    };
    
    setCategories((prev) => [...prev, newCategory]);

    toast({
      title: "Category added",
      description: "Your category has been successfully added.",
    });
  } catch (error: any) {
    console.error("Error adding category:", error.message);
    toast({
      title: "Error adding category",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  category: Partial<CategoryType> & { vatApplicable?: boolean },
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>,
  toast: ToastFunction
) => {
  try {
    const updates: Record<string, any> = {};
    
    if (category.name !== undefined) updates.name = category.name;
    if (category.color !== undefined) updates.color = category.color;
    if (category.type !== undefined) {
      updates.type = category.type === "both" ? null : category.type;
    }
    if (category.vatApplicable !== undefined) {
      updates.vat_applicable = category.vatApplicable;
    }

    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const updatedCategoryData = data;
    const updatedCategory = {
      ...mapSupabaseCategoryToCategory(updatedCategoryData),
      vatApplicable: updatedCategoryData.vat_applicable,
    };
    
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? updatedCategory : c))
    );

    toast({
      title: "Category updated",
      description: "Your category has been successfully updated.",
    });
  } catch (error: any) {
    console.error("Error updating category:", error.message);
    toast({
      title: "Error updating category",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const deleteCategory = async (
  id: string,
  categoryName: string,
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>,
  toast: ToastFunction
) => {
  try {
    // First, check if this category has any associated transactions
    const transactionCount = await getTransactionCountForCategory(id);
    
    if (transactionCount > 0) {
      // Show meaningful error message if transactions exist
      toast({
        title: "Cannot delete category",
        description: `Cannot delete category '${categoryName}' because it has ${transactionCount} transaction${transactionCount > 1 ? 's' : ''} assigned to it. Please reassign or delete these transactions first.`,
        variant: "destructive",
      });
      return;
    }

    // Proceed with deletion if no transactions are associated
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      // Handle foreign key constraint violations specifically
      if (error.message.includes("violates foreign key constraint")) {
        toast({
          title: "Cannot delete category",
          description: `Cannot delete category '${categoryName}' because it is still being used by transactions. Please reassign or delete these transactions first.`,
          variant: "destructive",
        });
        return;
      }
      throw error;
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
    
    toast({
      title: "Category deleted",
      description: `Category '${categoryName}' has been successfully deleted.`,
    });
  } catch (error: any) {
    console.error("Error deleting category:", error.message);
    toast({
      title: "Error deleting category",
      description: "An unexpected error occurred while deleting the category. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};
