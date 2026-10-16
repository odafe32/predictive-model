"""Generate a project summary PDF for the Hypertension Risk Predictor."""

from fpdf import FPDF


class ProjectPDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, "Hypertension Risk Predictor - Project Summary", align="L")
        self.cell(0, 8, "Joseph Suel Godfrey", align="R")
        self.ln(10)
        self.set_draw_color(37, 99, 235)
        self.set_line_width(0.4)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

    def section_title(self, title):
        self.ln(4)
        self.set_font("helvetica", "B", 14)
        self.set_text_color(37, 99, 235)
        self.cell(0, 9, title)
        self.ln(10)

    def sub_title(self, title):
        self.set_font("helvetica", "B", 11)
        self.set_text_color(30, 41, 59)
        self.cell(0, 7, title)
        self.ln(8)

    def body(self, text):
        self.set_font("helvetica", "", 10.5)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def bullet(self, text):
        self.set_font("helvetica", "", 10.5)
        self.set_text_color(50, 50, 50)
        x = self.get_x()
        self.cell(6, 5.5, chr(149))
        self.multi_cell(0, 5.5, text, new_x="LMARGIN")
        self.ln(0.5)

    def table_row(self, cells, widths, header=False):
        if header:
            self.set_font("helvetica", "B", 9.5)
            self.set_fill_color(37, 99, 235)
            self.set_text_color(255, 255, 255)
        else:
            self.set_font("helvetica", "", 9.5)
            self.set_text_color(50, 50, 50)
        for cell, w in zip(cells, widths):
            self.cell(w, 7, str(cell), border=1, fill=header)
        self.ln()


pdf = ProjectPDF()
pdf.set_auto_page_break(auto=True, margin=20)
pdf.add_page()

# ============ COVER ============
pdf.ln(30)
pdf.set_font("helvetica", "B", 24)
pdf.set_text_color(37, 99, 235)
pdf.multi_cell(0, 12, "Predictive Model for Hypertension Risk among Nigerian Adults Using Lifestyle Data", align="C")

pdf.ln(8)
pdf.set_font("helvetica", "", 13)
pdf.set_text_color(100, 116, 139)
pdf.cell(0, 8, "A Machine Learning Decision-Support Web Application", align="C")
pdf.ln(20)

pdf.set_font("helvetica", "B", 12)
pdf.set_text_color(30, 41, 59)
pdf.cell(0, 8, "Joseph Suel Godfrey", align="C")
pdf.ln(6)
pdf.set_font("helvetica", "", 11)
pdf.set_text_color(100, 116, 139)
pdf.cell(0, 7, "BSc Computer Science Project", align="C")
pdf.ln(6)
pdf.cell(0, 7, "Nasarawa State University, Keffi", align="C")
pdf.ln(20)

# ============ 1. OVERVIEW ============
pdf.add_page()
pdf.section_title("1. Project Overview")
pdf.body(
    "This project is a web-based decision-support system that predicts the risk of "
    "hypertension among Nigerian adults using lifestyle and demographic data. Users "
    "register on the platform, complete a lifestyle assessment questionnaire (covering "
    "age, BMI, physical activity, smoking, alcohol, diet, stress, family history, salt "
    "intake, sleep hours, and caffeine intake), and receive an instant risk classification "
    "of Low, Moderate, or High along with a probability score and personalized health "
    "recommendations."
)
pdf.body(
    "An administrator panel provides oversight of the system: user management, viewing "
    "all predictions made across the platform, interactive statistics charts, and a full "
    "system activity audit log."
)

# ============ 2. OBJECTIVES ============
pdf.section_title("2. Objectives")
pdf.bullet("Develop a machine learning model capable of classifying hypertension risk into Low, Moderate, and High categories.")
pdf.bullet("Build a user-friendly web application where individuals can assess their hypertension risk using lifestyle information.")
pdf.bullet("Provide personalized, actionable health recommendations based on each user's risk profile.")
pdf.bullet("Maintain prediction history so users can track their risk over time.")
pdf.bullet("Provide an administrative dashboard for user management, prediction monitoring, and system logging.")

# ============ 3. TECHNOLOGY STACK ============
pdf.section_title("3. Technologies Used")

pdf.sub_title("3.1 Web Application (Frontend + Backend)")
widths = [60, 130]
pdf.table_row(["Technology", "Purpose"], widths, header=True)
for row in [
    ["Next.js 16 (App Router)", "Full-stack framework - pages, API routes, middleware"],
    ["React 19 + TypeScript", "Component UI, type-safe development"],
    ["Bootstrap 5.3", "Responsive styling, cards, tables, forms"],
    ["Recharts", "Admin dashboard charts (pie, bar)"],
    ["Zustand", "Client-side auth state management"],
    ["Zod", "Input validation schemas (frontend + API)"],
    ["jose", "JWT signing and verification"],
    ["bcryptjs", "Password hashing"],
]:
    pdf.table_row(row, widths)
pdf.ln(4)

pdf.sub_title("3.2 Machine Learning Service")
pdf.table_row(["Technology", "Purpose"], widths, header=True)
for row in [
    ["Python 3.14", "ML service runtime"],
    ["FastAPI", "REST API exposing /predict and /health endpoints"],
    ["scikit-learn", "Model training (SVM selected), preprocessing pipeline"],
    ["pandas + NumPy", "Data handling and feature processing"],
    ["joblib", "Model serialization (.pkl artifact)"],
    ["Pydantic", "Request/response validation"],
    ["pytest", "API endpoint testing (6 tests)"],
    ["Uvicorn", "ASGI server"],
]:
    pdf.table_row(row, widths)
pdf.ln(4)

pdf.sub_title("3.3 Database & Infrastructure")
pdf.table_row(["Technology", "Purpose"], widths, header=True)
for row in [
    ["PostgreSQL (Neon)", "Cloud-hosted serverless database"],
    ["Prisma 5.22", "ORM - schema, migrations, queries"],
    ["Vercel", "Frontend + API hosting"],
    ["Render", "Python ML service hosting"],
    ["Git/GitHub", "Version control"],
]:
    pdf.table_row(row, widths)

# ============ 4. ARCHITECTURE ============
pdf.section_title("4. System Architecture")
pdf.body(
    "The system follows a three-tier architecture: the Next.js web application serves the "
    "frontend and API layer, a separate Python FastAPI microservice hosts the machine "
    "learning model, and a PostgreSQL (Neon) database stores all persistent data."
)
pdf.set_font("helvetica", "B", 10.5)
pdf.set_text_color(30, 41, 59)
pdf.multi_cell(0, 6,
    "[Browser] --> [Next.js App (Vercel)] --> [FastAPI ML Service (Render)]\n"
    "                         |\n"
    "                         v\n"
    "             [PostgreSQL DB (Neon)]",
    align="L")
pdf.ln(4)

pdf.sub_title("4.1 Prediction Flow")
pdf.bullet("User submits the lifestyle assessment form (11 inputs).")
pdf.bullet("Next.js API route authenticates the user (JWT cookie) and validates input with Zod.")
pdf.bullet("The input is forwarded to the FastAPI ML service, which returns a probability and risk level.")
pdf.bullet("The lifestyle data and prediction result are saved to PostgreSQL, and the action is logged.")
pdf.bullet("The UI displays the risk level, probability bar, input summary, and tailored recommendations.")

pdf.sub_title("4.2 Authentication & Access Control")
pdf.body(
    "A single login form serves both regular users and administrators. A 'role' field on the "
    "User table distinguishes them. JWT tokens carry the role, and three layers of protection "
    "secure the app: middleware (route-level), layout components (client-side), and API routes "
    "(session verification). Admins redirect to /admin; regular users to /dashboard."
)

# ============ 5. MACHINE LEARNING MODEL ============
pdf.section_title("5. Machine Learning Model")

pdf.sub_title("5.1 Input Features (11)")
pdf.body(
    "Age, BMI, Physical Activity, Smoking Status, Alcohol Consumption, Diet Quality, "
    "Stress Level, Family History, Salt Intake, Sleep Hours, Caffeine Intake."
)

pdf.sub_title("5.2 Training")
pdf.body(
    "A synthetic dataset of 5,000 Nigerian-adult lifestyle records was generated using "
    "rule-based weighted risk scoring. Five candidate algorithms were trained and compared: "
    "Logistic Regression, Decision Tree, Random Forest, Support Vector Machine (SVM), and a "
    "Multi-layer Perceptron (Neural Network)."
)

pdf.sub_title("5.3 Selected Model - SVM")
pdf.table_row(["Metric", "Score"], [60, 130], header=True)
for row in [
    ["Accuracy", "0.782"],
    ["Precision", "0.774"],
    ["Recall", "0.682"],
    ["F1 Score", "0.725"],
    ["ROC-AUC", "0.862"],
]:
    pdf.table_row(row, [60, 130])
pdf.ln(2)
pdf.body(
    "The trained model together with its preprocessing pipeline (OrdinalEncoder + "
    "StandardScaler) is serialized to a single artifact (hypertension_model.pkl) deployed "
    "with the ML service."
)

# ============ 6. FEATURES ============
pdf.section_title("6. Application Features")

pdf.sub_title("6.1 User Features")
pdf.bullet("Registration and login with validation and password visibility toggle.")
pdf.bullet("Hypertension risk assessment form with 11 inputs, inline validation, and loading states.")
pdf.bullet("Result display: color-coded risk card, animated probability bar, input summary.")
pdf.bullet("Personalized health recommendations driven by risk level and individual inputs.")
pdf.bullet("Prediction history with filters (All/Low/Moderate/High) and a detail modal.")
pdf.bullet("Profile management - edit name/gender, change password with verification.")

pdf.sub_title("6.2 Admin Features")
pdf.bullet("Dashboard with stat cards and charts: risk distribution pie, gender split pie, 7-day predictions bar chart, average risk score.")
pdf.bullet("User management: searchable table, delete users with confirmation modal.")
pdf.bullet("View all predictions across all users with risk filter and user search.")
pdf.bullet("System logs viewer with status filters (Success/Failed/Error).")

pdf.sub_title("6.3 UI/UX Polish")
pdf.bullet("Responsive layout for mobile, tablet, and desktop (horizontal-scroll sidebar on mobile).")
pdf.bullet("Toast notifications, skeleton loaders, animated buttons and modals.")
pdf.bullet("Role-aware navbar showing a User/Admin badge and profile dropdown.")

# ============ 7. DATABASE ============
pdf.section_title("7. Database Design")
pdf.body("Four tables implemented via Prisma on PostgreSQL:")
widths = [50, 90, 50]
pdf.table_row(["Table", "Purpose", "Key Fields"], widths, header=True)
for row in [
    ["User", "Accounts (users + admins via role field)", "email, passwordHash, role"],
    ["LifestyleData", "Submitted lifestyle inputs", "11 lifestyle fields"],
    ["PredictionResult", "Prediction outcomes", "riskProbability, riskLevel"],
    ["SystemLog", "Activity audit trail", "activity, status, logTime"],
]:
    pdf.table_row(row, widths)

# ============ 8. DEPLOYMENT ============
pdf.section_title("8. Deployment")
pdf.table_row(["Component", "Platform", "URL"], [55, 50, 85], header=True)
pdf.table_row(["Web App (Next.js)", "Vercel", "predictive-model-chi.vercel.app"], [55, 50, 85])
pdf.table_row(["ML Service (FastAPI)", "Render", "hypertension-ml-service.onrender.com"], [55, 50, 85])
pdf.table_row(["Database", "Neon PostgreSQL", "serverless (managed)"], [55, 50, 85])
pdf.ln(4)
pdf.body(
    "The Next.js app is built with 'prisma generate && next build'. The ML service is deployed "
    "via a Render Blueprint (render.yaml) which runs 'uvicorn app.main:app' against the "
    "committed model artifact."
)

# ============ 9. SCOPE ============
pdf.section_title("9. Scope")
pdf.body(
    "Included: lifestyle-based hypertension risk prediction for Nigerian adults, full web UI, "
    "admin panel, model training and evaluation, personalized recommendations, prediction "
    "history, and user management."
)
pdf.body(
    "Excluded: clinical diagnosis, real-time monitoring, hospital EMR integration, wearable "
    "device sync, and lab/ECG/genetic inputs. The model is trained on synthetic data and is "
    "intended as a decision-support demonstration, not a medical device."
)

# ============ 10. DEMO CREDENTIALS ============
pdf.section_title("10. Demo Credentials")
pdf.table_row(["Role", "Email", "Password"], [40, 100, 50], header=True)
pdf.table_row(["User", "john@example.com", "password123"], [40, 100, 50])
pdf.table_row(["Admin", "admin@healthpredict.com", "admin123"], [40, 100, 50])

pdf.ln(12)
pdf.set_font("helvetica", "I", 10)
pdf.set_text_color(120, 120, 120)
pdf.multi_cell(0, 6, "This document summarizes the implementation of a BSc Computer Science "
                     "final-year project. The complete source code, dataset generator, and "
                     "deployment configurations are available in the project repository.")

output = "project-summary.pdf"
pdf.output(output)
print(f"Generated: {output}")
