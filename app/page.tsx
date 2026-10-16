import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section py-5">
        <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <div className="animate-fade-in-up">
                <span className="badge bg-light text-primary mb-3 px-3 py-2">
                  <i className="bi bi-stars me-1"></i>
                  AI-Powered Health Assessment
                </span>
                <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: "-0.03em" }}>
                  Know Your<br />
                  <span style={{ color: "#67e8f9" }}>Hypertension</span> Risk
                </h1>
                <p className="lead mb-4" style={{ opacity: 0.9 }}>
                  An intelligent tool that estimates your risk of developing
                  hypertension using simple lifestyle information. Early
                  detection saves lives.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link href="/register" className="btn btn-light btn-lg px-4">
                    <i className="bi bi-person-plus me-2"></i>
                    Get Started
                  </Link>
                  <Link href="/login" className="btn btn-outline-light btn-lg px-4">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Login
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center d-none d-lg-block">
              <div className="animate-float">
                <div
                  className="d-inline-flex align-items-center justify-content-center"
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <i
                    className="bi bi-heart-pulse animate-heartbeat"
                    style={{ fontSize: "6rem", color: "#fff" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-dark text-light py-4">
        <div className="container">
          <div className="row text-center g-3">
            <div className="col-md-3 col-6 animate-fade-in-up">
              <h3 className="fw-bold mb-0 text-info">1.28B</h3>
              <small className="text-secondary">Adults with hypertension</small>
            </div>
            <div className="col-md-3 col-6 animate-fade-in-up delay-1">
              <h3 className="fw-bold mb-0 text-warning">2/3</h3>
              <small className="text-secondary">In low-income countries</small>
            </div>
            <div className="col-md-3 col-6 animate-fade-in-up delay-2">
              <h3 className="fw-bold mb-0 text-danger">Silent</h3>
              <small className="text-secondary">Often no symptoms</small>
            </div>
            <div className="col-md-3 col-6 animate-fade-in-up delay-3">
              <h3 className="fw-bold mb-0 text-success">Preventable</h3>
              <small className="text-secondary">With early detection</small>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5 animate-fade-in-up">
            <h2 className="fw-bold mb-2">Why Use This Tool?</h2>
            <p className="text-secondary mb-0">
              Powered by machine learning to give you accurate risk predictions
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4 animate-fade-in-up delay-1">
              <div className="card h-100 text-center">
                <div className="card-body p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                    }}
                  >
                    <i
                      className="bi bi-search-heart"
                      style={{ fontSize: "2rem", color: "#2563eb" }}
                    ></i>
                  </div>
                  <h4 className="fw-bold mb-2">Early Detection</h4>
                  <p className="text-secondary mb-0">
                    Identify your hypertension risk before symptoms appear. Get
                    timely warnings and take preventive action.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 animate-fade-in-up delay-2">
              <div className="card h-100 text-center">
                <div className="card-body p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                    }}
                  >
                    <i
                      className="bi bi-cup-hot"
                      style={{ fontSize: "2rem", color: "#16a34a" }}
                    ></i>
                  </div>
                  <h4 className="fw-bold mb-2">Lifestyle-Based</h4>
                  <p className="text-secondary mb-0">
                    No lab tests required. Just answer simple questions about
                    your age, diet, activity, and daily habits.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 animate-fade-in-up delay-3">
              <div className="card h-100 text-center">
                <div className="card-body p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    }}
                  >
                    <i
                      className="bi bi-cpu"
                      style={{ fontSize: "2rem", color: "#d97706" }}
                    ></i>
                  </div>
                  <h4 className="fw-bold mb-2">AI-Powered</h4>
                  <p className="text-secondary mb-0">
                    Powered by machine learning algorithms trained on lifestyle
                    data to give accurate risk predictions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5 animate-fade-in-up">
            <h2 className="fw-bold mb-2">How It Works</h2>
            <p className="text-secondary mb-0">Three simple steps to know your risk</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4 animate-fade-in-up delay-1">
              <div className="text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3 animate-float"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--gradient-primary)",
                    boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
                  }}
                >
                  <i className="bi bi-person-plus text-white" style={{ fontSize: "2rem" }}></i>
                </div>
                <h5 className="fw-bold">Create an Account</h5>
                <p className="text-secondary">
                  Register with your email and password to get started in
                  seconds.
                </p>
              </div>
            </div>
            <div className="col-md-4 animate-fade-in-up delay-2">
              <div className="text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3 animate-float"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--gradient-primary)",
                    boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
                    animationDelay: "0.5s",
                  }}
                >
                  <i className="bi bi-clipboard2-pulse text-white" style={{ fontSize: "2rem" }}></i>
                </div>
                <h5 className="fw-bold">Enter Lifestyle Data</h5>
                <p className="text-secondary">
                  Fill in details about your age, BMI, diet, activity level, and
                  more.
                </p>
              </div>
            </div>
            <div className="col-md-4 animate-fade-in-up delay-3">
              <div className="text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3 animate-float"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--gradient-primary)",
                    boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
                    animationDelay: "1s",
                  }}
                >
                  <i className="bi bi-graph-up-arrow text-white" style={{ fontSize: "2rem" }}></i>
                </div>
                <h5 className="fw-bold">Get Your Risk Score</h5>
                <p className="text-secondary">
                  Receive your hypertension risk level and personalized health
                  recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container">
          <div
            className="text-center p-5 rounded-4 animate-scale-in"
            style={{
              background: "var(--gradient-hero)",
              color: "#fff",
            }}
          >
            <h2 className="fw-bold mb-3">Ready to Check Your Risk?</h2>
            <p className="mb-4" style={{ opacity: 0.9 }}>
              It only takes a few minutes. Your health is worth it.
            </p>
            <Link href="/register" className="btn btn-light btn-lg px-4">
              <i className="bi bi-person-plus me-2"></i>
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
