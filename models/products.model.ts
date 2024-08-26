export class ProductModel {
    id?: string;
  
    name?: string;
    description?: string;
    sku?: string;
  
    markupPercent?: number;
    imageUri?: string;
  
    isMainItem?: boolean;
    isNonInventory?: boolean;
  
    reorderPoint?: number | 0;
    minMarkupPercentage?: number | 0;
    maxMarkupPercentage?: number | 100;
  
    supplierId?: string;
    supplierName?: string;
  
    metadata?: any;
  
    constructor(public cost = 0, public quantityInHand = 0) {}
  
    public static fromSupabase(item: any) {
      const product = new ProductModel();
      product.id = item.id;
  
      product.name = item.name;
      product.description = item.description || "-";
      product.sku = item.sku || "-";
  
      product.cost = item.cost || 0;
      product.quantityInHand = item.quantity_in_hand || 0;
      product.markupPercent = item.markup_percent || 0;
  
      product.imageUri = item.image_uri;
  
      product.isMainItem = item.is_main_item;
      product.isNonInventory = item.is_non_inventory;
  
      product.minMarkupPercentage = item.min_markup_percentage || 0;
      product.maxMarkupPercentage = item.max_markup_percentage || 0;
      product.reorderPoint = item.reorder_point || 0;
      product.supplierId = item.supplier_id;
      product.supplierName = item.supplier_name;
  
      if (item.metadata) {
        product.metadata = item.metadata;
      }
  
      return product;
    }
  }