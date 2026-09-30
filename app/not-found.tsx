import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main">
      <div className="inner-top">
        <p>خطای ۴۰۴</p>
        <h1>این صفحه پیدا نشد.</h1>
        <p>ممکن است آدرس تغییر کرده باشد یا صفحه‌ای با این نشانی وجود نداشته باشد.</p>
      </div>
      <section className="section">
        <Link className="dark-button" href="/">بازگشت به صفحه اصلی</Link>
      </section>
    </main>
  );
}
