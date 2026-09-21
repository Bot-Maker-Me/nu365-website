import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="pt-32 max-w-4xl mx-auto px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-heading font-bold tracking-tight mb-8 gradient-text">
            Terms of Service
          </h1>
          
          <div className="glass-card rounded-2xl p-8 space-y-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">2. Age Requirement</h2>
                <p className="text-muted-foreground">
                  You must be at least 18 years of age to use this website and purchase products. By using this website, you represent and warrant that you are at least 18 years of age.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">3. Products and Services</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify, discontinue, or change any products or services without notice. We do not warrant that product descriptions or other content are accurate, complete, reliable, current, or error-free.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">4. User Responsibilities</h2>
                <p className="text-muted-foreground">
                  You agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Use the website for lawful purposes only</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Not use the website to distribute harmful content</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  All content on this website, including text, graphics, logos, images, and software, is the property of our company or its content suppliers and is protected by intellectual property laws.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of this website or products.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">7. Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold us harmless from any claims arising from your use of the website or violation of these terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">8. Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms shall be governed by and construed in accordance with the laws of Egypt. Any disputes shall be resolved in the courts of Egypt.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">9. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Your continued use of the website after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">10. Contact Information</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us through our enquiry form or the contact information provided on our website.
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
