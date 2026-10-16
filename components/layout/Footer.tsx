import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="mb-2">
              <i className="bi bi-heart-pulse-fill me-2 text-danger"></i>
              Hypertension Risk Predictor
            </h5>
            <p className="text-secondary mb-0 small">
              An AI-powered decision-support tool for early hypertension risk
              assessment among Nigerian adults using lifestyle data.
            </p>
          </div>
          <div className="col-md-3">
            <h6 className="text-uppercase mb-2">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><Link href="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link href="/login" className="text-light text-decoration-none">Login</Link></li>
              <li><Link href="/register" className="text-light text-decoration-none">Register</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="text-uppercase mb-2">About</h6>
            <p className="text-secondary small mb-0">
              BSc Computer Science Project<br />
              Nasarawa State University, Keffi
            </p>
          </div>
        </div>
        <hr className="my-3 border-secondary" />
        <div className="text-center text-secondary small">
          &copy; {year} Joseph Suel Godfrey. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
