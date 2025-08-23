import * as XLSX from 'xlsx';
import { CreateProductDto } from './create-product.dto';

export interface ExcelRow {
  sku: string | number;
  name?: string; // для translation
  description?: string;
  variantDescription?: string;
  // для translation
  price?: number | string;
  priceSale?: number | string;
  categoryId?: number | string;
  collectionId?: number | string;
  features?: string; // comma-separated features
  stock?: string;

  // Варіанти
  variantColor?: string;
  variantSizes?: string;
  variantImages?: string;
}

// Прочитати файл Excel
const workbook = XLSX.readFile('products.xlsx'); // тут вкажи свій шлях до файлу
const sheet = workbook.Sheets[workbook.SheetNames[0]]; // перший лист

// Тепер перетворюємо лист на масив рядків
export const rows: CreateProductDto[] =
  XLSX.utils.sheet_to_json<CreateProductDto>(sheet);
