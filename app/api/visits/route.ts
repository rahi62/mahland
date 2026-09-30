import {saveVisit} from '@/db/visits';

export const runtime = 'nodejs';

const allowedVillas = new Set(['general', 'villa-01', 'villa-02', 'villa-03']);
const normalizePhone = (value: string) =>
  value
    .replace(/[۰-۹]/g, (char) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(char)))
    .replace(/[٠-٩]/g, (char) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(char)))
    .replace(/[\s()-]/g, '');

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 7000) {
      return Response.json({ error: 'حجم اطلاعات بیش از حد مجاز است.' }, { status: 413 });
    }

    const body = JSON.parse(raw) as Record<string, unknown>;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ error: 'اطلاعات فرم معتبر نیست.' }, { status: 400 });
    }

    // Honeypot: silently accept bot submissions without storing them.
    if (typeof body.website === 'string' && body.website.trim()) {
      return Response.json({ id: crypto.randomUUID() }, { status: 201 });
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = normalizePhone(typeof body.phone === 'string' ? body.phone : '');
    const villa = typeof body.villa === 'string' ? body.villa : 'general';
    const preferred = typeof body.preferred === 'string' ? body.preferred.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    const valid =
      name.length >= 2 &&
      name.length <= 100 &&
      /^\+?\d{10,15}$/.test(phone) &&
      allowedVillas.has(villa) &&
      preferred.length <= 100 &&
      message.length <= 2000;

    if (!valid) {
      return Response.json(
        { error: 'نام و شماره تماس معتبر وارد کنید و طول پیام را بررسی کنید.' },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    await saveVisit({ id, name, phone, villa, preferred, message });

    return Response.json(
      { id },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: 'اطلاعات فرم معتبر نیست.' }, { status: 400 });
    }
    console.error('Visit save failed', error);
    return Response.json(
      { error: 'درخواست ذخیره نشد؛ اطلاعات فرم شما در صفحه باقی مانده است. لطفاً دوباره تلاش کنید.' },
      { status: 503 },
    );
  }
}
