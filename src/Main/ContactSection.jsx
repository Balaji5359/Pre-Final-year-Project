import React, { useEffect } from 'react';
import "./main.css";

function ContactSection() {
    useEffect(() => {
        if (window.gsap) {
            gsap.from('.contact-title', {
                scrollTrigger: {
                    trigger: '.contact-section',
                    start: 'top 70%'
                },
                duration: 1,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            });
            
            gsap.from('.social-icon a', {
                scrollTrigger: {
                    trigger: '.social-icon',
                    start: 'top 80%'
                },
                duration: 0.5,
                opacity: 0,
                y: 20,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            });
        }
    }, []);
    
    return (
        <section id="contact-sec" style={{ padding: '8% 5%', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9f0ff 100%)', minHeight: '100vh' }}>
        <div className="container mx-auto px-4 py-16">
            {/* Logo with enhanced style for visibility */}
            <div className="flex justify-center mb-10">
                <span
                    style={{
                        fontWeight: 'bold',
                        fontSize: '2.5rem',
                        letterSpacing: '2px',
                        background: 'linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                        textShadow: '2px 2px 8px rgba(123,47,242,0.25), 0 2px 12px #fff'
                    }}
                    aria-label="SkillRoute Logo"
                >
                    Skill<span style={{
                        color: '#f357a8',
                        WebkitTextFillColor: '#f357a8',
                        background: 'none',
                        textShadow: '2px 2px 8px rgba(243,87,168,0.25)'
                    }}>Route</span>
                </span>
            </div>
            <div className="text-center mb-12" data-aos="fade-up">
                <h1 className="contact-title text text-4xl mb-4 text-purple-800">Get In Touch</h1>
                <p className="text-lg text-purple-600 max-w-2xl mx-auto">
                    We'd love to hear from you! Reach out to us with any questions about our services, 
                    career guidance, or how we can help you achieve your professional goals.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.18)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', padding: '2rem', borderRadius: '0.75rem' }} data-aos="fade-right">
                    <h2 className="text-2xl font-bold mb-6 text-purple-700">Contact Information</h2>
                    <div className="space-y-4">
                        <div className="flex items-center hover-lift">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)' }}>
                                <i className="fas fa-map-marker-alt text-white icon-pulse"></i>
                            </div>
                            <div>
                                <p className="font-semibold">Address</p>
                                <p>456 College Road, Madanapalle, AP - 517325</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center hover-lift">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
                                <i className="fas fa-phone text-white icon-pulse"></i>
                            </div>
                            <div>
                                <p className="font-semibold">Phone</p>
                                <p>+91 9398350212</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center hover-lift">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)' }}>
                                <i className="fas fa-envelope text-white icon-pulse"></i>
                            </div>
                            <div>
                                <p className="font-semibold">Email</p>
                                <p>contact@skillroute.edu</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.18)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', padding: '2rem', borderRadius: '0.75rem' }} data-aos="fade-left">
                    <h2 className="text-2xl font-bold mb-6 text-purple-700">Connect With Us</h2>
                    <p className="mb-6">Follow us on social media to stay updated with the latest news, events, and career opportunities.</p>
                    
                    <div className="social-icon flex flex-wrap gap-4">
                        <a href="#" className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover-lift" >
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white hover-lift">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white hover-lift">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href="#" className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white hover-lift">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="#" className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white hover-lift">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                    
                    <button className="mt-8 text-white py-3 px-6 rounded-full" style={{ background: 'linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)', backgroundSize: '1400% 1400%', animation: 'rainbow 18s ease infinite', transform: 'translateY(-5px)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}>
                        <i className="fas fa-paper-plane mr-2"></i> Send Message
                    </button>
                </div>
            </div>
        </div>
        </section>
    );
}

export default ContactSection;
