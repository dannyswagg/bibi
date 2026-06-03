// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// FAQ toggle
function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  const isOpen = item.classList.contains("open");
  document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
  if (!isOpen) item.classList.add("open");
}

// Form progress
function updateProgress() {
  const required = ["firstName", "lastName", "email", "instagram", "profession", "country", "goal"];
  const filled = required.filter((n) => {
    const el = document.querySelector(`[name="${n}"]`);
    return el && el.value.trim();
  }).length;
  const pct = filled / required.length;
  const steps = document.querySelectorAll(".prog-step");
  steps.forEach((s, i) => {
    s.classList.remove("active", "done");
    const threshold = (i + 1) / steps.length;
    if (pct > threshold) s.classList.add("done");
    else if (pct > i / steps.length) s.classList.add("active");
  });
}

// Scroll to form with hero email pre-fill
function scrollToForm() {
  const heroEmail = document.getElementById("hero-email").value;
  if (heroEmail) {
    const formEmail = document.querySelector('[name="email"]');
    if (formEmail) formEmail.value = heroEmail;
  }
  document.getElementById("waitlist").scrollIntoView({ behavior: "smooth" });
}


function goBack() {
  document.getElementById("ty-page").classList.remove("active");
  document.getElementById("main-page").style.display = "block";
  window.scrollTo(0, 0);
}

function shareWaitlist() {
  const text =
    "I just joined the free Personal Branding Guide waitlist by Bibi Leonard. If you want to build a brand people remember and trust online, you should join too!";
  if (navigator.share) {
    navigator.share({
      title: "Free Personal Branding Guide",
      text,
      url: window.location.href,
    });
  } else {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert("Link copied! Share it with your network."));
  }
}

// Supabase

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://xplotwcukaxzdavolbzm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwbG90d2N1a2F4emRhdm9sYnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MzgzNzksImV4cCI6MjA5NjAxNDM3OX0.let3FfPo3gUxT8zuZBvQbhjWM1E5mi6xGFk8Ua0eKPI"
)

const form = document.getElementById("waitlist-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Inline validation
  const requiredEls = form.querySelectorAll("[required]");
  let valid = true;
  requiredEls.forEach((el) => {
    if (el.type === "checkbox" && !el.checked) {
      el.closest(".form-group, label").style.outline = "2px solid #C8952A";
      valid = false;
    } else if (el.type !== "checkbox" && !el.value.trim()) {
      el.style.borderColor = "#C8952A";
      valid = false;
    } else {
      el.style.borderColor = "";
      el.closest(".form-group, label")?.style.removeProperty("outline");
    }
  });
  if (!valid) {
    const firstErr = form.querySelector('[style*="C8952A"]');
    if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const first_name = document.getElementById("firstName").value.trim();
  const last_name = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const instagram = document.getElementById("instagram").value.trim();
  const linkedin = document.getElementById("linkedin").value.trim();
  const profession = document.getElementById("profession").value.trim();
  const website = document.getElementById("website").value.trim();
  const country = document.getElementById("country").value;
  const experience = document.getElementById("experience").value;
  const audience_size = document.getElementById("audienceSize").value;
  const current_platform = document.getElementById("platform").value;
  const content_type = document.getElementById("contentType").value.trim();
  const branding_challenge = Array.from(document.querySelectorAll('[name="challenge"]:checked')).map((el) => el.value).join('; ');
  const branding_goal = document.getElementById("goal").value.trim();
  const early_access = document.querySelector('[name="earlyAccess"]:checked')?.value || '';
  const one_on_one = document.querySelector('[name="coaching"]:checked')?.value || '';

  try {
    const { data, error } = await supabase.from("users").insert([
      {
        first_name,
        last_name,
        email,
        phone,
        instagram,
        linkedin,
        profession,
        website,
        country,
        experience,
        audience_size,
        current_platform,
        content_type,
        branding_challenge,
        branding_goal,
        early_access,
        one_on_one,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      alert(`Submission failed: ${error.message}\n\nCode: ${error.code}`);
    } else {
      console.log("Data inserted:", data);
      form.reset();
      document.getElementById("main-page").style.display = "none";
      const tyPage = document.getElementById("ty-page");
      tyPage.classList.add("active");
      window.scrollTo(0, 0);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An unexpected error occurred. Please try again.");
  }
});