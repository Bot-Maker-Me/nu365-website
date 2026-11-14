import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Mail, MessageSquare, Phone, Send, User } from 'lucide-react';
import { FormField, Honeypot } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { site } from '@/config/site';
import { sendEnquiry } from '@/lib/enquiry';

export default function EnquiryForm() {
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setSending(true);
    try {
      await sendEnquiry({
        name: values.name,
        mobile: values.mobile,
        email: values.email,
        message: values.message,
        website: values.website,
      });
      toast.success("Your enquiry has been sent! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      toast.error(`${(error as Error).message} You can also email us at ${site.email}.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pb-12 pt-32 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="gradient-text mb-4 font-heading text-4xl font-bold tracking-tight">Send us an Enquiry</h1>
        <p className="text-lg text-muted-foreground">
          Have questions about our products? Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField label="Name" name="name" icon={User} required placeholder="Your full name" />
            <FormField label="Mobile Number" name="mobile" icon={Phone} type="tel" required placeholder="Your mobile number" />
          </div>
          <FormField label="Email" name="email" icon={Mail} type="email" required placeholder="your.email@example.com" />
          <FormField
            label="Description / Question"
            name="message"
            icon={MessageSquare}
            rows={6}
            required
            placeholder="Please describe your enquiry or question in detail..."
          />
          <Honeypot />
          <Button type="submit" disabled={sending} className="gradient-bg h-12 w-full border-transparent text-white">
            <Send className="mr-2 h-4 w-4" /> {sending ? 'Submitting...' : 'Submit Enquiry'}
          </Button>
        </form>

        <p className="mt-8 border-t border-[#1F1F2E] pt-6 text-center text-sm text-muted-foreground">
          Or email us directly at{' '}
          <a href={`mailto:${site.email}`} className="text-primary hover:underline">
            {site.email}
          </a>
        </p>
      </div>
    </div>
  );
}
