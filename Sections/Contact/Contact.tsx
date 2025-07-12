"use client"
import {ContactForm, LandingContent} from '@/components';

const Contact = () => {
  return (
    <section id='contact' className="my-8 wrapper-page overflow-hidden">
      <h1 className="header-section">Contact us</h1>
      <div className="flex justify-evenly items-center flex-wrap-reverse md:gap-1 gap-7 my-6">
        <ContactForm />
        <LandingContent/>
      </div>
    </section>
  );
};

export default Contact;
