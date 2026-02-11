import React from 'react';

const Contacts = () => {
  return (
    <div className="info-container animate-fade-in">
      <div className="glass-card">
        <h2 className="section-title">L**at** xiriir (Contacts)</h2>
        <p className="subtitle">Expert**at** Hub Support Team</p>
        
        <div className="contact-grid">
          <div className="contact-item">
            <span className="icon">📍</span>
            <div>
              <strong>Service Center</strong>
              <p>Hargeisa, Somalia</p>
            </div>
          </div>
          
          <div className="contact-item">
            <span className="icon">🆔</span>
            <div>
              <strong>Support ID</strong>
              <p>Agent 377 266</p>
            </div>
          </div>
          
          <div className="contact-item">
            <span className="icon">✉️</span>
            <div>
              <strong>Email Us</strong>
              <p>help@expert**at**hub.com</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Full N**at**me</label>
            <input type="text" className="input-field" placeholder="Gali m**at**g**at**gaaga..." />
          </div>
          
          <div className="form-group">
            <label>Mess**at**ge</label>
            <textarea className="input-field" rows="4" placeholder="Sidee b**at**n kuu caawin k**at**r**at**a?"></textarea>
          </div>
          
          <button type="submit" className="nav-btn admin-glow">Send Mess**at**ge</button>
        </form>
      </div>
    </div>
  );
};

export default Contacts;