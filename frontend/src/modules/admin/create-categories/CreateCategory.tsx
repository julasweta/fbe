import React, { useEffect, useState } from "react";
import { useCategoryStore } from "../../../store/useCategoryStore";
import type { ICategory, ICreateCategory } from "../../../interfaces/ICategory";
import { CategoryService } from "../../../services/CategoryService";
import Input from "../../../components/ui/Inputs/Input";
import { Trash2, Edit3, Save, X, Plus, FolderPlus, Folder, ChevronRight, ChevronDown } from "lucide-react";
import styles from "./CreateCategory.module.scss";

const CreateCategory: React.FC = () => {
  const { categories, loading, error, fetchCategories, addCategory, removeCategory, updateCategory } = useCategoryStore();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<ICategory>>({});
  const [newCategory, setNewCategory] = useState<ICreateCategory>({
    name: "",
    slug: "",
    parentId: null,
    imageUrl: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Авто-розгортання всіх категорій після завантаження
  useEffect(() => {
    if (categories.length > 0) {
      const allCategoryIds = categories.map(cat => cat.id);
      setExpandedCategories(new Set(allCategoryIds));
    }
  }, [categories]);

  const handleCreate = async () => {
    if (!newCategory.name?.trim()) {
      alert("Введіть назву категорії");
      return;
    }

    try {
      const categoryData = {
        ...newCategory,
        slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      };

      await addCategory(categoryData);

      setNewCategory({ name: "", slug: "", parentId: null, imageUrl: "" });
      setShowForm(false);
      alert("Категорія створена");
    } catch (err: any) {
      alert(err.message || "Помилка при створенні категорії");
    }
  };

  const handleRemove = async (id: number) => {
    const hasChildren = categories.some(cat => cat.parentId === id);
    const confirmMessage = hasChildren
      ? "Ця категорія має підкатегорії. Видалити разом з усіма підкатегоріями?"
      : "Ви дійсно хочете видалити категорію?";

    if (!confirm(confirmMessage)) return;

    try {
      await CategoryService.remove(id);
      removeCategory(id);

      setExpandedCategories(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err: any) {
      alert(err.message || "Помилка при видаленні категорії");
    }
  };

  const handleStartEdit = (category: ICategory) => {
    setEditingId(category.id);
    setEditData({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
      imageUrl: category.imageUrl || ""
    });
  };

  const handleSaveEdit = async () => {
    if (!editData.name?.trim()) return;

    try {
      if (editingId) {
        // Оновлення існуючої категорії
        const updated = await CategoryService.update(editingId, {
          name: editData.name,
          parentId: editData.parentId,
          slug: editData.slug,
          imageUrl: editData.imageUrl
        });

        // Оновлюємо категорію в стейті
        if (editData.id)
        updateCategory(editData.id, updated); // припускаючи, що у вас є така функція
        // або
        // removeCategory(editingId);
        // addCategory(updated);

      } else {
        // Створення нової категорії
        const newCategory = {
          name: editData.name,
          parentId: editData.parentId || null,
          slug: editData.slug || editData.name.toLowerCase().replace(/\s+/g, '-'),
          imageUrl: editData.imageUrl || ''}

        addCategory(newCategory);
      }

      setEditingId(null);
      setEditData({});

    } catch (err: any) {
      alert(err.message || "Помилка при збереженні категорії");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const toggleExpanded = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) newSet.delete(categoryId);
      else newSet.add(categoryId);
      return newSet;
    });
  };

  const hasChildren = (categoryId: number): boolean => {
    return categories.some(cat => cat.parentId === categoryId);
  };

  const getParentCategoryName = (parentId: number | null): string => {
    if (!parentId) return "Коренева категорія";
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : "Невідома категорія";
  };

  const renderCategories = (parentId: number | null = null, level: number = 0) => {
    const filteredCategories = categories.filter(cat => cat.parentId === parentId);
    if (!filteredCategories.length) return null;

    return filteredCategories.map(cat => {
      const isExpanded = expandedCategories.has(cat.id);
      const categoryHasChildren = hasChildren(cat.id);

      return (
        <div key={cat.id} className={styles.categoryItem} style={{ marginLeft: `${level * 20}px` }}>
          {editingId === cat.id ? (
            <div className={styles.editForm}>
              <div className={styles.editHeader}>
                <span className={styles.editingLabel}>Редагування категорії:</span>
              </div>
              <div className={styles.editInputs}>
                <div className={styles.inputWrapper}>
                  <label>Назва категорії</label>
                  <Input
                    value={editData.name || ""}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
                <div className={styles.inputWrapper}>
                  <label>Slug</label>
                  <Input
                    value={editData.slug || ""}
                    onChange={e => setEditData({ ...editData, slug: e.target.value })}
                    required
                    placeholder="Введіть slug"
                  />
                </div>
                <div className={styles.inputWrapper}>
                  <label>URL зображення</label>
                  <Input
                    value={editData.imageUrl || ""}
                    onChange={e => setEditData({ ...editData, imageUrl: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.editActions}>
                <button onClick={handleSaveEdit} className={styles.btn}>
                  <Save size={16} /> Зберегти
                </button>
                <button onClick={handleCancelEdit} className={styles.btn}>
                  <X size={16} /> Скасувати
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.categoryDisplay}>
                <div className={styles.categoryLeft}>
                  <div className={styles.expandButton}>
                    {categoryHasChildren ? (
                      <button onClick={() => toggleExpanded(cat.id)} className={styles.toggleBtn}>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    ) : (
                      <div className={styles.spacer}></div>
                    )}
                  </div>
                  <div className={styles.categoryInfo}>
                    <Folder size={16} className={styles.categoryIcon} />
                    <div className={styles.categoryText}>
                      <span className={styles.categoryName}>{cat.name}</span>
                      {cat.slug && <span className={styles.categorySlug}>/{cat.slug}</span>}
                      {cat.imageUrl && <span className={styles.categoryImage}>Image: {cat.imageUrl}</span>}
                      {cat.parentId && (
                        <span className={styles.parentInfo}>в категорії: {getParentCategoryName(cat.parentId)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.categoryActions}>
                  <button onClick={() => handleStartEdit(cat)} className={styles.btn}><Edit3 size={16} /></button>
                  <button onClick={() => handleRemove(cat.id)} className={styles.btn}><Trash2 size={16} /></button>
                </div>
              </div>

              {categoryHasChildren && isExpanded && (
                <div className={styles.children}>
                  {renderCategories(cat.id, level + 1)}
                </div>
              )}
            </>
          )}
        </div>
      );
    });
  };

  if (loading) return <div>Завантаження категорій...</div>;
  if (error) return <div>Помилка: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Управління категоріями</h2>
        <button onClick={() => setShowForm(!showForm)} className={styles.btn}>
          <Plus size={16} /> Додати категорію
        </button>
      </div>

      {showForm && (
        <div className={styles.createForm}>
          <h3>Створити нову категорію</h3>
          <div className={styles.formInputs}>
            <div className={styles.inputGroup}>
              <label>Назва категорії *</label>
              <Input
                value={newCategory.name || ""}
                onChange={e => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Slug</label>
              <Input
                value={newCategory.slug || ""}
                onChange={e => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>URL зображення</label>
              <Input
                value={newCategory.imageUrl || ""}
                onChange={e => setNewCategory(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Батьківська категорія</label>
              <select
                value={newCategory.parentId || ""}
                onChange={e => setNewCategory(prev => ({ ...prev, parentId: e.target.value ? Number(e.target.value) : null }))}
              >
                <option value="">Коренева категорія</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parentId ? `${getParentCategoryName(cat.parentId)} → ` : ""}{cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={handleCreate} className={styles.btn}><FolderPlus size={16} /> Створити</button>
            <button onClick={() => setShowForm(false)} className={styles.btn}>Скасувати</button>
          </div>
        </div>
      )}

      <div className={styles.categoriesSection}>
        <h3>Список категорій</h3>
        {categories.length === 0 ? <p>Категорії відсутні</p> : renderCategories()}
      </div>
    </div>
  );
};

export default CreateCategory;
