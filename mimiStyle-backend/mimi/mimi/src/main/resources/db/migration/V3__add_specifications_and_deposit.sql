-- Add specifications column to products table
ALTER TABLE products ADD COLUMN specifications TEXT;

-- Add deposit column to products table
ALTER TABLE products ADD COLUMN deposit DECIMAL(19, 2);

-- Add comment for documentation
COMMENT ON COLUMN products.specifications IS 'Technical specifications of the product';
COMMENT ON COLUMN products.deposit IS 'Deposit amount required for rental products';
