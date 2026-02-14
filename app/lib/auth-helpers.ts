import { auth } from '@/auth';
import { sql } from '@/app/lib/data/db';

export async function requireUserId() {
  const session = await auth();
  const sessionUserId = session?.user?.id;

  if (sessionUserId) {
    return sessionUserId;
  }
  throw new Error('Unauthorized');
}
