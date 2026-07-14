
-- Revoke execute on SECURITY DEFINER helpers (called by triggers/RLS, not clients)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Tighten public-insert policies with basic length checks
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (email IS NOT NULL AND char_length(email) BETWEEN 3 AND 254);

DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact" ON public.contact_messages FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 254
    AND char_length(message) BETWEEN 1 AND 5000
    AND (subject IS NULL OR char_length(subject) <= 200)
  );

DROP POLICY IF EXISTS "Anyone can submit comment" ON public.comments;
CREATE POLICY "Anyone can submit comment" ON public.comments FOR INSERT
  WITH CHECK (
    approved = false
    AND char_length(author_name) BETWEEN 1 AND 120
    AND char_length(content) BETWEEN 1 AND 5000
    AND (author_email IS NULL OR char_length(author_email) <= 254)
  );
