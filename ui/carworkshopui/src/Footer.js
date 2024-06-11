import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div>
        <footer className="border-top footer text-muted">
            <div className="container">
                &copy; 2024 - CarWorkshop - <Link to="/privacy">Privacy</Link>
            </div>
        </footer>
    </div>
  );
}

export default Footer;