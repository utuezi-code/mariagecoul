"use client";

import { AnimatePresence, m } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/links";
import { rsvpSchema, EVENT_CHOICES } from "@/lib/rsvp";
import { fr } from "@/lib/typo";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

type Errors = Partial<Record<"name" | "phone" | "attending" | "guests" | "events" | "message", string>>;

const f = site.rsvp.form;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-[#a33a2a]">
      {message}
    </p>
  );
}

function Label({ htmlFor, children, optional }: { htmlFor?: string; children: string; optional?: boolean }) {
  const Tag = htmlFor ? "label" : "span";
  return (
    <Tag htmlFor={htmlFor} className="eyebrow block !text-[0.65rem] text-mist-deep">
      {children}{" "}
      {optional ? (
        <span className="normal-case tracking-normal">({f.optional})</span>
      ) : (
        <span aria-hidden="true" className="text-gold-ink">
          *
        </span>
      )}
    </Tag>
  );
}

function ChoiceGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="eyebrow mb-3 !text-[0.65rem] text-mist-deep">
        {fr(legend)} <span aria-hidden="true" className="text-gold-ink">*</span>
      </legend>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={`cursor-pointer border px-5 py-3 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
                checked ? "border-ink bg-ink text-ivory" : "border-ink/20 bg-white text-graphite hover:border-gold-deep"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
                required
              />
              {o.label}
            </label>
          );
        })}
      </div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  );
}

export function Rsvp({ open }: { open: boolean }) {
  const { rsvp } = site;
  const [attending, setAttending] = useState("");
  const [events, setEvents] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error" | "limited">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      attending,
      guests: attending === "oui" ? String(fd.get("guests") ?? "1") : "1",
      events: attending === "oui" && events ? events : undefined,
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    };
    const parsed = rsvpSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (k && !next[k]) next[k] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(raw),
      });
      if (res.status === 429) return setStatus("limited");
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { errors?: Errors } | null;
        if (data?.errors) {
          setErrors(data.errors);
          return setStatus("idle");
        }
        return setStatus("error");
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="rsvp" className="relative bg-ivory px-5 py-24 md:py-32">
      <div className="mx-auto max-w-2xl">
        <SectionTitle title={rsvp.title} tone="light" />
        <GoldDivider tone="light" className="mt-6" />

        {!open ? (
          <Reveal className="mt-12">
            <div className="border border-gold/30 bg-white px-6 py-12 text-center md:px-12">
              <Monogram className="mx-auto h-16 w-16" tone="light" />
              <p className="mx-auto mt-6 max-w-md font-display text-2xl font-light italic leading-snug text-ink">{fr(rsvp.closed)}</p>
            </div>
          </Reveal>
        ) : (
          <>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-8 max-w-lg text-center leading-relaxed text-graphite">{rsvp.text}</p>
            </Reveal>

            <AnimatePresence mode="wait">
              {status === "done" ? (
                <m.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-12 border border-gold/30 bg-white px-6 py-14 text-center md:px-12"
                  role="status"
                >
                  <Monogram play="mount" tone="light" className="mx-auto h-24 w-24" />
                  <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="mx-auto mt-8 max-w-md font-display text-3xl font-light italic leading-snug text-ink"
                  >
                    {fr(rsvp.success)}
                  </m.p>
                </m.div>
              ) : (
                <m.form
                  key="form"
                  exit={{ opacity: 0, y: -12 }}
                  onSubmit={onSubmit}
                  noValidate
                  className="mt-12 space-y-8 border border-gold/25 bg-white px-6 py-10 shadow-[0_30px_60px_-45px_rgba(11,11,11,0.35)] md:px-12 md:py-12"
                >
                  {/* Honeypot anti-spam : invisible pour les humains */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label>
                      Site web
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <div>
                    <Label htmlFor="rsvp-name">{f.name}</Label>
                    <input
                      id="rsvp-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="field"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    <FieldError id="name-error" message={errors.name} />
                  </div>

                  <div>
                    <Label htmlFor="rsvp-phone">{f.phone}</Label>
                    <input
                      id="rsvp-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      className="field"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    <FieldError id="phone-error" message={errors.phone} />
                  </div>

                  <ChoiceGroup
                    name="attending"
                    legend={f.attending}
                    value={attending}
                    onChange={setAttending}
                    error={errors.attending}
                    options={[
                      { value: "oui", label: f.attendingYes },
                      { value: "non", label: f.attendingNo },
                    ]}
                  />

                  <AnimatePresence initial={false}>
                    {attending === "oui" && (
                      <m.div
                        key="yes-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-8 overflow-hidden"
                      >
                        <div className="pt-1">
                          <Label htmlFor="rsvp-guests">{f.guests}</Label>
                          <select
                            id="rsvp-guests"
                            name="guests"
                            defaultValue="1"
                            className="field cursor-pointer"
                            aria-invalid={!!errors.guests}
                            aria-describedby={errors.guests ? "guests-error" : undefined}
                          >
                            {Array.from({ length: rsvp.maxGuests }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                          <FieldError id="guests-error" message={errors.guests} />
                        </div>

                        <ChoiceGroup
                          name="events"
                          legend={f.events}
                          value={events}
                          onChange={setEvents}
                          error={errors.events}
                          options={EVENT_CHOICES.map((v) => ({ value: v, label: f.eventsOptions[v] }))}
                        />
                      </m.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <Label htmlFor="rsvp-message" optional>
                      {f.message}
                    </Label>
                    <textarea
                      id="rsvp-message"
                      name="message"
                      rows={3}
                      maxLength={1000}
                      className="field resize-none"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                    <FieldError id="message-error" message={errors.message} />
                  </div>

                  {(status === "error" || status === "limited") && (
                    <p role="alert" className="text-center text-sm text-[#a33a2a]">
                      {status === "limited" ? f.rateLimited : f.error}
                    </p>
                  )}

                  <div className="flex justify-center pt-2">
                    <button type="submit" className="btn-gold w-full sm:w-auto" disabled={status === "sending"}>
                      {status === "sending" ? f.submitting : f.submit}
                    </button>
                  </div>
                </m.form>
              )}
            </AnimatePresence>
          </>
        )}

        {rsvp.contacts.length > 0 && (
          <Reveal className="mt-14 text-center">
            <p className="eyebrow text-gold-ink">{rsvp.contactsTitle}</p>
            <ul className="mt-5 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
              {rsvp.contacts.map((c) => (
                <li key={c.whatsapp}>
                  <a
                    href={whatsappHref(c.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-ink hover:bg-ink hover:text-ivory"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
                    {c.name} · {rsvp.whatsappLabel}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
