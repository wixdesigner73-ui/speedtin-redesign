import { useSearchParams } from "react-router-dom";
import { contact } from "../data/site";
import { shopifyPaths } from "../lib/shopify";
import PageHero from "../components/PageHero";
import { Arrow } from "../components/Icons";
import { useMeta } from "../hooks/useMeta";

export default function Contact() {
  useMeta(contact.title, "Get in touch with Speed Tin. We'll get back to you within 48 hours.");
  const [sp] = useSearchParams();
  const topic = contact.topics.find(([v]) => v === sp.get("topic"))?.[0] || "wholesale-solutions";
  return (
    <>
      <PageHero eyebrow={contact.sub} title={contact.title} lede={contact.copy} />
      <section className="cf on-light">
        <div className="wrap cf__grid">
          {/*
            Native POST to the live Shopify store's contact endpoint (same field names as the current site),
            so submissions arrive in the store's existing contact inbox.
          */}
          <form className="cf__form" method="post" action={shopifyPaths.contactForm} acceptCharset="UTF-8">
            <input type="hidden" name="form_type" value="contact" />
            <input type="hidden" name="utf8" value="✓" />
            <div className="cf__two">
              <label className="fld"><span>Name</span><input type="text" name="contact[name]" autoComplete="name" placeholder="Ex. John Doe" required /></label>
              <label className="fld"><span>Email</span><input type="email" name="contact[email]" autoComplete="email" spellCheck="false" placeholder="Ex. johndoe@example.com" required /></label>
            </div>
            <label className="fld">
              <span>I&rsquo;d like to ask about</span>
              <select name="contact[I'd like to ask about]" defaultValue={topic} required>
                {contact.topics.map(([v, l]) => (<option key={v} value={v}>{l}</option>))}
              </select>
            </label>
            <label className="fld"><span>Message</span><textarea name="contact[body]" rows="6" placeholder="Ex. Hello there is something I want to ask..." required /></label>
            <div className="cf__foot">
              <p>Your information will not be published. Required fields are marked.</p>
              <button type="submit" className="btn btn--dark">Send Us <Arrow /></button>
            </div>
          </form>
          <aside className="cf__side">
            <p className="eyebrow">Response time</p>
            <p className="h2">We&rsquo;ll get back to you within 48 hours.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
