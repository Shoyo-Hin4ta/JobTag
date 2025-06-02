-- Add status history and tracking columns to applications table
ALTER TABLE applications 
ADD COLUMN status_history jsonb DEFAULT '[]'::jsonb,
ADD COLUMN last_status_date timestamptz DEFAULT now(),
ADD COLUMN first_contact_date timestamptz;

-- Add comment to explain the structure
COMMENT ON COLUMN applications.status_history IS 'Array of status changes: [{status, date, email_id, confidence, note}]';

-- Update the last_status_date when status changes
CREATE OR REPLACE FUNCTION update_last_status_date()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.last_status_date = now();
    
    -- Also append to status_history
    NEW.status_history = COALESCE(NEW.status_history, '[]'::jsonb) || 
      jsonb_build_object(
        'status', NEW.status,
        'date', now(),
        'email_id', NEW.source_email_id,
        'confidence', 1.0,
        'note', 'Manual update'
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_application_status_date
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_last_status_date();

-- Add index for sorting by last_status_date
CREATE INDEX idx_apps_last_status ON applications(user_id, last_status_date DESC) WHERE archived = false;