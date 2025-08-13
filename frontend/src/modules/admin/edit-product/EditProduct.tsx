import React from 'react';
import { useParams } from 'react-router-dom';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="edit-product">
      <h2>Edit Product {id}</h2>
      <p>Form for editing product {id} goes here.</p>
    </div>
  );
};

export default EditProduct;