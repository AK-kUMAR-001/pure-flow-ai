-- Create orders table for storing order information
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || TO_CHAR(now(), 'YYYYMMDDHHmmss') || '-' || SUBSTR(md5(random()::text), 1, 6),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_address TEXT,
  user_state TEXT,
  user_district TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed
  payment_method TEXT, -- qr, upi
  transaction_id TEXT,
  filter_type TEXT,
  test_results JSONB, -- store test data if coming from home test
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create home_test_bookings table
CREATE TABLE public.home_test_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT UNIQUE NOT NULL DEFAULT 'HTB-' || TO_CHAR(now(), 'YYYYMMDDHHmmss') || '-' || SUBSTR(md5(random()::text), 1, 6),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_address TEXT,
  user_state TEXT,
  user_district TEXT,
  booking_date DATE NOT NULL,
  booking_time TIME,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  test_parameters JSONB, -- pH, TDS, turbidity, etc.
  unique_customer_id TEXT, -- customer's unique ID (AQ-USER-001 format)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique customer ID tracker
CREATE TABLE public.customer_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  unique_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_test_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_ids ENABLE ROW LEVEL SECURITY;

-- Orders RLS policies
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
ON public.orders FOR UPDATE
USING (auth.uid() = user_id);

-- Home test bookings RLS policies
CREATE POLICY "Users can view their own bookings"
ON public.home_test_bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings"
ON public.home_test_bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.home_test_bookings FOR UPDATE
USING (auth.uid() = user_id);

-- Customer IDs RLS policies
CREATE POLICY "Users can view their own customer ID"
ON public.customer_ids FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customer ID"
ON public.customer_ids FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to generate unique customer ID
CREATE OR REPLACE FUNCTION public.generate_unique_customer_id()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'AQ-USER-' || LPAD((COUNT(*) + 1)::TEXT, 3, '0')
  FROM public.customer_ids;
$$;

-- Create function to store order data
CREATE OR REPLACE FUNCTION public.store_order(
  p_user_id UUID,
  p_user_email TEXT,
  p_user_phone TEXT,
  p_user_address TEXT,
  p_user_state TEXT,
  p_user_district TEXT,
  p_amount DECIMAL,
  p_payment_method TEXT,
  p_transaction_id TEXT,
  p_filter_type TEXT,
  p_test_results JSONB
)
RETURNS TABLE (order_id TEXT, success BOOLEAN) AS $$
BEGIN
  INSERT INTO public.orders (
    user_id, user_email, user_phone, user_address, user_state, user_district,
    amount, payment_status, payment_method, transaction_id, filter_type, test_results
  ) VALUES (
    p_user_id, p_user_email, p_user_phone, p_user_address, p_user_state, p_user_district,
    p_amount, 'completed', p_payment_method, p_transaction_id, p_filter_type, p_test_results
  );
  
  RETURN QUERY SELECT orders.order_id, true FROM public.orders WHERE user_id = p_user_id ORDER BY created_at DESC LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to store home test booking
CREATE OR REPLACE FUNCTION public.store_home_test_booking(
  p_user_id UUID,
  p_user_email TEXT,
  p_user_phone TEXT,
  p_user_address TEXT,
  p_user_state TEXT,
  p_user_district TEXT,
  p_booking_date DATE,
  p_booking_time TIME,
  p_test_parameters JSONB
)
RETURNS TABLE (booking_id TEXT, unique_id TEXT, success BOOLEAN) AS $$
DECLARE
  v_unique_id TEXT;
BEGIN
  -- Get or create unique customer ID
  SELECT unique_id INTO v_unique_id FROM public.customer_ids WHERE user_id = p_user_id;
  
  IF v_unique_id IS NULL THEN
    v_unique_id := public.generate_unique_customer_id();
    INSERT INTO public.customer_ids (user_id, unique_id) VALUES (p_user_id, v_unique_id);
  END IF;
  
  INSERT INTO public.home_test_bookings (
    user_id, user_email, user_phone, user_address, user_state, user_district,
    booking_date, booking_time, test_parameters, unique_customer_id
  ) VALUES (
    p_user_id, p_user_email, p_user_phone, p_user_address, p_user_state, p_user_district,
    p_booking_date, p_booking_time, p_test_parameters, v_unique_id
  );
  
  RETURN QUERY SELECT home_test_bookings.booking_id, v_unique_id, true 
    FROM public.home_test_bookings 
    WHERE user_id = p_user_id 
    ORDER BY created_at DESC LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_home_test_bookings_user_id ON public.home_test_bookings(user_id);
CREATE INDEX idx_home_test_bookings_created_at ON public.home_test_bookings(created_at DESC);
CREATE INDEX idx_customer_ids_user_id ON public.customer_ids(user_id);
