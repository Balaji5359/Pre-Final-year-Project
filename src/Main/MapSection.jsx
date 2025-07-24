import React from 'react';

function MapSection() {
    return (
        <section style={{ 
            padding: '80px 0', 
            background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)',
            minHeight: '100vh'
        }} id="map-sec">
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ 
                        fontSize: '2.5rem', 
                        marginBottom: '10px',
                        color: '#312e81',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}>Find Us</h2>
                    <p style={{ color: '#4f46e5' }}>Our location in Andhra Pradesh, India</p>
                </div>
                
                <div style={{
                    width: '100%',
                    height: '450px',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    marginBottom: '40px',
                    position: 'relative'
                }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61859.41546009792!2d78.4651311!3d13.5525864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb2699077cf2d9f%3A0x2e3fb7a80c78afe1!2sMadanapalle%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1716037200000!5e0"
                        width="100%"
                        height="100%"
                        style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        background: 'rgba(255, 255, 255, 0.7)',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{
                            fontSize: '2rem',
                            color: 'white',
                            marginRight: '20px',
                            padding: '15px',
                            background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                            borderRadius: '50%',
                            height: '70px',
                            width: '70px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div>
                            <h3 style={{ color: '#2b2d42', marginBottom: '10px', fontSize: '1.2rem' }}>Our Address</h3>
                            <p style={{ color: '#8d99ae', marginBottom: '5px', fontSize: '0.95rem' }}>456 College Road, Madanapalle</p>
                            <p style={{ color: '#8d99ae', marginBottom: '5px', fontSize: '0.95rem' }}>Andhra Pradesh, India - 517325</p>
                        </div>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        background: 'rgba(255, 255, 255, 0.7)',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{
                            fontSize: '2rem',
                            color: 'white',
                            marginRight: '20px',
                            padding: '15px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                            borderRadius: '50%',
                            height: '70px',
                            width: '70px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <i className="fas fa-phone-alt"></i>
                        </div>
                        <div>
                            <h3 style={{ color: '#2b2d42', marginBottom: '10px', fontSize: '1.2rem' }}>Contact Us</h3>
                            <p style={{ color: '#8d99ae', marginBottom: '5px', fontSize: '0.95rem' }}>Phone: +91 98765 43210</p>
                            <p style={{ color: '#8d99ae', marginBottom: '5px', fontSize: '0.95rem' }}>Email: contact@skillroute.edu</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MapSection;