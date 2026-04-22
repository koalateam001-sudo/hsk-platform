export function getContactUrl() {
  return process.env.NEXT_PUBLIC_CONTACT_URL?.trim() || "";
}
