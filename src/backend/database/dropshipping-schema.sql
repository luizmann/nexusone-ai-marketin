-- Additional tables for automated inventory sync and order fulfillment system

-- Dropshipping products table
CREATE TABLE dropshipping_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    external_id VARCHAR(100) NOT NULL, -- CJ product ID
    name VARCHAR(500) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    cost DECIMAL(10,2), -- Cost from supplier
    currency VARCHAR(3) DEFAULT 'USD',
    image_url TEXT,
    images TEXT[],
    category VARCHAR(100),
    tags TEXT[],
    stock_quantity INTEGER DEFAULT 0,
    weight DECIMAL(8,2),
    supplier VARCHAR(50) DEFAULT 'cj_dropshipping',
    supplier_data JSONB, -- Supplier-specific data
    is_active BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    total_sales INTEGER DEFAULT 0,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, external_id, supplier)
);

-- Dropshipping orders table
CREATE TABLE dropshipping_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    external_order_id VARCHAR(100), -- CJ order ID
    client_order_id VARCHAR(100) NOT NULL,
    products JSONB NOT NULL, -- Order items
    shipping_address JSONB NOT NULL,
    customer_info JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'failed')),
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    supplier VARCHAR(50) DEFAULT 'cj_dropshipping',
    tracking_number VARCHAR(100),
    estimated_delivery_days INTEGER,
    error_message TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order tracking events
CREATE TABLE order_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES dropshipping_orders(id) ON DELETE CASCADE,
    tracking_number VARCHAR(100) NOT NULL,
    tracking_events JSONB,
    current_status VARCHAR(50),
    current_location VARCHAR(200),
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory sync logs
CREATE TABLE inventory_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    products_synced INTEGER DEFAULT 0,
    products_failed INTEGER DEFAULT 0,
    schedule_id VARCHAR(100), -- For scheduled syncs
    sync_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fulfillment logs
CREATE TABLE fulfillment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES dropshipping_orders(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    success BOOLEAN NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Import logs
CREATE TABLE import_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    import_type VARCHAR(50) NOT NULL,
    products_imported INTEGER DEFAULT 0,
    products_failed INTEGER DEFAULT 0,
    products_skipped INTEGER DEFAULT 0,
    errors TEXT[],
    options JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory sync schedules
CREATE TABLE inventory_sync_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('hourly', 'daily', 'weekly')),
    is_active BOOLEAN DEFAULT true,
    product_filters JSONB, -- Filters for which products to sync
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chrome extension sessions for secure product import
CREATE TABLE chrome_extension_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    permissions TEXT[] DEFAULT ARRAY['product_import'],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product performance analytics
CREATE TABLE product_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES dropshipping_products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    orders INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, date)
);

-- Add indexes for better performance
CREATE INDEX idx_dropshipping_products_user_id ON dropshipping_products(user_id);
CREATE INDEX idx_dropshipping_products_external_id ON dropshipping_products(external_id);
CREATE INDEX idx_dropshipping_products_supplier ON dropshipping_products(supplier);
CREATE INDEX idx_dropshipping_products_is_active ON dropshipping_products(is_active);
CREATE INDEX idx_dropshipping_products_stock_quantity ON dropshipping_products(stock_quantity);

CREATE INDEX idx_dropshipping_orders_user_id ON dropshipping_orders(user_id);
CREATE INDEX idx_dropshipping_orders_status ON dropshipping_orders(status);
CREATE INDEX idx_dropshipping_orders_external_order_id ON dropshipping_orders(external_order_id);
CREATE INDEX idx_dropshipping_orders_created_at ON dropshipping_orders(created_at);

CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX idx_order_tracking_tracking_number ON order_tracking(tracking_number);

CREATE INDEX idx_inventory_sync_logs_user_id ON inventory_sync_logs(user_id);
CREATE INDEX idx_inventory_sync_logs_created_at ON inventory_sync_logs(created_at);

CREATE INDEX idx_fulfillment_logs_user_id ON fulfillment_logs(user_id);
CREATE INDEX idx_fulfillment_logs_order_id ON fulfillment_logs(order_id);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_chrome_extension_sessions_user_id ON chrome_extension_sessions(user_id);
CREATE INDEX idx_chrome_extension_sessions_token ON chrome_extension_sessions(session_token);
CREATE INDEX idx_chrome_extension_sessions_expires_at ON chrome_extension_sessions(expires_at);

CREATE INDEX idx_product_analytics_product_id ON product_analytics(product_id);
CREATE INDEX idx_product_analytics_user_id ON product_analytics(user_id);
CREATE INDEX idx_product_analytics_date ON product_analytics(date);

-- Enable RLS for new tables
ALTER TABLE dropshipping_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropshipping_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_sync_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chrome_extension_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can access own dropshipping products" ON dropshipping_products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own dropshipping orders" ON dropshipping_orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own order tracking" ON order_tracking FOR ALL USING (auth.uid() = (SELECT user_id FROM dropshipping_orders WHERE id = order_id));
CREATE POLICY "Users can access own inventory sync logs" ON inventory_sync_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own fulfillment logs" ON fulfillment_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own import logs" ON import_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own sync schedules" ON inventory_sync_schedules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own extension sessions" ON chrome_extension_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own product analytics" ON product_analytics FOR ALL USING (auth.uid() = user_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_dropshipping_products_updated_at BEFORE UPDATE ON dropshipping_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dropshipping_orders_updated_at BEFORE UPDATE ON dropshipping_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_tracking_updated_at BEFORE UPDATE ON order_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample dropshipping products for testing
INSERT INTO dropshipping_products (user_id, external_id, name, description, price, original_price, cost, image_url, category, tags, stock_quantity, supplier_data) VALUES
-- Electronics
('00000000-0000-0000-0000-000000000001', 'CJ001', 'Wireless Bluetooth Earbuds Pro', 'High-quality wireless earbuds with noise cancellation and premium sound quality. Perfect for music lovers and professionals.', 29.99, 49.99, 12.50, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', 'Electronics', ARRAY['electronics', 'audio', 'wireless', 'trending'], 150, '{"supplierName": "TechSource Co.", "shippingTime": "3-7 days", "moq": 1, "weight": 0.2}'),
('00000000-0000-0000-0000-000000000001', 'CJ002', 'Smart Fitness Tracker Watch', 'Advanced fitness tracker with heart rate monitoring, GPS, and smartphone integration. Track your health 24/7.', 39.99, 79.99, 18.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'Electronics', ARRAY['fitness', 'health', 'smart watch', 'bestseller'], 89, '{"supplierName": "FitTech Inc.", "shippingTime": "5-10 days", "moq": 1, "weight": 0.15}'),
('00000000-0000-0000-0000-000000000001', 'CJ003', 'Portable Phone Charger 20000mAh', 'Ultra-fast portable charger with multiple USB ports and wireless charging capability. Never run out of battery again.', 24.99, 39.99, 11.00, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', 'Electronics', ARRAY['charger', 'portable', 'power bank', 'essential'], 200, '{"supplierName": "PowerMax Ltd.", "shippingTime": "3-5 days", "moq": 1, "weight": 0.4}'),

-- Home & Garden
('00000000-0000-0000-0000-000000000001', 'CJ004', 'LED Strip Lights RGB 16ft', 'Color-changing LED strip lights with remote control and music sync. Transform any room into an ambient paradise.', 19.99, 34.99, 8.50, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 'Home & Garden', ARRAY['lighting', 'rgb', 'decoration', 'popular'], 175, '{"supplierName": "LightCraft Co.", "shippingTime": "3-7 days", "moq": 1, "weight": 0.3}'),
('00000000-0000-0000-0000-000000000001', 'CJ005', 'Automatic Plant Watering System', 'Smart irrigation system for indoor plants. Set schedules and never worry about watering your plants again.', 34.99, 59.99, 16.00, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500', 'Home & Garden', ARRAY['gardening', 'automatic', 'smart home', 'plants'], 95, '{"supplierName": "GreenTech Solutions", "shippingTime": "5-8 days", "moq": 1, "weight": 0.8}'),

-- Fashion & Beauty
('00000000-0000-0000-0000-000000000001', 'CJ006', 'Luxury Silk Hair Scrunchies Set', 'Premium silk scrunchies that protect your hair and add elegant style. Set of 6 different colors.', 14.99, 24.99, 6.00, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500', 'Fashion & Beauty', ARRAY['hair accessories', 'silk', 'luxury', 'set'], 120, '{"supplierName": "Silk Elegance", "shippingTime": "4-7 days", "moq": 1, "weight": 0.05}'),
('00000000-0000-0000-0000-000000000001', 'CJ007', 'Anti-Aging Vitamin C Serum', 'Professional-grade vitamin C serum for brighter, younger-looking skin. Clinically tested and dermatologist approved.', 27.99, 49.99, 12.00, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', 'Fashion & Beauty', ARRAY['skincare', 'anti-aging', 'vitamin c', 'premium'], 80, '{"supplierName": "Beauty Labs Pro", "shippingTime": "3-6 days", "moq": 1, "weight": 0.1}'),

-- Sports & Outdoors
('00000000-0000-0000-0000-000000000001', 'CJ008', 'Resistance Bands Set Pro', 'Complete resistance training set with 5 bands, handles, and door anchor. Perfect for home workouts and travel.', 22.99, 39.99, 9.50, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', 'Sports & Outdoors', ARRAY['fitness', 'resistance training', 'home gym', 'portable'], 140, '{"supplierName": "FitPro Equipment", "shippingTime": "3-7 days", "moq": 1, "weight": 0.5}'),
('00000000-0000-0000-0000-000000000001', 'CJ009', 'Waterproof Bluetooth Speaker', 'Rugged outdoor speaker with 360° sound and 24-hour battery life. Perfect for camping, beach, and pool parties.', 32.99, 59.99, 14.50, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 'Sports & Outdoors', ARRAY['speaker', 'waterproof', 'outdoor', 'bluetooth'], 110, '{"supplierName": "SoundWave Tech", "shippingTime": "4-8 days", "moq": 1, "weight": 0.6}'),

-- Pet Supplies
('00000000-0000-0000-0000-000000000001', 'CJ010', 'Automatic Pet Feeder Smart', 'WiFi-enabled automatic pet feeder with portion control and feeding schedule. Monitor your pet remotely via app.', 45.99, 79.99, 22.00, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500', 'Pet Supplies', ARRAY['pet care', 'automatic', 'smart', 'feeder'], 65, '{"supplierName": "PetTech Innovations", "shippingTime": "5-10 days", "moq": 1, "weight": 1.2}');

-- Add some sample dropshipping orders
INSERT INTO dropshipping_orders (user_id, client_order_id, products, shipping_address, total_amount, status) VALUES
('00000000-0000-0000-0000-000000000001', 'ORD-2024-001', 
'[{"productId": "CJ001", "quantity": 2, "price": 29.99, "name": "Wireless Bluetooth Earbuds Pro"}]',
'{"firstName": "John", "lastName": "Doe", "email": "john@example.com", "phone": "+1234567890", "address1": "123 Main St", "city": "New York", "state": "NY", "country": "US", "zipCode": "10001"}',
59.98, 'confirmed'),
('00000000-0000-0000-0000-000000000001', 'ORD-2024-002',
'[{"productId": "CJ004", "quantity": 1, "price": 19.99, "name": "LED Strip Lights RGB 16ft"}, {"productId": "CJ006", "quantity": 1, "price": 14.99, "name": "Luxury Silk Hair Scrunchies Set"}]',
'{"firstName": "Jane", "lastName": "Smith", "email": "jane@example.com", "phone": "+1234567891", "address1": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "country": "US", "zipCode": "90210"}',
34.98, 'shipped');