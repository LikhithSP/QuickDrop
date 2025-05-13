-- Create the 'codes' table to store short codes
CREATE TABLE IF NOT EXISTS codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(4) NOT NULL UNIQUE,
  resource_type VARCHAR(10) NOT NULL, -- 'text' or 'file'
  resource_id TEXT NOT NULL, -- Either UUID for text or filepath for file
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expiry TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Ensure codes are unique
  CONSTRAINT unique_code UNIQUE(code)
);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS codes_code_idx ON codes(code);

-- Create SQL Function to generate a random 4-character code
CREATE OR REPLACE FUNCTION generate_unique_code() 
RETURNS VARCHAR(4) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  result VARCHAR(4) := '';
  i INTEGER;
  code_exists BOOLEAN;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..4 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM codes WHERE code = result) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
