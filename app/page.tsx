"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

const benefits = [
  {
    title: "Managed setup",
    description:
      "We install, configure, and launch your business AI assistant so you do not have to touch the infrastructure.",
  },
  {
    title: "Hosted and maintained",
    description:
      "We keep the system online, monitored, and working so your team can focus on using it.",
  },
  {
    title: "Direct access for your team",
    description:
      "Your business gets a ready-to-use assistant for everyday work, without the technical overhead.",
  },
];

const useCases = [
  "Draft emails and replies faster",
  "Answer internal questions from shared business knowledge",
  "Support planning, research, and repetitive admin work",
  "Help organize ideas, notes, and business context",
  "Give staff a reliable assistant for day-to-day tasks",
  "Reduce friction when adopting AI in your business",
];

const process = [
  {
    step: "01",
    title: "Tell us about your business",
    description:
      "Share a little about your company and how you think an AI assistant could help.",
  },
  {
    step: "02",
    title: "We set everything up",
    description:
      "We handle installation, hosting, security, and the technical work behind the scenes.",
  },
  {
    step: "03",
    title: "You start using it",
    description:
      "Your team gets direct access to a managed AI assistant without the usual setup burden.",
  },
];

const faqs = [
  {
    question: "What kind of businesses is this for?",
    answer:
      "NorthDesk is designed for small businesses that want AI capability without managing the technical setup themselves.",
  },
  {
    question: "What can I use the assistant for?",
    answer:
      "Common uses include drafting emails, answering internal questions, supporting research, planning, and helping with repetitive admin tasks.",
  },
  {
    question: "Do I need to set anything up myself?",
    answer:
      "No. We handle setup, hosting, security, and maintenance so your team can focus on using the assistant.",
  },
  {
    question: "Do you host and maintain it for us?",
    answer:
      "Yes. We keep it hosted and maintained so you are not left managing infrastructure or upkeep yourself.",
  },
  {
    question: "Is this meant for non-technical businesses too?",
    answer:
      "Yes. The service is intended to make business AI accessible without requiring technical experience on your side.",
  },
  {
    question: "What happens after I contact you?",
    answer:
      "We follow up by email with a few qualifying questions about your business, intended use cases, team context, and level of interest.",
  },
];

type ContactFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
};

type ContactFormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

function ContactField({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required = false,
}: ContactFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
      <span className="flex items-center gap-2">
        {label}
        {required ? <span className="text-[var(--accent)]">*</span> : null}
      </span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="h-12 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(79,123,255,0.12)]"
      />
    </label>
  );
}

export default function Home() {
  const [formState, setFormState] = useState<ContactFormState>({
    status: "idle",
    message: "",
  });

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const businessName = String(formData.get("businessName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const topic = businessName ? `Inquiry from ${businessName}` : "General inquiry";

    setFormState({
      status: "submitting",
      message: "Sending your message...",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          topic,
          message:
            message ||
            `Business name: ${businessName}\n\nThe visitor requested follow-up without adding extra details.`,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFormState({
          status: "error",
          message: result.error || "We could not send your message. Please try again.",
        });
        return;
      }

      form.reset();
      setFormState({
        status: "success",
        message: "Thanks. Your message was sent successfully.",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setFormState({
        status: "error",
        message: "We could not send your message. Please try again.",
      });
    }
  }

  return (
    <main className="bg-[var(--page)] text-[var(--ink)]">
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(79,123,255,0.16),_transparent_58%)]" />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-10">
          <header className="relative z-20 grid grid-cols-[1fr_auto] items-center gap-4 py-4">
            <a href="#top" className="inline-flex min-w-0 items-center gap-3 text-sm font-semibold tracking-[0.18em] text-[var(--ink)] uppercase">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--line)] bg-white shadow-sm" aria-hidden="true">
                <Image
                  src="/northdesk-logo-40x40.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                  priority
                />
              </span>
              <span className="truncate">NorthDesk</span>
            </a>
            <a
              href="#contact"
              className="inline-flex h-11 items-center justify-center self-start rounded-full border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Contact Us
            </a>
          </header>

          <div
            id="top"
            className="relative grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24"
          >
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--muted)] shadow-sm backdrop-blur">
                Managed AI assistant access for small businesses
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[var(--ink)] sm:text-6xl lg:text-7xl">
                Your business AI assistant, set up and managed for you.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                NorthDesk sets up, hosts, secures, and maintains your AI assistant so your team can start using it without handling the technical side.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--accent)] px-7 text-base font-semibold text-white shadow-lg shadow-[rgba(79,123,255,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                >
                  Contact Us
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-[var(--line)] bg-white px-7 text-base font-medium text-[var(--ink)] transition hover:bg-black/[0.02]"
                >
                  See how it works
                </a>
              </div>
              <p className="mt-4 text-sm text-[var(--muted)]">
                Simple contact first. We follow up by email with a few questions about your business and how you would use it.
              </p>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-[0_24px_80px_rgba(16,24,40,0.08)]">
                <div className="flex items-center justify-between border-b border-black/6 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">Managed access</p>
                    <p className="text-sm text-[var(--muted)]">Hosted, maintained, ready to use</p>
                  </div>
                  <span className="rounded-full bg-[rgba(79,123,255,0.12)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                    Small business
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    "No infrastructure work on your side",
                    "Direct access to your AI assistant",
                    "Security, hosting, and maintenance handled",
                    "Useful for daily business tasks from day one",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-black/6 bg-[var(--surface)] px-4 py-4"
                    >
                      <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                      <p className="text-sm leading-6 text-[var(--ink)]">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-[var(--ink)] px-5 py-5 text-white">
                  <p className="text-sm font-medium text-white/70">Best for teams who want</p>
                  <p className="mt-2 text-lg font-semibold">
                    AI capability without managing another system themselves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="section-label">What this is</p>
            <h2 className="section-title mt-4">
              A managed business AI assistant, without the setup burden.
            </h2>
            <p className="section-copy mt-5">
              NorthDesk gives your business direct access to a hosted AI assistant. We handle the setup, hosting, maintenance, and security so you can focus on using it.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-[1.75rem] border border-[var(--line)] bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[var(--ink)]">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="section-label">Example use cases</p>
            <h2 className="section-title mt-4">Useful from day one across common business tasks.</h2>
            <p className="section-copy mt-5">
              The assistant is flexible by design. Businesses can use it in different ways depending on how they work.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-black/6 bg-[var(--surface)] px-5 py-5 text-sm font-medium text-[var(--ink)] shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="section-label">Why businesses choose this</p>
            <h2 className="section-title mt-4">
              A simpler way to bring AI into the business.
            </h2>
            <p className="section-copy mt-5">
              Many teams want AI access, but not the work of installing, hosting, securing, and maintaining it. NorthDesk is built for that exact gap.
            </p>
          </div>
          <div className="space-y-4">
            {[
              "No need to manage infrastructure, servers, or updates",
              "Direct access for your business instead of another abstract AI concept",
              "A professional setup designed to reduce technical friction",
              "A clean starting point for businesses exploring practical AI use",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-[var(--line)] bg-white px-5 py-4 text-[0.98rem] leading-7 text-[var(--ink)] shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-black/5 bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="section-label">How it works</p>
            <h2 className="section-title mt-4">A low-friction path from interest to access.</h2>
            <p className="section-copy mt-5">
              The goal is to make getting started simple. Contact us first, then we follow up with a few questions and handle the technical side from there.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {process.map((item) => (
              <article
                key={item.step}
                className="rounded-[1.75rem] border border-[var(--line)] bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold tracking-[0.2em] text-[var(--accent)] uppercase">{item.step}</p>
                <h3 className="mt-4 text-xl font-semibold text-[var(--ink)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="section-label">FAQ</p>
            <h2 className="section-title mt-4">Common questions.</h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-6"
              >
                <h3 className="text-base font-semibold text-[var(--ink)]">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{faq.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 rounded-[1.75rem] border border-[var(--line)] bg-[var(--page)] p-6 sm:p-8">
            <p className="text-base font-semibold text-[var(--ink)]">Have a question that is not covered here?</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Send us a note and we will reply by email. The first step stays simple, then we follow up with a few qualifying questions about your business and intended use.
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full border border-[var(--line)] bg-white px-6 text-sm font-medium text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Go to contact form
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="section-label">Contact</p>
            <h2 className="section-title mt-4">Interested in managed AI assistant access?</h2>
            <p className="section-copy mt-5">
              Send your details and we will follow up by email with a few questions about your business, how you would use the assistant, and whether it looks like a fit.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-[var(--line)] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[var(--ink)]">What we ask for here</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
                <li>Name and email</li>
                <li>Business name</li>
                <li>Optional note about your use case</li>
              </ul>
            </div>
          </div>

          <form
            id="contact-form"
            className="rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-[0_20px_70px_rgba(16,24,40,0.08)] sm:p-8"
            method="post"
            onSubmit={handleContactSubmit}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <ContactField
                label="Name"
                name="name"
                placeholder="Your name"
                autoComplete="name"
                required
              />
              <ContactField
                label="Business name"
                name="businessName"
                placeholder="Your business"
                autoComplete="organization"
                required
              />
            </div>
            <div className="mt-5">
              <ContactField
                label="Email"
                name="email"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                required
              />
            </div>
            <label className="mt-5 flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
              <span>Optional message</span>
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us a little about your business or how you might use an AI assistant."
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(79,123,255,0.12)]"
              />
            </label>
            <button
              type="submit"
              disabled={formState.status === "submitting"}
              className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-full bg-[var(--accent)] px-7 text-base font-semibold text-white shadow-lg shadow-[rgba(79,123,255,0.2)] transition hover:bg-[var(--accent-strong)] focus:outline-none focus:ring-4 focus:ring-[rgba(79,123,255,0.18)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {formState.status === "submitting" ? "Sending..." : "Contact Us"}
            </button>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              We keep the initial contact simple. After you reach out, we follow up by email with a few questions and next steps.
            </p>
            {formState.message ? (
              <p
                className={`mt-4 text-sm ${
                  formState.status === "error" ? "text-red-600" : "text-[var(--muted)]"
                }`}
                role="status"
              >
                {formState.message}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  );
}
