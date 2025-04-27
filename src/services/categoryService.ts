
import { supabase } from "@/integrations/supabase/client";
import { CategoryType } from "@/types/finance";
import { mapCategoryToSupabase, mapSupabaseCategoryToCategory } from "@/utils/supabaseMappers";
import { toast } from "@/components/ui/use-toast";

export const categoryService = {
  async add(
    category: Omit<CategoryType, "id">,
    userId: string,
    setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>
  ) {
    try {
      const supabaseCategory = mapCategoryToSupabase(category, userId);
      
      const { data, error } = await supabase
        .from('categories')
        .insert(supabaseCategory)
        .select()
        .single();

      if (error) throw error;

      const newCategory = mapSupabaseCategoryToCategory(data);
      setCategories(prev => [...prev, newCategory]);
      
      toast({
        title: "Category added",
        description: "Your category has been successfully added.",
      });
    } catch (error: any) {
      console.error('Error adding category:', error.message);
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  },

  async update(
    id: string,
    category: Partial<CategoryType>,
    setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>
  ) {
    try {
      const updates: Record<string, any> = {};
      
      if (category.name !== undefined) updates.name = category.name;
      if (category.color !== undefined) updates.color = category.color;
      if (category.type !== undefined) {
        updates.type = category.type === "both" ? null : category.type;
      }

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedCategory = mapSupabaseCategoryToCategory(data);
      setCategories(prev => 
        prev.map(c => c.id === id ? updatedCategory : c)
      );

      toast({
        title: "Category updated",
        description: "Your category has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating category:', error.message);
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  },

  async delete(
    id: string,
    setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>
  ) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "Category deleted",
        description: "Your category has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting category:', error.message);
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }
};
