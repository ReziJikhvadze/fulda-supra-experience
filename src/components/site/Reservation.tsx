import { useState } from "react";
import { z } from "zod";
import { Ornament } from "./Ornament";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().min(5, "Please enter a phone number").max(30),
  email: z.string().trim().email("Invalid email").max(120),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  guests: z.string().min(1),
  notes: z.string().max(500).optional(),
});

export function Reservation() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    // Future: POST to serverFn / Cloud / WhatsApp / email
    setSubmitted(true);
  };

  return (
    <section id="reserve" className="py-24 md:py-32 bg-walnut text-cream">
      <div className="mx-auto max-w-6xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
        <div>
          <Ornament className="mb-8 justify-start" />
          <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">
            Reservation
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif italic">
            Reserve Your Georgian Table in Fulda
          </h2>
          <p className="mt-8 text-cream/75 font-light text-lg leading-relaxed">
            Join us at Am Stockhaus 10–12 for handmade Georgian dishes, warm
            wine, and true hospitality.
          </p>

          <div className="mt-12 space-y-6">
            <a
              href="tel:+4906611234567"
              className="flex items-center gap-4 text-cream/90 hover:text-gold transition-colors"
            >
              <span className="text-gold font-serif italic">Call</span>
              <span className="text-lg">+49 (0) 661 123 4567</span>
            </a>
            <a
              href="https://wa.me/4906611234567"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 text-cream/90 hover:text-gold transition-colors"
            >
              <span className="text-gold font-serif italic">WhatsApp</span>
              <span className="text-lg">Message us directly</span>
            </a>
          </div>
        </div>

        {submitted ? (
          <div className="border border-gold/40 p-12 text-center">
            <h3 className="font-serif italic text-3xl text-gold mb-4">Madloba.</h3>
            <p className="text-cream/80 font-light leading-relaxed">
              Your reservation request has been received. We will confirm by
              phone or email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field name="name" placeholder="Name" />
              <Field name="phone" placeholder="Phone" type="tel" />
            </div>
            <Field name="email" placeholder="Email" type="email" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <Field name="date" type="date" />
              <Field name="time" type="time" />
              <select
                name="guests"
                defaultValue="2"
                className="bg-transparent border-b border-cream/25 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n} className="bg-walnut text-cream">
                    {n} {n === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
                <option value="9" className="bg-walnut">9+ Guests</option>
              </select>
            </div>
            <textarea
              name="notes"
              placeholder="Special request (allergies, occasion…)"
              rows={3}
              className="w-full bg-transparent border-b border-cream/25 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
            />
            {error && <p className="text-clay text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gold text-walnut py-4 uppercase text-[11px] tracking-[0.25em] font-medium hover:bg-cream transition-colors"
            >
              Send Reservation Request
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  name,
  placeholder,
  type = "text",
}: {
  name: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full bg-transparent border-b border-cream/25 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
    />
  );
}
