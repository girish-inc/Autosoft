-- Insert demo vehicles with proper array casting
INSERT INTO public.vehicles (make, model, year, vin, color, mileage, price, cost, status, fuel_type, transmission, body_type, exterior_color, interior_color, features, description, images) VALUES
('Toyota', 'Camry', 2023, '4T1BE46K87U123456', 'Silver', 12500, 28999.00, 25000.00, 'available', 'gasoline', 'automatic', 'Sedan', 'Silver Metallic', 'Black Cloth', ARRAY['Backup Camera', 'Bluetooth', 'Cruise Control', 'USB Ports'], 'Well-maintained 2023 Toyota Camry with excellent fuel economy and reliability.', ARRAY[]::text[]),
('Honda', 'Civic', 2022, '19XFC2F59ME234567', 'Blue', 18200, 24500.00, 22000.00, 'available', 'gasoline', 'manual', 'Sedan', 'Aegean Blue Metallic', 'Gray Cloth', ARRAY['Apple CarPlay', 'Android Auto', 'Lane Keeping Assist', 'Adaptive Cruise Control'], 'Sporty and efficient Honda Civic with advanced safety features.', ARRAY[]::text[]),
('Ford', 'F-150', 2023, '1FTEW1EP5PFA34567', 'Red', 8500, 42999.00, 38000.00, 'available', 'gasoline', 'automatic', 'Truck', 'Race Red', 'Black Leather', ARRAY['4WD', 'Tow Package', 'Heated Seats', 'Remote Start'], 'Powerful F-150 pickup truck perfect for work and recreation.', ARRAY[]::text[]),
('Tesla', 'Model 3', 2022, '5YJ3E1EA5MF345678', 'White', 22000, 39999.00, 35000.00, 'reserved', 'electric', 'automatic', 'Sedan', 'Pearl White Multi-Coat', 'Black Premium', ARRAY['Autopilot', 'Supercharging', 'Premium Audio', 'Glass Roof'], 'Pre-owned Tesla Model 3 with Autopilot and premium interior.', ARRAY[]::text[]),
('BMW', 'X5', 2021, 'WBAJA7C50MCW45678', 'Black', 35000, 52999.00, 48000.00, 'available', 'gasoline', 'automatic', 'SUV', 'Jet Black', 'Cognac Leather', ARRAY['Navigation', 'Panoramic Roof', 'Heated Seats', 'Premium Audio'], 'Luxury BMW X5 with premium features and excellent condition.', ARRAY[]::text[]),
('Chevrolet', 'Malibu', 2020, '1G1ZE5ST5LF456789', 'Gray', 45000, 19999.00, 17000.00, 'sold', 'gasoline', 'automatic', 'Sedan', 'Northsky Blue Metallic', 'Jet Black Cloth', ARRAY['Backup Camera', 'OnStar', 'Apple CarPlay'], 'Recently sold Chevrolet Malibu in excellent condition.', ARRAY[]::text[]),
('Audi', 'A4', 2023, 'WAUENAF43PN567890', 'Silver', 5200, 45999.00, 42000.00, 'available', 'gasoline', 'automatic', 'Sedan', 'Florett Silver Metallic', 'Black Leather', ARRAY['Quattro AWD', 'Virtual Cockpit', 'Navigation', 'Premium Audio'], 'Nearly new Audi A4 with advanced technology and luxury features.', ARRAY[]::text[]),
('Jeep', 'Wrangler', 2022, '1C4HJXEG1NW678901', 'Green', 28000, 36999.00, 33000.00, 'available', 'gasoline', 'manual', 'SUV', 'Sarge Green', 'Black Cloth', ARRAY['4WD', 'Removable Doors', 'Off-Road Package', 'Rock Rails'], 'Adventure-ready Jeep Wrangler perfect for off-road enthusiasts.', ARRAY[]::text[]),
('Mercedes-Benz', 'C-Class', 2021, 'WDDWF4HB0MR789012', 'White', 31000, 38999.00, 35000.00, 'in_service', 'gasoline', 'automatic', 'Sedan', 'Polar White', 'Artico Black', ARRAY['Navigation', 'Heated Seats', 'Premium Audio', 'LED Headlights'], 'Elegant Mercedes-Benz C-Class currently in service for maintenance.', ARRAY[]::text[]),
('Nissan', 'Altima', 2023, '1N4BL4BV8PC890123', 'Blue', 15000, 26999.00, 24000.00, 'available', 'gasoline', 'automatic', 'Sedan', 'Deep Blue Pearl', 'Charcoal Cloth', ARRAY['ProPILOT Assist', 'Apple CarPlay', 'Blind Spot Warning'], 'Modern Nissan Altima with advanced driver assistance features.', ARRAY[]::text[]);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  date_of_birth DATE,
  driver_license TEXT,
  preferred_contact TEXT DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'text')),
  credit_score INTEGER,
  notes TEXT,
  assigned_to UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "All authenticated users can view customers" 
ON public.customers 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Sales team and above can manage customers" 
ON public.customers 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('super_admin', 'manager', 'sales', 'receptionist')
  )
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  salesperson_id UUID REFERENCES public.profiles(user_id),
  sale_price DECIMAL(10,2) NOT NULL,
  down_payment DECIMAL(10,2) DEFAULT 0,
  financing_amount DECIMAL(10,2),
  interest_rate DECIMAL(5,2),
  loan_term_months INTEGER,
  monthly_payment DECIMAL(10,2),
  trade_in_vehicle TEXT,
  trade_in_value DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  sale_date DATE DEFAULT CURRENT_DATE,
  delivery_date DATE,
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  commission_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create policies for sales
CREATE POLICY "All authenticated users can view sales" 
ON public.sales 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Sales team and above can manage sales" 
ON public.sales 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('super_admin', 'manager', 'sales')
  )
);

-- Add triggers for timestamps
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON public.sales
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert demo customers
INSERT INTO public.customers (first_name, last_name, email, phone, address_line1, city, state, zip_code, date_of_birth, driver_license, credit_score, notes) VALUES
('John', 'Smith', 'john.smith@email.com', '(555) 123-4567', '123 Main Street', 'Springfield', 'IL', '62701', '1985-06-15', 'S123456789', 750, 'Interested in luxury vehicles, prefers sedan body style.'),
('Sarah', 'Johnson', 'sarah.johnson@email.com', '(555) 234-5678', '456 Oak Avenue', 'Springfield', 'IL', '62702', '1990-03-22', 'S234567890', 720, 'First-time buyer, looking for reliable and fuel-efficient vehicle.'),
('Michael', 'Davis', 'michael.davis@email.com', '(555) 345-6789', '789 Pine Road', 'Springfield', 'IL', '62703', '1978-11-08', 'S345678901', 680, 'Business owner needing a truck for work purposes.'),
('Emily', 'Wilson', 'emily.wilson@email.com', '(555) 456-7890', '321 Elm Street', 'Springfield', 'IL', '62704', '1988-09-14', 'S456789012', 780, 'Environmentally conscious, interested in electric or hybrid vehicles.'),
('David', 'Brown', 'david.brown@email.com', '(555) 567-8901', '654 Maple Drive', 'Springfield', 'IL', '62705', '1982-12-03', 'S567890123', 710, 'Family man looking for a safe and spacious SUV.');

-- Insert demo sales (some completed, some pending)
INSERT INTO public.sales (customer_id, vehicle_id, sale_price, down_payment, financing_amount, interest_rate, loan_term_months, monthly_payment, status, sale_date, commission_rate, commission_amount, notes) VALUES
((SELECT id FROM public.customers WHERE email = 'john.smith@email.com' LIMIT 1), 
 (SELECT id FROM public.vehicles WHERE make = 'Chevrolet' AND model = 'Malibu' LIMIT 1), 
 19999.00, 3000.00, 16999.00, 4.5, 60, 317.45, 'completed', '2024-01-15', 5.00, 999.95, 'Customer was very satisfied with the purchase process.'),
((SELECT id FROM public.customers WHERE email = 'emily.wilson@email.com' LIMIT 1), 
 (SELECT id FROM public.vehicles WHERE make = 'Tesla' AND model = 'Model 3' LIMIT 1), 
 39999.00, 8000.00, 31999.00, 3.9, 72, 510.25, 'pending', '2024-01-20', 5.00, 1999.95, 'Customer is finalizing financing options.'),
((SELECT id FROM public.customers WHERE email = 'michael.davis@email.com' LIMIT 1), 
 (SELECT id FROM public.vehicles WHERE make = 'Ford' AND model = 'F-150' LIMIT 1), 
 42999.00, 5000.00, 37999.00, 5.2, 84, 548.73, 'approved', '2024-01-22', 5.00, 2149.95, 'Business purchase with tax benefits discussed.');