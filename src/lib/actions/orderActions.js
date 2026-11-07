'use server';

import { revalidatePath } from 'next/cache';
import { updateDeliveryStatus } from '@/lib/services/orderService';
import { isAdminRequest } from '@/lib/session';

// Errors are returned, not thrown: Server Action error messages are masked in production.
export async function updateDeliveryStatusAction(id, status) {
  if (!(await isAdminRequest())) return { ok: false, error: 'Your session has expired. Please sign in again.' };
  try {
    const data = await updateDeliveryStatus(id, status);
    // 'layout' so the order list (rendered in the orders layout) refreshes too.
    revalidatePath('/admin/orders', 'layout');
    revalidatePath('/admin');
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message || 'Could not update the delivery status.' };
  }
}
