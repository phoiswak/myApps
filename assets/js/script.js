/* ===== NAVIGATION ===== */
function showPage(page) {
  window.location.href = page === "home" ? "index.html" : page + ".html";
}

/* Set active nav link based on current page */
document.addEventListener("DOMContentLoaded", function () {
  const filename = window.location.pathname.split("/").pop() || "index.html";
  const navMap = {
    "index.html": "nav-home",
    "": "nav-home",
    "about.html": "nav-about",
    "ict.html": "nav-ict",
    "cleaning.html": "nav-cleaning",
    "security.html": "nav-security",
    "contact.html": "nav-contact",
  };
  const el = document.getElementById(navMap[filename]);
  if (el) el.classList.add("active");
});

/* ===== MOBILE MENU ===== */
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
  document.getElementById("hamburger").classList.toggle("open");
}

function closeMobileMenu() {
  document.getElementById("navLinks").classList.remove("open");
  document.getElementById("hamburger").classList.remove("open");
}

/* ===== CONTACT FORM ===== */
var activeService = 'general';

function switchForm(service) {
  activeService = service;
  // Hide all service forms
  document.querySelectorAll('.service-form').forEach(function(el) {
    el.style.display = 'none';
  });
  // Deactivate all tabs
  document.querySelectorAll('.stab').forEach(function(btn) {
    btn.classList.remove('active');
  });
  // Show selected form and activate tab
  var formEl = document.getElementById('form-' + service);
  if (formEl) formEl.style.display = 'block';
  var tabEl = document.querySelector('.stab[data-service="' + service + '"]');
  if (tabEl) tabEl.classList.add('active');
  // Clear error
  var err = document.getElementById('form-error');
  if (err) err.style.display = 'none';
}

// Auto-select form based on URL ?service= param
document.addEventListener('DOMContentLoaded', function() {
  var params = new URLSearchParams(window.location.search);
  var svc = params.get('service');
  if (svc && ['ict', 'cleaning', 'security', 'general'].includes(svc)) {
    switchForm(svc);
  }
});

function submitForm() {
  var name = document.getElementById('f-name');
  var phone = document.getElementById('f-phone');
  var email = document.getElementById('f-email');
  var err = document.getElementById('form-error');

  // Validate common fields
  if (!name || !name.value.trim()) {
    showFormError('Please enter your full name.');
    return;
  }
  if (!phone || !phone.value.trim()) {
    showFormError('Please enter your phone number.');
    return;
  }
  if (!email || !email.value.trim() || !email.value.includes('@')) {
    showFormError('Please enter a valid email address.');
    return;
  }

  // Validate service-specific required fields
  if (activeService === 'ict') {
    var svc = document.getElementById('f-ict-service');
    if (!svc || !svc.value) {
      showFormError('Please select an ICT service.');
      return;
    }
    var msg = document.getElementById('f-ict-msg');
    if (!msg || !msg.value.trim()) {
      showFormError('Please describe your requirements.');
      return;
    }
  }
  if (activeService === 'cleaning') {
    var type = document.getElementById('f-clean-type');
    if (!type || !type.value) {
      showFormError('Please select a cleaning type.');
      return;
    }
    var addr = document.getElementById('f-clean-address');
    if (!addr || !addr.value.trim()) {
      showFormError('Please enter the property address.');
      return;
    }
  }
  if (activeService === 'security') {
    var checked = document.querySelectorAll('input[name="sec-service"]:checked');
    if (checked.length === 0) {
      showFormError('Please select at least one security service.');
      return;
    }
    var proptype = document.getElementById('f-sec-proptype');
    if (!proptype || !proptype.value) {
      showFormError('Please select a property type.');
      return;
    }
    var secAddr = document.getElementById('f-sec-address');
    if (!secAddr || !secAddr.value.trim()) {
      showFormError('Please enter the site address.');
      return;
    }
  }
  if (activeService === 'general') {
    var subj = document.getElementById('f-gen-subject');
    if (!subj || !subj.value.trim()) {
      showFormError('Please enter a subject.');
      return;
    }
    var genMsg = document.getElementById('f-gen-msg');
    if (!genMsg || !genMsg.value.trim()) {
      showFormError('Please enter your message.');
      return;
    }
  }

  // Collect form data
  var formData = new FormData();
  formData.append('service_type', activeService);
  formData.append('name', name.value);
  formData.append('phone', phone.value);
  formData.append('email', email.value);
  formData.append('company', document.getElementById('f-company').value || '');

  // Add service-specific data
  if (activeService === 'ict') {
    formData.append('ict_service', document.getElementById('f-ict-service').value);
    formData.append('ict_users', document.getElementById('f-ict-users').value || '');
    formData.append('ict_date', document.getElementById('f-ict-date').value || '');
    formData.append('ict_msg', document.getElementById('f-ict-msg').value);
  } else if (activeService === 'cleaning') {
    formData.append('clean_type', document.getElementById('f-clean-type').value);
    formData.append('clean_freq', document.getElementById('f-clean-freq').value || '');
    formData.append('clean_size', document.getElementById('f-clean-size').value || '');
    formData.append('clean_date', document.getElementById('f-clean-date').value || '');
    formData.append('clean_address', document.getElementById('f-clean-address').value);
    formData.append('clean_msg', document.getElementById('f-clean-msg').value || '');
  } else if (activeService === 'security') {
    var services = [];
    document.querySelectorAll('input[name="sec-service"]:checked').forEach(function(cb) {
      services.push(cb.value);
    });
    formData.append('sec_services', services.join(', '));
    formData.append('sec_proptype', document.getElementById('f-sec-proptype').value);
    formData.append('sec_cameras', document.getElementById('f-sec-cameras').value || '');
    formData.append('sec_address', document.getElementById('f-sec-address').value);
    formData.append('sec_msg', document.getElementById('f-sec-msg').value || '');
  } else if (activeService === 'general') {
    formData.append('subject', document.getElementById('f-gen-subject').value);
    formData.append('message', document.getElementById('f-gen-msg').value);
  }

  // Send to Formspree
  var formspreeId = 'xnjgbbez';

  // Show loading state
  var submitBtn = document.getElementById('submit-btn');
  var originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  fetch('https://formspree.io/f/' + formspreeId, {
    method: 'POST',
    body: formData
  })
  .then(function(response) {
    if (response.ok) {
      // Show success
      document.querySelector('.contact-form h3').style.display = 'none';
      document.querySelector('.service-tabs').style.display = 'none';
      document.querySelectorAll('.form-row, .service-form, #form-error, #submit-btn').forEach(function(el) {
        el.style.display = 'none';
      });
      document.getElementById('form-success').style.display = 'block';
    } else {
      showFormError('Failed to send message. Please try again or call us at 012 612 0937.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  })
  .catch(function(error) {
    showFormError('Error sending message: ' + error.message);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  });
}

function showFormError(msg) {
  var err = document.getElementById('form-error');
  if (err) {
    err.textContent = msg;
    err.style.display = 'block';
  }
}

function resetForm() {
  document.querySelector('.contact-form h3').style.display = '';
  document.querySelector('.service-tabs').style.display = '';
  document.getElementById('submit-btn').style.display = '';
  document.querySelectorAll('.form-row').forEach(function(el) {
    el.style.display = '';
  });
  document.getElementById('form-success').style.display = 'none';
  // Reset inputs
  document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea').forEach(function(el) {
    el.value = '';
  });
  document.querySelectorAll('input[type="checkbox"]').forEach(function(el) {
    el.checked = false;
  });
  switchForm('general');
}
