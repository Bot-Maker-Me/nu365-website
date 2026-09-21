import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Send, Mail, Phone, User, MessageSquare } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function EnquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Here you would typically send this data to your backend or email service
    // For now, we'll simulate a successful submission
    setTimeout(() => {
      toast.success('Enquiry submitted successfully! We will get back to you soon.');
      setForm({ name: '', mobile: '', email: '', description: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="pt-32 max-w-4xl mx-auto px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold tracking-tight mb-4 gradient-text">
              Send us an Enquiry
            </h1>
            <p className="text-muted-foreground text-lg">
              Have questions about our products? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="bg-secondary/20 border-[#1F1F2E]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    required
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder="Your mobile number"
                    className="bg-secondary/20 border-[#1F1F2E]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="bg-secondary/20 border-[#1F1F2E]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Description / Question
                </Label>
                <Textarea
                  id="description"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Please describe your enquiry or question in detail..."
                  rows={6}
                  className="bg-secondary/20 border-[#1F1F2E] resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 gradient-bg text-white border-transparent"
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Enquiry
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#1F1F2E]">
              <p className="text-sm text-muted-foreground text-center">
                Alternatively, you can contact us directly at{' '}
                <a href="mailto:manager@example.com" className="text-primary hover:underline">
                  manager@example.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
