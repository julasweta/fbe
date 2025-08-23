import React, { useEffect, useState } from "react";
import { useCollectionStore } from "../../../store/useCollectionStore";
import type { ICollection } from "../../../interfaces/IColection";
import { CollectionService } from "../../../services/CollectionService";
import Input from "../../../components/ui/Inputs/Input";
import { Trash2, Edit3, Save, X, Plus, FolderPlus, Folder } from "lucide-react";
import styles from "./CreateCategory.module.scss";

const CreateCollection: React.FC = () => {
  const { collections, loading, error, fetchCollections, addCollection, removeCollection } =
    useCollectionStore();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<ICollection>>({});
  const [newCollection, setNewCollection] = useState<Partial<ICollection>>({
    name: "",
    slug: "",
    imageUrl: ""
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleCreate = async () => {
    if (!newCollection.name?.trim()) {
      alert("Введіть назву колекції");
      return;
    }

    try {
      const collectionData = {
        ...newCollection,
        slug:
          newCollection.slug ||
          newCollection.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
      };

      const created = await CollectionService.create(collectionData);
      addCollection(created);

      setNewCollection({ name: "", slug: "", imageUrl: "" });
      setShowForm(false);
    } catch (err: any) {
      alert(err.message || "Помилка при створенні колекції");
    }
  };

  const handleRemove = async (id: number) => {
    if (!confirm("Ви дійсно хочете видалити колекцію?")) return;

    try {
      await CollectionService.remove(id);
      removeCollection(id);
    } catch (err: any) {
      alert(err.message || "Помилка при видаленні колекції");
    }
  };

  const handleStartEdit = (collection: ICollection) => {
    setEditingId(collection.id);
    setEditData({
      name: collection.name,
      slug: collection.slug,
      imageUrl: collection.imageUrl || ""
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editData.name?.trim()) return;

    try {
      const updated = await CollectionService.update(editingId, editData);
      removeCollection(editingId);
      addCollection(updated);

      setEditingId(null);
      setEditData({});
    } catch (err: any) {
      alert(err.message || "Помилка при оновленні колекції");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const renderCollections = () => {
    if (collections.length === 0) return null;

    return collections.map((collection) => (
      <div key={collection.id} className={styles.collectionItem}>
        {editingId === collection.id ? (
          <div className={styles.editForm}>
            <div className={styles.editHeader}>
              <span className={styles.editingLabel}>Редагування колекції:</span>
            </div>
            <div className={styles.editInputs}>
              <div className={styles.inputWrapper}>
                <label>Назва колекції</label>
                <Input
                  value={editData.name || ""}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Назва колекції"
                  className={styles.editInput}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label>Slug</label>
                <Input
                  value={editData.slug || ""}
                  onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                  placeholder="URL slug"
                  className={styles.editInput}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label>URL зображення</label>
                <Input
                  value={editData.imageUrl || ""}
                  onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
                  placeholder="URL зображення"
                  className={styles.editInput}
                />
              </div>
            </div>
            <div className={styles.editActions}>
              <button onClick={handleSaveEdit} className={`${styles.btn} ${styles.btnSave}`}>
                <Save size={16} /> Зберегти
              </button>
              <button onClick={handleCancelEdit} className={`${styles.btn} ${styles.btnCancel}`}>
                <X size={16} /> Скасувати
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.categoryDisplay}>
            <div className={styles.categoryLeft}>
              <div className={styles.categoryInfo}>
                <Folder size={16} className={styles.categoryIcon} />
                <div className={styles.categoryText}>
                  <span className={styles.categoryName}>{collection.name}</span>
                  {collection.slug && <span className={styles.categorySlug}>/{collection.slug}</span>}
                  {collection.imageUrl && <span className={styles.categoryImage}>Image: {collection.imageUrl}</span>}
                </div>
              </div>
            </div>
            <div className={styles.categoryActions}>
              <button
                onClick={() => handleStartEdit(collection)}
                className={`${styles.btn} ${styles.btnEdit}`}
                title="Редагувати"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => handleRemove(collection.id)}
                className={`${styles.btn} ${styles.btnDelete}`}
                title="Видалити"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    ));
  };

  if (loading) return <div className={styles.loading}>Завантаження колекцій...</div>;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Управління колекціями</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`${styles.btn} ${styles.btnPrimary}`}
        >
          <Plus size={16} /> Додати колекцію
        </button>
      </div>

      {showForm && (
        <div className={styles.createForm}>
          <h3>Створити нову колекцію</h3>
          <div className={styles.formInputs}>
            <div className={styles.inputGroup}>
              <label>Назва колекції *</label>
              <Input
                value={newCollection.name || ""}
                onChange={(e) => setNewCollection((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Введіть назву колекції"
                className={styles.formInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Slug (URL-адреса)</label>
              <Input
                value={newCollection.slug || ""}
                onChange={(e) => setNewCollection((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="auto-generated або введіть власний"
                className={styles.formInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>URL зображення</label>
              <Input
                value={newCollection.imageUrl || ""}
                onChange={(e) => setNewCollection((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="URL зображення"
                className={styles.formInput}
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={handleCreate} className={`${styles.btn} ${styles.btnSuccess}`}>
              <FolderPlus size={16} /> Створити
            </button>
            <button onClick={() => setShowForm(false)} className={`${styles.btn} ${styles.btnSecondary}`}>
              Скасувати
            </button>
          </div>
        </div>
      )}

      <div className={styles.collectionsSection}>
        <div className={styles.sectionHeader}>
          <h3>Список колекцій</h3>
          <div className={styles.collectionCount}>Всього: {collections.length} колекцій</div>
        </div>

        {collections.length === 0 ? (
          <div className={styles.emptyState}>
            <Folder size={48} className={styles.emptyIcon} />
            <p>Колекції відсутні</p>
            <p>Створіть першу колекцію для початку роботи</p>
          </div>
        ) : (
          <div className={styles.collectionsList}>{renderCollections()}</div>
        )}
      </div>
    </div>
  );
};

export default CreateCollection;
